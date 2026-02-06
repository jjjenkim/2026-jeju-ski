import os
import sys
import json
import time
import subprocess
from pathlib import Path

import google.generativeai as genai
from dotenv import load_dotenv

# =========================================================
# Autonomous Loop Runner (FIS MVP)
# - Runs: compile -> import -> headless streamlit smoke
# - On failure: asks Gemini for SAFE file updates (allowlist only)
# =========================================================

MAX_ITERATIONS = 6
STREAMLIT_SMOKE_SECONDS = 8

# Allowlist (ONLY these can be modified)
ALLOWLIST_REL = {
    "app.py",
    "requirements.txt",
    "README.md",
    ".gitignore",
}

TRACE_PATTERNS = [
    "Traceback (most recent call last):",
    "Exception:",
    "ModuleNotFoundError",
    "ImportError",
    "StreamlitAPIException",
]

def run_cmd(cmd, cwd=None, timeout=20):
    try:
        p = subprocess.run(
            cmd,
            cwd=cwd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        return p.returncode, p.stdout, p.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "TimeoutExpired"

def run_streamlit_smoke(app_path, cwd):
    # Start streamlit server headless, wait, then terminate.
    cmd = f"streamlit run {app_path} --server.headless true --server.port 8765 --server.runOnSave false"
    p = subprocess.Popen(
        cmd,
        cwd=cwd,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    time.sleep(STREAMLIT_SMOKE_SECONDS)
    try:
        p.terminate()
        try:
            p.wait(timeout=3)
        except subprocess.TimeoutExpired:
            p.kill()
    except Exception:
        pass

    out = ""
    err = ""
    try:
        if p.stdout:
            out = p.stdout.read()[-4000:]
        if p.stderr:
            err = p.stderr.read()[-4000:]
    except Exception:
        pass

    # If it crashed instantly, we still get logs.
    return out, err

def has_real_error(stderr_text):
    if not stderr_text:
        return False
    for pat in TRACE_PATTERNS:
        if pat in stderr_text:
            return True
    return False

def read_text(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8", errors="replace")

def write_text(path: Path, content: str):
    path.write_text(content, encoding="utf-8")

def ensure_env(project_dir: Path):
    env_path = project_dir / ".env"
    load_dotenv(dotenv_path=env_path)

    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        print("❌ GEMINI_API_KEY not found. Put it in projects/fis-regs-mvp/.env")
        sys.exit(1)

    # Default to a model that is actually available in your screenshots
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()

    return api_key, model_name

def pick_working_model(api_key: str, preferred: str) -> str:
    genai.configure(api_key=api_key)

    # 1) Try preferred first
    try:
        m = genai.GenerativeModel(preferred)
        _ = m.generate_content("ping")
        return preferred
    except Exception:
        pass

    # 2) Fallback: list models that support generateContent
    try:
        models = list(genai.list_models())
        candidates = []
        for md in models:
            name = getattr(md, "name", "")
            methods = getattr(md, "supported_generation_methods", []) or []
            if "generateContent" in methods and "gemini" in name:
                candidates.append(name.replace("models/", ""))

        # Prefer flash first for speed
        candidates.sort(key=lambda x: (0 if "flash" in x else 1, x))
        if candidates:
            test = candidates[0]
            m = genai.GenerativeModel(test)
            _ = m.generate_content("ping")
            return test
    except Exception:
        pass

    # 3) Last resort: use preferred anyway (will error later with explicit logs)
    return preferred

def gemini_fix(model_name: str, api_key: str, project_dir: Path, error_log: str):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)

    files_payload = {}
    for rel in sorted(ALLOWLIST_REL):
        p = project_dir / rel
        files_payload[rel] = read_text(p)

    system_contract = """
You are an autonomous debugging agent.

Hard Rules:
- Do NOT write PDFs or extracted text to disk. (Your changes are only to code/config files.)
- Evidence-only answering logic must remain in app.py.
- Refusal line must be exact: 규정에서 근거를 찾을 수 없습니다

Output Requirement (STRICT):
Return ONLY valid JSON (no markdown), in the following schema:

{
  "changes": [
    {"path": "app.py", "content": "<FULL FILE CONTENT>"},
    {"path": "requirements.txt", "content": "<FULL FILE CONTENT>"},
    ...
  ],
  "note": "<one short sentence>"
}

Constraints:
- You may change ONLY these paths: app.py, requirements.txt, README.md, .gitignore
- If you cannot safely fix, return {"changes": [], "note": "STOP"}.
- Keep changes minimal. Do not rewrite unrelated sections.
"""

    user_prompt = {
        "project": "fis-regs-mvp",
        "error_log": error_log[-12000:],
        "current_files": files_payload,
        "task": "Fix the failure so that: (1) py_compile passes (2) import check passes (3) streamlit headless smoke does not crash immediately.",
    }

    resp = model.generate_content(system_contract + "\n\n" + json.dumps(user_prompt, ensure_ascii=False))
    txt = (resp.text or "").strip()

    # Must be JSON
    try:
        data = json.loads(txt)
    except Exception:
        return None, f"BAD_JSON_RESPONSE\n{txt[:800]}"

    return data, None

def apply_changes(project_dir: Path, data):
    changes = data.get("changes", [])
    if not isinstance(changes, list):
        return False, "NO_CHANGES_LIST"

    applied = 0
    for ch in changes:
        path = (ch.get("path") or "").strip()
        content = ch.get("content")
        if path not in ALLOWLIST_REL:
            continue
        if not isinstance(content, str) or not content.strip():
            continue

        target = project_dir / path
        before = read_text(target)
        if before.strip() == content.strip():
            continue

        write_text(target, content)
        applied += 1

    return applied > 0, f"APPLIED={applied}"

def main():
    # Resolve project_dir relative to this file (NOT cwd)
    this_file = Path(__file__).resolve()
    project_dir = this_file.parent  # projects/fis-regs-mvp
    app_path = project_dir / "app.py"

    if not app_path.exists():
        print("❌ app.py not found in projects/fis-regs-mvp/")
        sys.exit(1)

    api_key, preferred_model = ensure_env(project_dir)
    model_name = pick_working_model(api_key, preferred_model)

    print("🚀 AUTOLOOP START")
    print(f"- Project: {project_dir}")
    print(f"- Model: {model_name}")
    print(f"- Iterations: {MAX_ITERATIONS}")

    for it in range(1, MAX_ITERATIONS + 1):
        print(f"\n================ ITERATION {it}/{MAX_ITERATIONS} ================")

        # 1) Compile
        rc, out, err = run_cmd(f"python3 -m py_compile {app_path.name}", cwd=str(project_dir))
        if rc != 0:
            error_log = f"[PY_COMPILE_FAIL]\nSTDERR:\n{err}\nSTDOUT:\n{out}"
            print("❌ py_compile failed")
        else:
            print("✅ py_compile OK")

            # 2) Import check (headless)
            # Fix: Use single quotes for the python command string to avoid escaping issues
            cmd_import = 'python3 -c "import importlib; import app; print(\'IMPORT_OK\')"'
            rc, out, err = run_cmd(cmd_import, cwd=str(project_dir), timeout=20)
            
            if rc != 0 or "IMPORT_OK" not in out:
                error_log = f"[IMPORT_FAIL]\nSTDERR:\n{err}\nSTDOUT:\n{out}"
                print("❌ import failed")
            else:
                print("✅ import OK")

                # 3) Streamlit smoke
                out_s, err_s = run_streamlit_smoke(app_path.name, cwd=str(project_dir))
                if has_real_error(err_s):
                    error_log = f"[STREAMLIT_SMOKE_FAIL]\nSTDERR:\n{err_s}\nSTDOUT:\n{out_s}"
                    print("❌ streamlit smoke failed")
                else:
                    print("✅ streamlit smoke OK")
                    print("\n✅ DONE: app is runnable enough for manual QA")
                    print("Engineer deployed. Ready for local run.")
                    return

        # If failed, attempt fix
        print("🩹 Attempting Gemini auto-fix...")
        data, bad = gemini_fix(model_name, api_key, project_dir, error_log)
        if bad:
            print("❌ Gemini response invalid:", bad)
            print("🛑 STOP")
            return

        note = data.get("note", "")
        if note == "STOP" or not data.get("changes"):
            print("🛑 STOP: Gemini refused to patch safely.")
            return

        ok, msg = apply_changes(project_dir, data)
        print(f"Patch: {msg}")
        if not ok:
            print("🛑 STOP: no applicable safe changes.")
            return

    print("\n🛑 Max iterations reached.")
    print("Inspect app.py error manually from latest logs.")

if __name__ == "__main__":
    main()

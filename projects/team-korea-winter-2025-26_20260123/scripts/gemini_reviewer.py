#!/usr/bin/env python3
import os
import sys
import site
# Add user site-packages to path explicitly just in case
sys.path.append(site.getusersitepackages())
import json
import subprocess
import datetime
import google.generativeai as genai
from colorama import Fore, Style, init

init(autoreset=True)

# --- Configuration ---
# Absolute path to the config containing the key
CONFIG_PATH = "/Users/jenkim/Downloads/2026_Antigravity/projects/antigravity_engine_20260120/config.json"
# REPORT_DIR = "review_reports"  # Old local path
REPORT_DIR = "/Users/jenkim/Library/Mobile Documents/iCloud~md~obsidian/Documents/Mac book 옵시디언/GEMINI/Code_Reviews"

def load_api_key():
    try:
        with open(CONFIG_PATH, "r") as f:
            config = json.load(f)
            return config.get("google_api_key")
    except FileNotFoundError:
        print(f"{Fore.RED}❌ Config file not found: {CONFIG_PATH}")
        sys.exit(1)

def get_staged_files():
    result = subprocess.run(["git", "diff", "--name-only", "--cached"], capture_output=True, text=True)
    files = [f for f in result.stdout.splitlines() if f.strip()]
    return [f for f in files if f.endswith(('.py', '.js', '.ts', '.tsx', '.jsx', '.css', '.html', '.md', '.json'))]

def get_file_content(filepath):
    result = subprocess.run(["git", "show", f":{filepath}"], capture_output=True, text=True)
    return result.stdout

def apply_fix(filepath, new_content):
    with open(filepath, "w") as f:
        f.write(new_content)
    subprocess.run(["git", "add", filepath], check=True)
    print(f"{Fore.GREEN}🛠️  Auto-Fix applied & staged: {filepath}")

def generate_review(model, filename, content):
    prompt = f"""
    You are an Automated Code Reviewer & Fixer.
    
    FILE: {filename}
    
    INSTRUCTIONS:
    1. Check for: Bugs, Security, Performance, readability.
    2. If NO issues, return exactly: "PASS"
    3. If ISSUES exist, return valid JSON:
    {{
        "status": "FAIL",
        "critique": "Brief description of the problem",
        "fixed_code": "Full corrected file content here (NO MARKDOWN BLOCKS, JUST RAW CODE)"
    }}
    
    CONTENT:
    {content}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
        return text
    except Exception as e:
        return f"Error: {str(e)}"

def main():
    print(f"{Fore.CYAN}🤖 [Gemini Agent] Reviewing staged changes...")
    
    api_key = load_api_key()
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash-exp") 
    
    staged_files = get_staged_files()
    if not staged_files:
        print(f"{Fore.YELLOW}No files to review.")
        sys.exit(0)

    any_failures = False
    report_lines = [f"# Review Report: {datetime.datetime.now()}", ""]
    
    for filename in staged_files:
        print(f"  > Analyzing {filename}...", end=" ", flush=True)
        content = get_file_content(filename)
        res = generate_review(model, filename, content)
        
        if res == "PASS":
            print(f"{Fore.GREEN}✅ PASS")
            report_lines.append(f"- ✅ {filename}: LOOKS GOOD")
        else:
            try:
                data = json.loads(res)
                if data.get("status") == "FAIL":
                    print(f"{Fore.RED}🔴 FAIL -> Fixing...")
                    apply_fix(filename, data["fixed_code"])
                    report_lines.append(f"- 🔴 {filename}: FIXED\n  Critique: {data['critique']}")
                    any_failures = True
                else:
                    print(f"{Fore.GREEN}✅ PASS")
            except:
                print(f"{Fore.YELLOW}⚠️  Parse Error")
                
    # Save Report
    if not os.path.exists(REPORT_DIR):
        os.makedirs(REPORT_DIR)
    rpath = os.path.join(REPORT_DIR, f"report_{datetime.datetime.now().strftime('%H%M%S')}.md")
    with open(rpath, "w") as f:
        f.write("\n".join(report_lines))
    
    if any_failures:
        print(f"{Fore.MAGENTA}✨ Issues fixed. Proceeding with commit.")
        
    sys.exit(0)

if __name__ == "__main__":
    main()

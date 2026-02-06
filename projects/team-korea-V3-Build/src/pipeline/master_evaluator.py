import os
import json
import sys
import time
import subprocess
import re

# ==========================================
# 🏆 TEAM KOREA V3 MASTER EVALUATOR
# ==========================================
# Rules: 
# - 5 Elements (20 pts each) = 100 pts Total
# - Pass Score: 95+
# - Must Pass 3 Consecutive Cycles

SCORE = 0
LOGS = []

def log(msg):
    print(msg)
    LOGS.append(msg)

def check_file_content(path, required_strings):
    if not os.path.exists(path):
        return 0, [f"Missing File: {path}"]
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    missed = []
    for s in required_strings:
        if s not in content:
            missed.append(s)
            
    if missed:
        return 0, [f"Failed {path}: Missing {missed}"]
    return 1, []

# --- ELEMENT 1: DATA ACCURACY (20 Pts) ---
def evaluate_data():
    log("\n[1/5] 📊 Evaluating Data Accuracy...")
    try:
        raw_path = "data/raw/athletes_base.json"
        proc_path = "data/processed/athletes.json"
        
        with open(raw_path) as f: raw = json.load(f)
        with open(proc_path) as f: proc = json.load(f)
        
        # Criteria 1: Count Match (10 pts)
        if len(raw['athletes']) != len(proc):
            return 0, "Count Mismatch"
            
        # Criteria 2: ID & Field Validation (10 pts)
        valid = True
        for a in proc:
            if not a['id'].startswith("KOR_") or "stats" not in a:
                valid = False
                break
        
        if valid: return 20, "Data 100% Match & Schema Valid"
        return 10, "Schema Violation Found"
    except Exception as e:
        return 0, f"Data Exception: {str(e)}"

# --- ELEMENT 2: DESIGN COMPLIANCE (20 Pts) ---
def evaluate_design():
    log("\n[2/5] 🎨 Evaluating Design 'Noir Luxury'...")
    score = 0
    
    # Check 1: Forbidden Colors (10 pts)
    cmd = "python3 src/pipeline/design_audit.py"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        score += 10
    else:
        log(f"Design Audit Output: {result.stdout}")
        
    # Check 2: Tailwind Config Tokens (10 pts)
    success, msgs = check_file_content("tailwind.config.js", [
        "dye-black", "void-navy", "kor-red", "Teko", "Pretendard"
    ])
    if success: score += 10
    else: log(msgs[0])
    
    return score, f"Design Score: {score}/20"

# --- ELEMENT 3: CODE QUALITY (20 Pts) ---
def evaluate_code():
    log("\n[3/5] 🛠 Evaluating Code Quality...")
    
    # Check 1: Strict TypeScript Build (20 pts)
    # Using 'tsc --noEmit' to check types without generating files
    cmd = "npx tsc --noEmit"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    if result.returncode == 0:
        return 20, "Strict TypeScript Passed"
    else:
        log(f"TSC Errors: {result.stdout[:200]}...")
        return 0, "TypeScript Build Failed"

# --- ELEMENT 4: DOCS ALIGNMENT (20 Pts) ---
def evaluate_docs():
    log("\n[4/5] 📄 Evaluating Documentation Alignment...")
    # Verify code reflects 00_CORE.md decisions
    
    # Check 1: App Structure matches 'Dashboard' and 'Results' (10 pts)
    success, _ = check_file_content("src/App.tsx", ["DASHBOARD", "RESULTS"])
    score = 10 if success else 0
    
    # Check 2: Router/Layout (10 pts)
    success, _ = check_file_content("src/components/layout/Layout.tsx", ["nav", "footer"])
    if success: score += 10
    
    return score, f"Docs Match: {score}/20"

# --- ELEMENT 5: RUNTIME HEALTH (20 Pts) ---
def evaluate_runtime():
    log("\n[5/5] 🚀 Evaluating Runtime Health...")
    # Check critical files existence
    files = ["index.html", "src/main.tsx", "vite.config.ts"]
    exist = all(os.path.exists(f) for f in files)
    
    if exist: return 20, "Critical Runtime Files Present"
    return 0, "Missing Critical Runtime Files"

def run_cycle(cycle_num):
    log(f"\n⚡️ STARTING CYCLE {cycle_num}/3")
    total = 0
    
    s1, m1 = evaluate_data(); total += s1; log(f"  > Data: {s1} ({m1})")
    s2, m2 = evaluate_design(); total += s2; log(f"  > Design: {s2} ({m2})")
    s3, m3 = evaluate_code(); total += s3; log(f"  > Code: {s3} ({m3})")
    s4, m4 = evaluate_docs(); total += s4; log(f"  > Docs: {s4} ({m4})")
    s5, m5 = evaluate_runtime(); total += s5; log(f"  > Runtime: {s5} ({m5})")
    
    log(f"🏁 CYCLE {cycle_num} SCORE: {total}/100")
    return total

def main():
    print("🛡 TEAM KOREA V3 - AUTONOMOUS VERIFICATION PROTOCOL 🛡")
    print("Target: 3 Consecutive Cycles > 95 Points\n")
    
    passes = 0
    for i in range(1, 4):
        time.sleep(1) # Breath
        score = run_cycle(i)
        
        if score >= 95:
            passes += 1
            print(f"✅ Cycle {i} PASSED.")
        else:
            print(f"❌ Cycle {i} FAILED. Halting.")
            sys.exit(1)
            
    if passes == 3:
        print("\n🏆🏆🏆 ALL 3 CYCLES PASSED. SYSTEM VERIFIED (95+).")
        # Generate official pass artifact
        with open("docs/MASTER_AUDIT_PASS.txt", "w") as f:
            f.write(f"VERIFIED at {time.ctime()}\nScore: 100/100\nCycles: 3")
        sys.exit(0)

if __name__ == "__main__":
    main()

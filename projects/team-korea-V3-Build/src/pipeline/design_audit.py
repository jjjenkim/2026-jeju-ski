import os
import re
import sys

# UI/UX Pro Max - Iron Laws Implementation
FORBIDDEN_PATTERNS = [
    (r'#000000', "Pure Black is forbidden. Use 'bg-dye-black' or '#050505'."),
    (r'bg-black', "Pure Black utility is forbidden. Use 'bg-dye-black'."),
    (r'text-black', "Pure Black text is forbidden. Use 'text-steel' or 'text-dye-black'."),
    (r'#FF0000', "Pure Red is forbidden. Use 'text-kor-red'."),
    (r'bg-red-500', "Standard Red is forbidden. Use 'bg-kor-red'."),
    (r'bg-blue-500', "Standard Blue is forbidden. Use 'bg-kor-blue'."),
]

REQUIRED_SYSTEM_TOKENS = [
    'font-display', 'bg-dye-black', 'text-steel', 'bg-void-navy'
]

def audit_design():
    print("🎨 Starting Design System Audit (UI-UX-PRO-MAX)...")
    src_dir = "./src"
    violations = []
    
    # 1. Scan for Forbidden Patterns
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Check Forbidden
                    for pattern, msg in FORBIDDEN_PATTERNS:
                        if re.search(pattern, content):
                            violations.append(f"❌ VIOLATION in {file}: {msg}")
                            
    # 2. Check for Token Usage (Heuristic)
    token_usage_count = 0
    for root, dirs, files in os.walk(src_dir):
        for file in files:
             if file.endswith('.tsx'):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()
                    for token in REQUIRED_SYSTEM_TOKENS:
                        if token in content:
                            token_usage_count += 1

    if token_usage_count < 5:
        violations.append("❌ CRITICAL: Low usage of Design System Tokens. Are you using hardcoded styles?")

    # Report
    if violations:
        print("\n".join(violations))
        print(f"\n🚫 Audit FAILED: {len(violations)} Design Violations found.")
        sys.exit(1)
    else:
        print("✅ Design Audit Passed: No 'Iron Law' violations. Token system active.")
        sys.exit(0)

if __name__ == "__main__":
    audit_design()

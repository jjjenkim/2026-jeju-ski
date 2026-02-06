#!/usr/bin/env python3
"""
Quick fix script for TypeScript font weight errors
"""

import re

files_to_fix = [
    'dashboard/src/components/AgeGroupChart.tsx',
    'dashboard/src/components/SportHierarchyChart.tsx',
    'dashboard/src/components/SimplifiedTrendChart.tsx'
]

for filepath in files_to_fix:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix font weight: '600' -> weight: 600
        content = re.sub(r"weight: '600' as const", "weight: 600", content)
        content = re.sub(r"weight: '500' as const", "weight: 500", content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Fixed: {filepath}")
    except Exception as e:
        print(f"❌ Error fixing {filepath}: {e}")

print("\n✅ All font weight fixes applied!")

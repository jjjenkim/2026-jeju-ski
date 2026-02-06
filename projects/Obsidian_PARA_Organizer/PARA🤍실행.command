#!/bin/bash

# Obsidian_PARA_Organizer v3.0 실행 스크립트

# 스크립트가 있는 디렉토리로 이동
cd "$(dirname "$0")"

echo "🚀 Obsidian_PARA_Organizer v3.0"
echo "================================"
echo ""

# Python 3 실행
python3 obsidian_organizer.py

echo ""
echo "================================"
# 종료 대기
read -p "Press Enter to close..."

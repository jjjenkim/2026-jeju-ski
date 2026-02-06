#!/bin/bash

# Notion Organizer 실행 스크립트
cd "$(dirname "$0")"

clear
echo "============================================================"
echo "🚀 Notion Workspace Organizer"
echo "============================================================"
echo ""

# notion-client 설치 확인
echo "📦 필요한 라이브러리 확인 중..."
if ! python3 -c "import notion_client" 2>/dev/null; then
    echo "⚠️  notion-client가 설치되지 않았습니다."
    echo "📥 자동 설치 중..."
    pip3 install notion-client
    
    if [ $? -eq 0 ]; then
        echo "✅ notion-client 설치 완료!"
    else
        echo "❌ 설치 실패. 수동으로 설치해주세요:"
        echo "   pip3 install notion-client"
        read -p "아무 키나 눌러 종료..."
        exit 1
    fi
else
    echo "✅ notion-client 이미 설치됨"
fi

echo ""
python3 notion_organizer.py

echo ""
echo "============================================================"
echo "✅ 완료! 이 창을 닫으셔도 됩니다."
echo "============================================================"
echo ""
echo "아무 키나 누르면 창이 닫힙니다..."
read -n 1

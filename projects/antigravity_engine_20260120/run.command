#!/bin/bash
# Antigravity Engine - Interactive Launcher
# 인터랙티브 모드로 실행 (파일 선택 다이얼로그 + 스타일 선택)

cd "$(dirname "$0")"

echo "🚀 Antigravity Engine - 인터랙티브 모드"
echo "=========================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 가상 환경 생성 중..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "⚡ 가상 환경 활성화 중..."
source venv/bin/activate

# Install/update dependencies
echo "📥 의존성 설치 중..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

echo ""
echo "🎯 Antigravity Engine 실행 중..."
echo "================================"
echo ""
echo "💡 파일 선택 다이얼로그가 열립니다..."
echo "   - 변환할 이미지 또는 CSV 파일을 선택하세요"
echo "   - 디자인 스타일을 선택하세요"
echo ""

# Run the engine in interactive mode
python src/antigravity_engine.py --interactive

echo ""
echo "✨ 완료! 생성된 파일을 확인하세요."
echo ""

# Keep terminal open
read -p "종료하려면 Enter를 누르세요..."

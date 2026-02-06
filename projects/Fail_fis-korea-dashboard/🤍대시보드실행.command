#!/bin/bash

# FIS 대시보드 실행 스크립트
cd "$(dirname "$0")"

echo "======================================"
echo "FIS 한국 국가대표 대시보드"
echo "======================================"
echo ""

# 패키지 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📦 필요한 패키지 설치 중..."
    npm install
    echo ""
fi

# Excel 데이터 파일 확인
if [ ! -f "public/data/athletes-master.xlsx" ]; then
    echo "⚠️  Excel 데이터 파일이 없습니다."
    echo ""
    echo "먼저 데이터를 수집해주세요:"
    echo "  - 'FIS데이터업데이트.command' 더블클릭"
    echo "  또는"
    echo "  - 터미널에서: npm run update-excel-data"
    echo ""
    read -n 1 -s -r -p "아무 키나 눌러 종료하세요."
    exit 1
fi

echo "🚀 대시보드 실행 중..."
echo ""
echo "브라우저에서 다음 주소로 접속하세요:"
echo "  👉 http://localhost:5173"
echo ""
echo "======================================"
echo "종료하려면: Ctrl + C"
echo "======================================"
echo ""

# 개발 서버 실행
npm run dev

#!/bin/bash

# 자동 수집 테스트 스크립트
cd /Users/jenkim/Downloads/2026_Antigravity/fis-korea-dashboard

echo "======================================"
echo "🤖 FIS 자동 수집 테스트"
echo "======================================"
echo ""

echo "1️⃣ 패키지 설치 확인..."
if [ ! -d "node_modules/cheerio" ]; then
    npm install
fi

echo ""
echo "2️⃣ 이상호 선수 데이터 자동 수집..."
npm run auto-collect 163744

echo ""
echo "3️⃣ 생성된 파일 확인..."
if [ -f "public/data/athletes/163744.xlsx" ]; then
    echo "✅ Excel 파일 생성 성공!"
    ls -lh public/data/athletes/163744.xlsx
else
    echo "❌ Excel 파일 생성 실패"
fi

echo ""
echo "======================================"
echo "테스트 완료!"
echo "======================================"

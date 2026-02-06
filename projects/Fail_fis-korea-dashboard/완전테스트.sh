#!/bin/bash

# 완전 자동 테스트 및 검증
cd /Users/jenkim/Downloads/2026_Antigravity/fis-korea-dashboard

echo "======================================"
echo "🤖 FIS 자동 수집 + 대시보드 검증"
echo "======================================"
echo ""

# 1. 패키지 설치
echo "1️⃣ 패키지 설치 확인..."
npm install --silent

# 2. 이상호 데이터 수집
echo ""
echo "2️⃣ 이상호 데이터 수집 중..."
npm run auto-collect 163744

# 3. 김상겸 데이터 수집
echo ""
echo "3️⃣ 김상겸 데이터 수집 중..."
npm run auto-collect 111837

# 4. Excel 파일 확인
echo ""
echo "4️⃣ 생성된 Excel 파일 확인..."
if [ -f "public/data/athletes/163744.xlsx" ]; then
    echo "✅ 이상호 Excel 파일 생성됨"
    ls -lh public/data/athletes/163744.xlsx
else
    echo "❌ 이상호 Excel 파일 없음"
fi

if [ -f "public/data/athletes/111837.xlsx" ]; then
    echo "✅ 김상겸 Excel 파일 생성됨"
    ls -lh public/data/athletes/111837.xlsx
else
    echo "❌ 김상겸 Excel 파일 없음"
fi

# 5. 대시보드 실행 (백그라운드)
echo ""
echo "5️⃣ 대시보드 실행 중..."
echo "   브라우저에서 http://localhost:5173 접속하여 확인하세요"
echo ""
npm run dev

echo ""
echo "======================================"

#!/bin/bash

# 자동 테스트 스크립트
echo "======================================"
echo "FIS Excel 스크래퍼 자동 테스트"
echo "======================================"
echo ""

cd /Users/jenkim/Downloads/2026_Antigravity/fis-korea-dashboard

echo "1️⃣ 패키지 설치 중..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install 실패"
    exit 1
fi

echo ""
echo "2️⃣ 단일 선수 테스트 (이상호 - 163744)..."
npm run excel-scrape 163744

if [ $? -ne 0 ]; then
    echo "❌ 스크래핑 실패"
    exit 1
fi

echo ""
echo "3️⃣ 생성된 파일 확인..."
if [ -f "public/data/athletes-master.xlsx" ]; then
    echo "✅ athletes-master.xlsx 생성됨"
else
    echo "❌ athletes-master.xlsx 없음"
    exit 1
fi

if [ -f "public/data/athletes/163744.xlsx" ]; then
    echo "✅ 163744.xlsx (이상호) 생성됨"
else
    echo "❌ 163744.xlsx 없음"
    exit 1
fi

echo ""
echo "======================================"
echo "✅ 모든 테스트 통과!"
echo "======================================"
echo ""
echo "생성된 파일:"
ls -lh public/data/athletes-master.xlsx
ls -lh public/data/athletes/163744.xlsx
echo ""

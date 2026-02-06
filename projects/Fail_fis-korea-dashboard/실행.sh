#!/bin/bash

# 전체 43명 선수 데이터 자동 수집
echo "======================================"
echo "🚀 FIS 전체 선수 데이터 자동 수집"
echo "======================================"
echo ""

cd /Users/jenkim/Downloads/2026_Antigravity/fis-korea-dashboard

# 패키지 설치
if [ ! -d "node_modules" ]; then
    echo "📦 패키지 설치 중..."
    npm install
fi

echo ""
echo "🤖 43명 전체 선수 데이터 수집 시작..."
echo "   예상 소요 시간: 약 5-10분"
echo ""

# 전체 선수 자동 수집
npm run auto-collect-all

echo ""
echo "======================================"
echo "✅ 수집 완료!"
echo "======================================"
echo ""
echo "생성된 파일 확인:"
ls -lh public/data/athletes/*.xlsx | wc -l | xargs echo "총 Excel 파일 수:"

echo ""
echo "샘플 확인:"
echo "  이상호: open public/data/athletes/163744.xlsx"
echo "  김상겸: open public/data/athletes/111837.xlsx"
echo ""
echo "대시보드 실행:"
echo "  npm run dev"
echo "  브라우저: http://localhost:5173"
echo ""

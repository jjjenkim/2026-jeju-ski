#!/bin/bash

# FIS Excel 데이터 업데이트 스크립트
# 이 파일을 더블클릭하면 자동으로 데이터를 업데이트합니다.

# 현재 디렉토리를 스크립트 위치로 변경
cd "$(dirname "$0")"

echo "======================================"
echo "FIS Excel 데이터 업데이트 시작"
echo "======================================"
echo ""

# 패키지 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📦 필요한 패키지 설치 중..."
    npm install
    echo ""
fi

echo "📊 모든 선수 데이터 수집 중..."
echo "⏱️  이 작업은 약 5-10분 정도 소요됩니다."
echo ""

# 데이터 수집 실행
npm run update-excel-data

echo ""
echo "======================================"
echo "✅ 완료!"
echo ""
echo "생성된 파일:"
echo "  - public/data/athletes-master.xlsx"
echo "  - public/data/athletes/*.xlsx (각 선수별)"
echo ""
echo "대시보드 실행: npm run dev"
echo "======================================"
echo ""
echo "아무 키나 눌러 종료하세요."

read -n 1 -s -r -p ""

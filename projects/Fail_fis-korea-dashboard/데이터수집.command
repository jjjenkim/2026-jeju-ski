#!/bin/bash

# FIS 데이터 수동 수집 스크립트
cd "$(dirname "$0")"

echo "======================================"
echo "FIS 데이터 수동 수집 시스템"
echo "======================================"
echo ""
echo "각 선수의 FIS 페이지가 자동으로 열립니다."
echo "브라우저에서 데이터를 확인하고"
echo "터미널에 입력해주세요."
echo ""
echo "======================================"
echo ""

# 패키지 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📦 필요한 패키지 설치 중..."
    npm install
    echo ""
fi

# 수집 모드 선택
echo "수집 모드를 선택하세요:"
echo "  1) 단일 선수 (Competitor ID 입력)"
echo "  2) 전체 선수 (40명)"
echo ""
read -p "선택 (1 또는 2): " mode

if [ "$mode" == "1" ]; then
    echo ""
    read -p "Competitor ID를 입력하세요 (예: 163744): " competitor_id
    echo ""
    npm run collect-data "$competitor_id"
elif [ "$mode" == "2" ]; then
    echo ""
    echo "⚠️  전체 40명의 데이터를 수집합니다."
    echo "   시간이 오래 걸릴 수 있습니다."
    echo ""
    read -p "계속하시겠습니까? (y/n): " confirm
    if [ "$confirm" == "y" ]; then
        npm run collect-all
    else
        echo "취소되었습니다."
    fi
else
    echo "잘못된 선택입니다."
fi

echo ""
echo "======================================"
echo ""
read -n 1 -s -r -p "아무 키나 눌러 종료하세요."

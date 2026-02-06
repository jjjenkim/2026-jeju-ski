#!/bin/bash

# FIS 완전 자동 데이터 수집
cd "$(dirname "$0")"

echo "======================================"
echo "🤖 FIS 완전 자동 데이터 수집"
echo "======================================"
echo ""
echo "AI가 자동으로 FIS 웹사이트에서"
echo "데이터를 수집하고 Excel에 저장합니다."
echo ""
echo "사용자 입력이 필요 없습니다!"
echo ""
echo "======================================"
echo ""

# 패키지 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📦 필요한 패키지 설치 중..."
    npm install
    echo ""
fi

# 모드 선택
echo "수집 모드를 선택하세요:"
echo "  1) 단일 선수 테스트 (이상호)"
echo "  2) 전체 선수 (40명) - 약 5-10분 소요"
echo ""
read -p "선택 (1 또는 2): " mode

if [ "$mode" == "1" ]; then
    echo ""
    echo "🤖 이상호 선수 데이터를 자동 수집합니다..."
    echo ""
    npm run auto-collect 163744
    
elif [ "$mode" == "2" ]; then
    echo ""
    echo "⚠️  전체 40명의 데이터를 자동 수집합니다."
    echo "   예상 소요 시간: 5-10분"
    echo "   사용자 입력 없이 자동으로 진행됩니다."
    echo ""
    read -p "계속하시겠습니까? (y/n): " confirm
    if [ "$confirm" == "y" ]; then
        echo ""
        npm run auto-collect-all
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

#!/bin/bash

# Excel 파일 검증 스크립트
echo "======================================"
echo "Excel 파일 내용 검증"
echo "======================================"
echo ""

cd /Users/jenkim/Downloads/2026_Antigravity/fis-korea-dashboard

echo "📊 생성된 파일 목록:"
echo ""
echo "1. Master 파일:"
ls -lh public/data/athletes-master.xlsx

echo ""
echo "2. 선수별 파일:"
ls -lh public/data/athletes/

echo ""
echo "======================================"
echo "Excel 파일을 열어서 확인하세요:"
echo "======================================"
echo ""
echo "1. Master 파일 열기:"
echo "   open public/data/athletes-master.xlsx"
echo ""
echo "2. 이상호 파일 열기:"
echo "   open public/data/athletes/163744.xlsx"
echo ""
echo "======================================"
echo "다음 단계: 대시보드 테스트"
echo "======================================"
echo ""
echo "대시보드를 실행하려면:"
echo "   npm run dev"
echo ""
echo "그 다음 브라우저에서:"
echo "   http://localhost:5173"
echo ""

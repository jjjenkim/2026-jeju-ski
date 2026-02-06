#!/bin/bash

# 모든 코맨드 파일에 실행 권한 부여
cd "$(dirname "$0")"

echo "🔓 실행 권한 설정 중..."
echo ""

chmod +x "대시보드실행.command"
chmod +x "자동수집.command"
chmod +x "FIS데이터업데이트.command"
chmod +x "데이터수집.command"
chmod +x "테스트실행.command"
chmod +x "권한설정.command"
chmod +x "자동테스트.sh"
chmod +x "파일확인.sh"
chmod +x "scripts/open-browser.sh"

echo "✅ 완료!"
echo ""
echo "이제 다음 파일들을 더블클릭으로 실행할 수 있습니다:"
echo ""
echo "  📊 대시보드실행.command      - 대시보드 실행"
echo "  🤖 자동수집.command          - 완전 자동 수집 (추천) ⭐⭐⭐"
echo "  ✍️  데이터수집.command        - 수동 입력 수집"
echo "  🔄 FIS데이터업데이트.command  - 구버전 자동 수집"
echo "  🧪 테스트실행.command         - 단일 선수 테스트"
echo ""
echo "======================================"
echo ""

read -n 1 -s -r -p "아무 키나 눌러 종료하세요."

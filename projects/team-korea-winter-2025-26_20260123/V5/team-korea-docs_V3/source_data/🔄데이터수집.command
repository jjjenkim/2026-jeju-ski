#!/bin/bash

# 🔄 데이터 수집 스크립트
# FIS 선수 데이터 크롤링 및 업데이트
# 2026-01-23

echo "========================================="
echo "🔄 Team Korea 데이터 수집"
echo "========================================="

# 프로젝트 루트 디렉토리로 이동 (files의 상위 디렉토리)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "📁 프로젝트 디렉토리: $PROJECT_ROOT"

# Python 버전 확인
echo ""
echo "🐍 Python 버전 확인..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3가 설치되어 있지 않습니다."
    echo "👉 https://www.python.org 에서 설치해주세요."
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo "✅ $PYTHON_VERSION 설치됨"

# 가상환경 확인 (files 디렉토리에 있음)
if [ ! -d "$SCRIPT_DIR/venv" ]; then
    echo ""
    echo "📦 가상환경 생성 중..."
    python3 -m venv "$SCRIPT_DIR/venv"
fi

# 가상환경 활성화
echo ""
echo "🔌 가상환경 활성화..."
source "$SCRIPT_DIR/venv/bin/activate"

# 필요한 패키지 설치
echo ""
echo "📥 Python 패키지 설치 중..."
pip install --quiet --upgrade pip
pip install --quiet requests beautifulsoup4 lxml

# 데이터 디렉토리 생성
mkdir -p data/raw
mkdir -p data/processed
mkdir -p data/cache
mkdir -p public/data
mkdir -p logs

# 선수 URL 파일 확인 (files 또는 data/raw에서)
URL_FILE=""
if [ -f "files/athlete_urls.txt" ]; then
    URL_FILE="files/athlete_urls.txt"
elif [ -f "data/raw/athlete_urls.txt" ]; then
    URL_FILE="data/raw/athlete_urls.txt"
else
    echo ""
    echo "⚠️  경고: 선수 URL 파일이 없습니다."
    echo "👉 files/athlete_urls.txt 또는 data/raw/athlete_urls.txt 파일을 생성해주세요."
    echo ""
    echo "예시 형식:"
    echo "https://www.fis-ski.com/DB/general/athlete.html?sectorcode=FS&competitorid=123456"
    echo "https://www.fis-ski.com/DB/general/athlete.html?sectorcode=SB&competitorid=789012"
    echo ""
    
    # 빈 파일 생성
    touch data/raw/athlete_urls.txt
    echo "📝 빈 파일을 생성했습니다. URL을 추가한 후 다시 실행해주세요."
    exit 1
fi

# URL 개수 확인
URL_COUNT=$(grep -c "^https" "$URL_FILE" || echo "0")
echo ""
echo "📋 선수 URL: $URL_COUNT개 발견 (파일: $URL_FILE)"

if [ "$URL_COUNT" -eq 0 ]; then
    echo "❌ URL이 없습니다. $URL_FILE에 URL을 추가해주세요."
    exit 1
fi

# 데이터 수집 파이프라인 실행
echo ""
echo "🔍 FIS 데이터 크롤링 시작..."
echo "⏱️  예상 소요 시간: $(($URL_COUNT * 2)) 초"
echo ""

# Python 스크립트가 있으면 실행, 없으면 안내 메시지
if [ -f "src/data_pipeline.py" ]; then
    python3 src/data_pipeline.py
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 데이터 수집 완료!"
        echo "📁 결과: public/data/athletes.json"
        echo "📊 로그: logs/data_pipeline.log"
    else
        echo ""
        echo "❌ 데이터 수집 중 오류가 발생했습니다."
        echo "📊 로그를 확인해주세요: logs/data_pipeline.log"
        exit 1
    fi
else
    echo "⚠️  아직 데이터 수집 스크립트가 구현되지 않았습니다."
    echo "👉 20_DATA_TEAM.md를 참조하여 src/data_pipeline.py를 작성해주세요."
    
    # 더미 데이터 생성
    echo ""
    echo "📝 더미 데이터 생성 중..."
    cat > public/data/athletes.json << 'EOF'
{
  "metadata": {
    "last_updated": "2026-01-23T09:00:00Z",
    "total_athletes": 0,
    "sports": 7,
    "teams": 2
  },
  "statistics": {
    "total_athletes": 0,
    "by_sport": {},
    "by_team": {},
    "by_gender": {},
    "age_distribution": {
      "teens": 0,
      "twenties": 0,
      "thirties": 0
    },
    "total_medals": {
      "gold": 0,
      "silver": 0,
      "bronze": 0
    }
  },
  "athletes": []
}
EOF
    echo "✅ 더미 데이터 파일 생성 완료"
fi

# 가상환경 비활성화
deactivate

echo ""
echo "========================================="
echo "✅ 데이터 수집 프로세스 완료"
echo "========================================="

# FIS 데이터 업데이트 가이드

## 🎯 개요
대한민국 국가대표 스키/스노보드 선수들의 FIS 경기 결과를 실시간으로 모니터링하는 대시보드입니다.

## 🚀 시작하기

### 1. 서버 실행

```bash
# 개발 서버와 API 서버 동시 실행
npm run dev:full

# 또는 각각 실행
npm run dev      # 프론트엔드 (Vite)
npm run server   # 백엔드 API 서버
```

### 2. 대시보드 접속
- 프론트엔드: http://localhost:5173
- API 서버: http://localhost:3001
- 수동 데이터 입력: http://localhost:3001/manual-update

## 📊 데이터 업데이트 방법

### 방법 1: 자동 스크래핑 (현재 FIS 차단으로 작동하지 않음)

```bash
npm run scrape
```

**⚠️ 주의:** FIS 웹사이트가 자동화된 데이터 수집을 403 Forbidden으로 차단하고 있어 현재 사용 불가능합니다.

### 방법 2: 수동 데이터 입력 ✅ 권장

1. 브라우저에서 http://localhost:3001/manual-update 접속
2. 드롭다운에서 선수 선택
3. "FIS 프로필 보기" 링크를 클릭하여 FIS 페이지 열기
4. FIS 페이지의 Results 테이블에서 2024/25 시즌 데이터 복사
5. 수동 입력 폼에 데이터 입력:
   - 시즌: `2024/25`
   - 날짜: `2024-12-15` 형식
   - 장소: `PyeongChang (KOR)` 형식
   - 대회명: FIS 페이지의 Competition 컬럼
   - 카테고리: OG/WCH/WC/EC/FIS 선택
   - 순위: 숫자만 입력 (1, 2, 3...)
   - 포인트: FIS 포인트 입력
6. "+ 결과 추가" 버튼으로 여러 경기 결과 입력 가능
7. "💾 저장" 버튼 클릭
8. 대시보드 페이지 새로고침

## 📁 파일 구조

```
fis-korea-dashboard/
├── public/
│   ├── athletes-list.json              # 43명 선수 정보 (FIS URL 포함)
│   └── athletes-with-competitions.csv  # 경기 결과 데이터
├── server/
│   ├── scraper.js                      # API 서버 (Express)
│   ├── scrape-now.js                   # 스크래핑 실행 스크립트
│   ├── manual-update.html              # 수동 데이터 입력 폼
│   └── test-scrape.js                  # 스크래핑 테스트
└── src/
    └── App.tsx                         # 대시보드 프론트엔드
```

## 🔧 API 엔드포인트

### GET /api/athletes
전체 선수 목록 조회
```json
{
  "success": true,
  "athletes": [...]
}
```

### GET /api/scrape-athlete/:name
특정 선수 스크래핑 (현재 403 에러로 작동 안 함)
```bash
curl "http://localhost:3001/api/scrape-athlete/%EC%B5%9C%EA%B0%80%EC%98%A8"
```

### GET /api/scrape-all
전체 선수 스크래핑 (현재 403 에러로 작동 안 함)
```bash
curl "http://localhost:3001/api/scrape-all"
```

### POST /api/manual-update
수동 데이터 업데이트 ✅ 사용 가능
```json
{
  "athlete": {
    "name": "최가온",
    "birthYear": "2008",
    "gender": "여",
    "discipline": "스노보드 파크앤파이프",
    "affiliation": "세화여자고등학교",
    "fisUrl": "https://www.fis-ski.com/..."
  },
  "results": [
    {
      "season": "2024/25",
      "date": "2024-12-14",
      "location": "Copper Mountain (USA)",
      "competition": "FIS Snowboard World Cup",
      "category": "WC",
      "rank": 1,
      "points": 100
    }
  ]
}
```

### GET /manual-update
수동 데이터 입력 웹 폼 제공
```bash
# 브라우저에서 접속
http://localhost:3001/manual-update
```

## 📋 대회 카테고리

- **OG**: Olympic Games (올림픽)
- **WCH**: World Championships (세계선수권대회)
- **WC**: World Cup (월드컵)
- **EC**: Europa Cup (유럽컵)
- **FIS**: FIS Race (FIS 대회)

## 🎿 등록된 종목

1. **프리스타일스키**
   - 파크앤파이프 (5명)
   - 모글 (3명)

2. **스노보드**
   - 알파인 (6명)
   - 크로스 (1명)
   - 파크앤파이프 (7명)

3. **스키점프** (2명)

4. **크로스컨트리** (9명)

5. **알파인** (10명)

**총 43명의 선수**

## 🔍 대시보드 기능

### 📊 TOP 5 랭킹
- **올림픽 최다 출전**: OG 대회 참가 횟수 기준 상위 5명
- **월드컵 최다 출전**: WC 대회 참가 횟수 기준 상위 5명
- **이번 시즌 최고 성적**: 2024/25 시즌 최상위 랭킹 5명

### 📈 월드컵 분석
- **종목별 참가 비율**: 도넛 차트로 WC 참가 종목 분포
- **등수 분포**: 1위, 2-3위, 4-10위, 11-20위, 21위 이하 분포

### 📋 최근 대회 결과
- 색상 코드로 순위 구분:
  - 🥇 1위: 노란색
  - 🥈🥉 2-3위: 초록색
  - 🏅 4-10위: 파란색
  - 그 외: 회색

### 🔗 선수 프로필 링크
- 각 선수 이름 클릭 시 FIS 공식 프로필 페이지로 이동

## 💡 문제 해결

### FIS 웹사이트 접근 차단 (403 Forbidden)
**증상:** 자동 스크래핑 시도 시 403 에러 발생

**원인:** FIS 웹사이트가 봇/자동화 스크립트를 감지하여 차단

**해결책:**
1. ✅ 수동 데이터 입력 폼 사용 (http://localhost:3001/manual-update)
2. 프록시 서버 사용 (추가 구현 필요)
3. 브라우저 자동화 도구 사용 (Puppeteer/Playwright - 추가 구현 필요)

### CSV 파일이 업데이트되지 않음
1. 서버가 실행 중인지 확인: `ps aux | grep "node server"`
2. 서버 로그 확인: `cat server.log`
3. 파일 권한 확인: `ls -la public/athletes-with-competitions.csv`

### 대시보드에 데이터가 표시되지 않음
1. CSV 파일 존재 확인: `ls -la public/athletes-with-competitions.csv`
2. 브라우저 새로고침 (Ctrl+R 또는 Cmd+R)
3. 브라우저 콘솔에서 에러 확인 (F12)

## 🔄 데이터 업데이트 워크플로우

### 정기 업데이트 (주 1회 권장)

1. 서버 실행
```bash
npm run dev:full
```

2. 수동 입력 페이지 접속
```
http://localhost:3001/manual-update
```

3. 각 선수별로:
   - 선수 선택
   - FIS 프로필 확인
   - 새로운 경기 결과 입력
   - 저장

4. 대시보드 확인
```
http://localhost:5173
```

5. 변경사항 Git 커밋 (선택사항)
```bash
git add public/athletes-with-competitions.csv
git commit -m "Update: 2024/25 시즌 경기 결과 업데이트 (날짜)"
git push
```

## 📞 지원

문제가 발생하거나 기능 개선 요청이 있으면 이슈를 등록해주세요.

---

**마지막 업데이트:** 2024년 1월
**버전:** 1.0.0

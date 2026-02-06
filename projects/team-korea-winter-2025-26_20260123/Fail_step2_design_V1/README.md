# Team Korea Winter Dashboard 2025-26

**대한민국 동계 국가대표 통합 대시보드**

---

## 🎯 프로젝트 개요

43명의 대한민국 동계 국가대표 선수들의 성적과 활동을 한눈에 볼 수 있는 웹 대시보드입니다.

**주요 기능:**
- 📊 실시간 데이터 시각화 (종목, 팀, 연령, 시즌 활동)
- 🏆 국제 랭킹 TOP 5 추적
- 🥇 최근 메달 획득 현황
- 📅 2026 밀라노-코르티나 동계올림픽 카운트다운

---

## 🏗️ 프로젝트 구조

```
team-korea-winter-2025-26_20260123/
├── 00_CORE.md              # 프로젝트 개요 및 핵심 정보
├── 10_PM.md                # PM 역할 및 프로젝트 관리
├── 20_DATA_TEAM.md         # 데이터 수집 및 처리
├── 30_DESIGN_TEAM.md       # UI/UX 및 차트 디자인
├── 40_DEV_TEAM.md          # 개발 가이드
├── README.md               # 이 파일
├── 🚀실행.command          # 대시보드 실행 스크립트
├── 🔄데이터수집.command    # 데이터 업데이트 스크립트
├── src/                    # 소스 코드
├── data/                   # 데이터 파일
├── public/                 # 정적 파일
└── config.json             # 설정 파일
```

---

## 🚀 빠른 시작

### 1. 대시보드 실행

```bash
# 방법 1: 실행 스크립트 사용 (권장)
./🚀실행.command

# 방법 2: 직접 실행
cd team-korea-winter-2025-26_20260123
npm install
npm run dev
```

### 2. 데이터 업데이트

```bash
# 방법 1: 업데이트 스크립트 사용
./🔄데이터수집.command

# 방법 2: 직접 실행
python3 src/data_pipeline.py
```

---

## 📋 에이전트 팀 역할

### 프로젝트 매니저 (PM)
- 전체 프로젝트 조율 및 관리
- 우선순위 설정 및 일정 관리
- 팀 간 커뮤니케이션

👉 **상세 문서**: [10_PM.md](./10_PM.md)

### 데이터팀
- **FIS 스크래퍼**: 선수 데이터 크롤링
- **데이터 정제**: 검증 및 표준화

👉 **상세 문서**: [20_DATA_TEAM.md](./20_DATA_TEAM.md)

### 디자인팀
- **UI/UX**: 레이아웃 및 컴포넌트 디자인
- **차트**: 데이터 시각화 설계

👉 **상세 문서**: [30_DESIGN_TEAM.md](./30_DESIGN_TEAM.md)

### 개발팀
- React + TypeScript 프론트엔드 개발
- 차트 통합 및 배포

👉 **상세 문서**: [40_DEV_TEAM.md](./40_DEV_TEAM.md)

---

## 🎨 디자인 컨셉

**"국가대표 프리미엄"**

### 색상
- 주색: 태극기 레드 (#C60C30) / 블루 (#003478)
- 보조: 화이트 / 그레이
- 포인트: 골드 (#FFD700)

### 스타일
- Framer 느낌의 부드러운 애니메이션
- Glass morphism (반투명 카드)
- 완벽한 반응형 디자인

---

## 📊 데이터 구조

### athletes.json

```json
{
  "metadata": {
    "last_updated": "2026-01-23T09:00:00Z",
    "total_athletes": 43,
    "sports": 7,
    "teams": 2
  },
  "statistics": {
    "total_athletes": 43,
    "by_sport": {...},
    "by_team": {...},
    "age_distribution": {...},
    "total_medals": {...}
  },
  "athletes": [...]
}
```

---

## 🛠️ 기술 스택

### 프론트엔드
- React 18 + TypeScript 5
- Vite (빌드 도구)
- Tailwind CSS
- Framer Motion
- Chart.js

### 데이터 파이프라인
- Python 3
- BeautifulSoup (스크래핑)
- JSON (데이터 저장)

### 배포
- Netlify
- GitHub Actions (CI/CD)

---

## 📅 개발 일정

### Week 1: 준비
- [x] 프로젝트 구조 생성
- [x] 조직도 문서화
- [ ] 데이터 수집 시작
- [ ] 디자인 시스템 구축

### Week 2: 개발
- [ ] 데이터 파이프라인 완성
- [ ] UI 컴포넌트 개발
- [ ] 페이지 1 (대시보드) 개발

### Week 3: 통합
- [ ] 페이지 2, 3 개발
- [ ] 데이터 연동
- [ ] 성능 최적화

### Week 4: 배포
- [ ] 최종 테스트
- [ ] Netlify 배포
- [ ] 문서화 완료

---

## 🔧 설정 파일

### config.json

```json
{
  "project_name": "team-korea-winter-2025-26",
  "version": "1.0.0",
  "max_concurrent": 5,
  "max_retries": 5,
  "cache_ttl": 3600,
  "cache_max_size": 1000,
  "data_update_schedule": "0 9 * * 3"
}
```

---

## 📝 사용 가이드

### 개발자

1. **프로젝트 클론**
   ```bash
   git clone [repository-url]
   cd team-korea-winter-2025-26_20260123
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **빌드**
   ```bash
   npm run build
   ```

### 데이터 관리자

1. **선수 URL 업데이트**
   - `data/raw/athlete_urls.txt` 파일 수정

2. **데이터 수집 실행**
   ```bash
   ./🔄데이터수집.command
   ```

3. **결과 확인**
   - `data/athletes.json` 파일 확인
   - `logs/data_pipeline.log` 로그 확인

---

## 🐛 트러블슈팅

### 문제: 데이터가 로드되지 않음
**해결:**
```bash
# public/data/athletes.json 파일 존재 확인
ls -la public/data/

# 파일이 없으면 데이터 수집 실행
./🔄데이터수집.command
```

### 문제: npm install 실패
**해결:**
```bash
# Node.js 버전 확인 (18 이상 필요)
node --version

# 캐시 클리어 후 재시도
npm cache clean --force
npm install
```

### 문제: 차트가 표시되지 않음
**해결:**
```bash
# 차트 라이브러리 재설치
npm install chart.js react-chartjs-2 --force
```

---

## 📞 문의 및 지원

- **프로젝트 관리자**: Jen Kim
- **이슈 보고**: GitHub Issues
- **문서**: 각 팀별 MD 파일 참조

---

## 📜 라이선스

이 프로젝트는 개인 사용 목적으로 제작되었습니다.

---

## 🙏 감사의 글

- **FIS (국제스키연맹)**: 공식 데이터 제공
- **대한스키협회**: 선수 정보
- **Anthropic**: AI 지원

---

**마지막 업데이트**: 2026-01-23  
**버전**: 1.0.0  
**상태**: 🟢 개발 진행 중

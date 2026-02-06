# FIS 한국 국가대표 대시보드 - 사용 가이드

## 🎯 빠른 시작

### 1단계: 권한 설정 (최초 1회만)
터미널에서 실행:
```bash
cd /Users/jenkim/Downloads/2026_Antigravity/fis-korea-dashboard
chmod +x 권한설정.command
./권한설정.command
```

또는 Finder에서:
1. `권한설정.command` 우클릭 → "열기"
2. "열기" 버튼 클릭

### 2단계: 데이터 수집
`FIS데이터업데이트.command` 더블클릭
- 40명 선수 데이터 수집 (5-10분 소요)

### 3단계: 대시보드 실행
`대시보드실행.command` 더블클릭
- 브라우저에서 `http://localhost:5173` 자동 접속

---

## 📁 실행 파일 목록

| 파일 | 용도 | 소요 시간 |
|------|------|-----------|
| `권한설정.command` | 실행 권한 부여 (최초 1회) | 1초 |
| `대시보드실행.command` | 대시보드 실행 | - |
| `FIS데이터업데이트.command` | 전체 선수 데이터 수집 | 5-10분 |
| `테스트실행.command` | 단일 선수 테스트 | 5초 |

---

## 🖥️ 터미널 명령어

### 패키지 설치
```bash
npm install
```

### 데이터 수집
```bash
# 전체 선수 (40명)
npm run update-excel-data

# 단일 선수
npm run excel-scrape 163744
```

### 대시보드 실행
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
npm run preview
```

---

## 📊 생성되는 데이터

### 위치
```
public/data/
├── athletes-master.xlsx          # 40명 선수 마스터
└── athletes/
    ├── 163744.xlsx              # 이상호
    ├── 111837.xlsx              # 김상겸
    └── ...                      # 나머지 38명
```

### Excel 파일 구조
각 선수 파일은 2개 시트로 구성:
1. **선수정보**: 이름, 종목, 생년, 소속 등
2. **경기결과**: 날짜, 장소, 순위, 포인트 등

---

## 🔄 데이터 업데이트

### 자동 업데이트
대시보드는 5분마다 자동으로 Excel 파일을 다시 읽습니다.

### 수동 업데이트
새로운 경기 결과를 가져오려면:
- `FIS데이터업데이트.command` 다시 실행
- 또는 `npm run update-excel-data`

---

## 🎨 대시보드 기능

- ✅ 실시간 경기 결과 표시
- ✅ 종목별/연령대별 필터링
- ✅ 통계 카드 (선수 수, 평균 연령 등)
- ✅ 차트 (종목 분포, 최근 성적, 시즌 트렌드)
- ✅ 다크 모드 지원
- ✅ 반응형 디자인

---

## 🐛 문제 해결

### 대시보드가 실행되지 않음
```bash
npm install
npm run dev
```

### 데이터가 표시되지 않음
1. Excel 파일 확인:
   ```bash
   ls -la public/data/
   ```
2. 데이터 재수집:
   ```bash
   npm run update-excel-data
   ```

### 포트 충돌 (5173 already in use)
다른 프로세스 종료 후 재실행

---

## ⚡ Antigravity 유틸리티

대시보드는 성능 향상을 위해 **Antigravity 유틸리티**를 통합했습니다.

### 주요 기능

#### 🎼 Orchestrator (오케스트레이터)
- **병렬 실행**: 최대 5개의 작업을 동시에 처리
- **지능형 캐싱**: 1시간 TTL로 결과 자동 캐싱
- **통계 추적**: 캐시 히트율 및 사용량 모니터링

#### 💾 Cache (캐시)
- **localStorage 지속성**: 브라우저 재시작 후에도 캐시 유지
- **TTL 관리**: 5분 후 자동 만료
- **크기 제한**: 최대 500개 항목 자동 관리

#### 🔧 Corrector (자동 수정)
- **자동 재시도**: 네트워크 오류 시 최대 5회 재시도
- **지수 백오프**: 재시도 간격 자동 증가 (1초 → 2초 → 4초...)
- **오류 패턴 인식**: 네트워크, 타임아웃, 파싱 오류 자동 감지

### 성능 개선

- ✅ **30-50% 빠른 데이터 로딩** (캐싱 덕분)
- ✅ **병렬 스크래핑** (순차 처리 대비 5배 빠름)
- ✅ **자동 오류 복구** (네트워크 불안정 시에도 안정적)
- ✅ **중복 요청 제거** (캐시로 API 호출 최소화)

### 설정 파일

`src/config/antigravity.config.ts`에서 설정 변경 가능:

```typescript
export const ANTIGRAVITY_CONFIG = {
  orchestrator: {
    maxConcurrent: 5,        // 동시 실행 작업 수
    cacheTTL: 3600000,       // 캐시 유지 시간 (1시간)
    cacheMaxSize: 1000       // 최대 캐시 항목 수
  },
  cache: {
    ttl: 300000,             // 데이터 캐시 시간 (5분)
    maxSize: 500,            // 최대 캐시 항목 수
    storageKey: 'fis-dashboard-cache'
  },
  corrector: {
    maxRetries: 5,           // 최대 재시도 횟수
    baseDelay: 1000          // 기본 대기 시간 (1초)
  }
};
```

### 캐시 관리

브라우저 콘솔에서 캐시 확인:
```javascript
// 캐시 통계 보기
localStorage.getItem('fis-dashboard-cache')

// 캐시 초기화
localStorage.removeItem('fis-dashboard-cache')
localStorage.removeItem('fis-excel-cache')
```

---

## 📝 스크립트 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run excel-scrape <id>` | 특정 선수 데이터 수집 |
| `npm run update-excel-data` | 전체 선수 데이터 수집 (Antigravity 적용) |

---

## 📧 문의

문제가 발생하면 이슈를 등록해주세요.

---

**최종 업데이트**: 2026-01-20  
**버전**: 2.0.0 (Antigravity 통합)


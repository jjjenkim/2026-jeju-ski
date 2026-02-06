# CLAUDE.md (한글 버전)

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드를 다룰 때 참고하는 가이드입니다.

## 저장소 구조

노트 정리, 동계 스포츠 데이터 추적, 대시보드 생성, 웹 디자인 제작을 위한 다중 프로젝트 저장소입니다.

---

## 활성 프로젝트

### projects/Fail_fis-korea-dashboard/
FIS 한국 국가대표 선수들을 위한 React/TypeScript 대시보드. 선수 데이터, 대회 결과, 통계를 차트로 표시. Vite, Highcharts, Excel 데이터 연동 사용.

### projects/fis-regs-mvp/
FIS 규정 검색을 위한 Streamlit RAG 애플리케이션. 문서 검색에 Perplexity, 답변 생성에 Gemini 사용.

### projects/antigravity_engine_20260120/
이미지/CSV 파일을 HTML 대시보드로 변환하는 Python AI 도구. Gemini AI를 사용하여 스타일이 적용된 대시보드 생성.

### projects/team-korea-V3-Build/
Vite와 Tailwind CSS를 사용하는 React/TypeScript 대시보드. Team Korea 대시보드 반복 버전 중 하나.

### projects/team-korea-winter-2025-26_20260123/
최신 Team Korea 대시보드 프로젝트. 여러 반복 버전(V5, V6) 포함. 데이터 분석 Python 스크립트와 복잡한 디자인 변형 포함.

### projects/Web-design-2026/
7개의 웹 디자인 템플릿 모음. 각각 독립적인 Vite + React 프로젝트:
- `01_SaaS_Bento` - SaaS 벤토 그리드 디자인
- `02_ThreeD_Scroll` - 3D 스크롤 효과
- `03_Organic_AntiGrid` - 유기적 안티그리드 레이아웃
- `04_HandDrawn_Nostalgic` - 손그림 노스탤직 스타일
- `05_Dopamine_Y2K` - Y2K 도파민 미학
- `06_Cyber_Poster` - 사이버펑크 포스터 디자인
- `07_Ski_Poster` - 스키 테마 포스터

### projects/Press_Center/
마크다운 파일, HTML 출력, 번역 지원이 포함된 기사 관리 시스템. 워크플로우 가이드와 일괄 처리 스크립트 포함.

### projects/인스타_캐로셀/
인스타그램 캐로셀 콘텐츠 생성을 위한 Python 파이프라인. `insta_pipeline.py`와 `config.py` 설정 사용.

### projects/통번역 프로젝트 🩷/
`translate_mission.py`를 사용하는 번역 파이프라인. 영한, 한영 순차통역 가이드 포함.

### projects/Notion_Organizer/
API를 통해 Notion 워크스페이스를 분석하고 정리하는 Python 도구.

### projects/Obsidian_PARA_Organizer/
PARA 방법론을 사용하여 Obsidian 볼트를 정리하는 Python 도구.

### projects/옵시디언_정리프로그램/
한국어 버전 Obsidian 볼트 정리 도구.

### projects/Project_vilan_note/
캐릭터/빌런 데이터베이스 마크다운 파일이 포함된 데이터 아카이브.

---

## 공유 유틸리티

### shared/
여러 프로젝트에서 사용되는 재사용 가능한 Python 유틸리티:
- `cache.py` - 성능을 위한 캐싱 유틸리티
- `orchestrator.py` - 작업 오케스트레이션
- `corrector.py` - 자동 수정 및 재시도 로직

---

## 루트 레벨 도구

### convert_md_to_html.py
한국어 업무 성과 보고서용 마크다운-HTML 변환기.

### scripts/gemini_reviewer.py
Gemini AI를 사용하는 코드 리뷰 도구.

---

## 보관/레거시 프로젝트

> 이 프로젝트들은 참조용으로 문서화되어 있으나, 원래 위치에 더 이상 존재하지 않을 수 있습니다.

### ~~루트 레벨 - Obsidian Vault Organizer~~ (보관됨)
이전에 루트에 `main.py`와 `enhancer.py`로 존재. Obsidian 마크다운 볼트 정리용 Python 도구.

### ~~fis-korea-dashboard/~~ (이동됨)
원래 루트 레벨에 있었음. 현재 `projects/Fail_fis-korea-dashboard/`에 위치.

---

## 주요 명령어

### FIS Korea Dashboard
```bash
cd projects/Fail_fis-korea-dashboard
npm install                  # 의존성 설치
npm run dev                  # 개발 서버 시작 (localhost:5173)
npm run build                # 프로덕션 빌드 (tsc + vite)
npm run lint                 # ESLint 실행
npm run preview              # 빌드 결과물 미리보기
npm run update-excel-data    # 40명 전체 선수 스크래핑
npm run excel-scrape <id>    # FIS ID로 개별 선수 스크래핑
npm run dev:full             # Vite + Node 서버 동시 실행
```

### FIS Regs MVP
```bash
cd projects/fis-regs-mvp
pip install -r requirements.txt
streamlit run app.py         # Streamlit 앱 시작
```
필수 `.env` 환경변수: `GEMINI_API_KEY`, `GEMINI_MODEL`, `PERPLEXITY_API_KEY`

### Antigravity Engine
```bash
cd projects/antigravity_engine_20260120
./run.command                # 실행 파일 런처
# 또는
python src/antigravity_engine.py
```
설정: `config.json` (Google API 키, 대상 파일, 디자인 스타일)

### Team Korea 대시보드
```bash
cd projects/team-korea-V3-Build
# 또는
cd projects/team-korea-winter-2025-26_20260123
npm install
npm run dev                  # 개발 서버 시작
npm run build                # 프로덕션 빌드
npm run preview              # 빌드 결과물 미리보기
```

### 웹 디자인 템플릿
```bash
cd projects/Web-design-2026/<템플릿명>
npm install
npm run dev                  # 개발 서버 시작
npm run build                # 프로덕션 빌드
npm run lint                 # ESLint 실행
npm run preview              # 빌드 결과물 미리보기
```

### 인스타그램 캐로셀 생성기
```bash
cd projects/인스타_캐로셀
python insta_pipeline.py
```
설정: `config.py`

### 번역 파이프라인
```bash
cd "projects/통번역 프로젝트 🩷"
python translate_mission.py
```

### Notion Organizer
```bash
cd projects/Notion_Organizer
pip3 install notion-client
python3 notion_organizer.py
```
설정: `config.txt` (`NOTION_TOKEN`, `OUTPUT_PAGE_ID` 필요)

---

## 아키텍처 노트

### FIS 대시보드 데이터 흐름
1. 스크래퍼 스크립트(`scripts/fis-to-excel.ts`)가 FIS 웹사이트에서 선수 데이터 수집
2. 다양한 스크래핑 방식: Playwright, Cheerio, Manual, Auto
3. 데이터는 Excel 파일로 `public/data/athletes/`에 저장 (선수당 1개 파일)
4. React 앱이 `src/hooks/`의 훅을 통해 Excel 파일 로드
5. 컴포넌트가 Highcharts로 데이터 표시 (`src/components/charts/`)
6. 공유 유틸리티(orchestrator, cache, corrector)로 성능 최적화

### Antigravity Engine 아키텍처
- 진입점: `src/antigravity_engine.py`
- Gemini AI를 사용하여 이미지/CSV를 HTML 대시보드로 변환
- 설정 기반: `config.json`에서 API 키, 입력 파일, 디자인 스타일 지정
- 스타일이 적용된 HTML 대시보드 파일 출력

### Team Korea 대시보드 패턴
- 여러 반복 버전 존재 (V3, V5, V6) - 디자인 진화 과정 표시
- 각 버전은 독립적인 Vite + React + TypeScript 프로젝트
- Tailwind CSS, Framer Motion, Recharts 사용
- 데이터 분석 스크립트 포함 (`audit_fis_data.py`, `enhance_data.py`)

### 웹 디자인 템플릿
- 7가지 독특한 디자인 스타일의 독립 프로젝트
- 각각 Vite + React + TypeScript 사용
- 다양한 현대 웹 디자인 패턴 시연

---

## 한국어 컨텍스트

문서와 UI 문자열은 주로 한국어로 작성되어 있습니다. 이 도구들은 개인 지식 베이스를 관리하고 한국 동계 스포츠 선수들을 추적하는 한국 사용자를 위해 설계되었습니다.

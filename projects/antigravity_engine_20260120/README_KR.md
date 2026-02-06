# Antigravity Engine

**생성일:** 2026-01-20  
**버전:** 1.0.0

이미지나 CSV 파일을 Google Gemini AI를 사용하여 아름답고 인터랙티브한 HTML 대시보드로 자동 변환하는 지능형 데이터 시각화 엔진입니다.

## ✨ 주요 기능

- 🖼️ **이미지-to-대시보드**: 이미지(스크린샷, 사진)에서 표를 추출하여 시각화
- 📊 **CSV-to-대시보드**: CSV 데이터를 인터랙티브 차트로 변환
- 🤖 **AI 기반**: Gemini AI가 데이터를 분석하고 최적의 시각화 방법을 추천
- 🎨 **커스터마이징 가능한 디자인**: 자연어 스타일 설명 (예: "사이버펑크 네온", "미니멀 기업용")
- 📦 **단일 파일 출력**: 독립적인 HTML 대시보드 (외부 의존성 없음)
- ⚡ **제로 설정**: API 키만 추가하면 바로 실행

## 🚀 빠른 시작

### 1. API 키 받기

무료 Google Gemini API 키를 받으세요: https://makersuite.google.com/app/apikey

### 2. 설정하기

`config.json`을 편집하고 API 키를 추가하세요:

```json
{
  "google_api_key": "실제_API_키를_입력하세요"
}
```

### 3. 실행하기

`run.command`를 더블클릭하거나 터미널에서 실행:

```bash
./run.command
```

**실행 과정:**
1. 📂 파일 선택 다이얼로그가 열립니다
2. 🖼️ 변환할 이미지 또는 CSV 파일을 선택
3. 🎨 디자인 스타일 선택 (1-5):
   - 1: Cyberpunk Neon (사이버펑크 네온)
   - 2: Corporate Professional (기업용 전문가)
   - 3: Minimalist Modern (미니멀 모던)
   - 4: Nature Organic (자연 유기적)
   - 5: Custom (직접 입력)
4. ✨ 대시보드 생성 완료!

## 📁 프로젝트 구조

```
antigravity_engine_20260120/
├── src/
│   └── antigravity_engine.py    # 메인 엔진
├── data/
│   ├── raw/                      # 입력 파일 (이미지, CSV)
│   ├── processed/                # 중간 CSV 파일
│   └── cache/                    # 캐시된 결과
├── logs/                         # 애플리케이션 로그
├── archive/                      # 버전별 백업
├── config.json                   # 설정 파일
├── requirements.txt              # Python 의존성
├── run.command                   # 실행 런처
└── README.md                     # 이 파일
```

## 🎯 사용 예제

### 예제 1: CSV 파일 처리

```json
{
  "google_api_key": "your-key-here",
  "target_file": "data/raw/sales_data.csv",
  "design_style": "Corporate Professional Style. Clean white background, Blue accent colors, Sans-serif fonts."
}
```

**출력:** `sales_data_dashboard.html`

### 예제 2: 이미지 처리

```json
{
  "google_api_key": "your-key-here",
  "target_file": "data/raw/table_screenshot.png",
  "design_style": "Cyberpunk Neon Style. Dark background, Pink & Cyan colors, Glitch effects."
}
```

**출력:** 
- `table_screenshot_data.csv` (추출된 데이터)
- `table_screenshot_dashboard.html` (최종 대시보드)

### 예제 3: 커스텀 스타일

```json
{
  "google_api_key": "your-key-here",
  "target_file": "data/raw/metrics.csv",
  "design_style": "Nature-Inspired Style. Earth tones, Organic shapes, Green (#2d6a4f) and Brown (#8b4513) palette, Soft shadows."
}
```

## 🎨 디자인 스타일 예제

### 스타일 프리셋

`run.command` 실행 시 다음 스타일 중 선택할 수 있습니다:

1. **Cyberpunk Neon** - 사이버펑크 네온 (어두운 배경, 핑크/시안)
2. **Corporate Professional** - 기업용 전문가 (흰색 배경, 네이비 블루)
3. **Minimalist Modern** - 미니멀 모던 (깔끔한 흰색, 회색 강조)
4. **Nature Organic** - 자연 유기적 (어스톤, 녹색/갈색)
5. **Custom** - 직접 입력

### 커스텀 스타일 예제

`design_style` 매개변수는 자연어 설명을 받습니다:

- **사이버펑크 네온**: 어두운 배경, 핑크 & 시안 색상, 글리치 효과, 미래지향적 그리드
- **미니멀 기업용**: 깔끔한 흰색, 파란색 강조, 산세리프 폰트, 은은한 그림자
- **레트로 80년대**: 그라데이션 배경, 보라 & 오렌지, 기하학적 패턴, 굵은 타이포그래피
- **자연 유기적**: 어스톤, 녹색 & 갈색, 부드러운 곡선, 자연스러운 질감
- **고대비**: 흑백, 굵은 타이포그래피, 날카로운 모서리, 최대 가독성

## 🔧 설정 옵션

### `google_api_key` (필수)
Google Gemini API 키입니다. 다음에서 받으세요: https://makersuite.google.com/app/apikey

### `target_file` (필수)
입력 파일 경로. 지원 형식:
- **이미지**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **CSV**: `.csv`

절대 경로 또는 프로젝트 루트 기준 상대 경로를 사용할 수 있습니다.

### `design_style` (필수)
원하는 대시보드 미적 요소에 대한 자연어 설명. 다음 사항을 구체적으로 명시하세요:
- 색상 팔레트 (hex 코드 또는 색상 이름)
- 타이포그래피 선호도
- 시각 효과 (그림자, 그라데이션, 애니메이션)
- 전체적인 분위기/테마

## 🔍 작동 원리

### 단계 1: 섭취 (Ingest)
- 확장자로 파일 형식 **자동 감지**
- **이미지**: Gemini Vision AI를 사용하여 표 데이터 추출 → JSON → CSV
- **CSV**: 직접 사용

### 단계 2: 기획 (Plan)
- CSV 컬럼 구조 **분석**
- **AI가 추천**하는 최적의 차트 유형 (막대, 선, 파이, 산점도)
- 차트 사양 **생성**

### 단계 3: 구축 (Build)
- 단일 파일 HTML 대시보드 **생성**
- CSV 데이터를 HTML에 직접 **임베드**
- `design_style`의 커스텀 스타일 **적용**
- 인터랙티브 시각화를 위한 Chart.js **포함**

## 📊 출력물

엔진이 생성하는 파일:

1. **중간 CSV** (이미지 입력의 경우): `{파일명}_data.csv`
2. **최종 대시보드**: `{파일명}_dashboard.html`
   - 독립적 (외부 파일 불필요)
   - Chart.js를 사용한 인터랙티브 차트
   - 반응형 디자인
   - 커스텀 스타일 적용

## 🐛 문제 해결

### "API key not configured"
- `config.json`에서 `YOUR_API_KEY_HERE`를 실제 API 키로 교체했는지 확인하세요

### "File not found"
- `target_file` 경로가 올바른지 확인하세요
- 프로젝트 루트 기준 상대 경로 또는 절대 경로를 사용하세요

### "Unsupported file type"
- `.jpg`, `.jpeg`, `.png`, `.webp`, `.csv`만 지원됩니다
- 파일 확장자가 소문자인지 확인하세요

### "Failed to parse AI response"
- AI 응답이 잘못된 형식일 수 있습니다
- 다시 실행해보세요 (AI 응답은 달라질 수 있습니다)
- 자세한 내용은 `logs/` 디렉토리의 로그를 확인하세요

### 이미지 추출이 작동하지 않음
- 이미지에 명확하고 읽기 쉬운 표가 포함되어 있는지 확인하세요
- 더 높은 해상도의 이미지로 시도해보세요
- 표에 명확한 테두리/구조가 있는지 확인하세요

## 📝 로그

모든 작업은 `logs/engine_{YYYYMMDD}.log`에 기록됩니다

로그 레벨:
- **INFO**: 정상 작업
- **WARNING**: 중요하지 않은 문제
- **ERROR**: 실패한 작업

## 🔄 고급 사용법

### 배치 처리

여러 설정 파일을 만들어 순차적으로 실행:

```bash
# config_sales.json
python src/antigravity_engine.py config_sales.json

# config_metrics.json
python src/antigravity_engine.py config_metrics.json
```

### 커스텀 처리

자체 스크립트에서 엔진 가져오기:

```python
from src.antigravity_engine import AntigravityEngine

engine = AntigravityEngine("my_config.json")
engine.run()
```

## 🛡️ 모범 사례

1. **API 키 보안**: API 키를 버전 관리에 커밋하지 마세요
2. **이미지 품질**: 더 나은 추출을 위해 고해상도 이미지를 사용하세요
3. **CSV 형식**: CSV에 명확한 컬럼 헤더가 있는지 확인하세요
4. **스타일 설명**: 색상, 폰트, 효과에 대해 구체적으로 명시하세요
5. **테스트**: 먼저 작은 데이터셋으로 테스트하세요

## 📚 의존성

- **google-generativeai**: Gemini AI SDK
- **pandas**: 데이터 조작
- **Pillow**: 이미지 처리

모든 의존성은 `run.command`에 의해 자동으로 설치됩니다.

## 🤝 2026_Antigravity 워크스페이스와의 통합

이 프로젝트는 ANTIGRAVITY_RULEBOOK 표준을 따릅니다:

- ✅ 표준 디렉토리 구조
- ✅ 포괄적인 로깅
- ✅ 오류 처리 및 검증
- ✅ 독립적 실행
- ✅ 설정 기반 디자인

## 📄 라이선스

2026_Antigravity 워크스페이스의 일부입니다.

## 🆘 지원

문제나 질문이 있는 경우:
1. `logs/` 디렉토리의 로그를 확인하세요
2. 이 README를 검토하세요
3. API 키가 유효한지 확인하세요
4. 입력 파일이 지원되는 형식인지 확인하세요

---

**즐거운 시각화 되세요! ✨**

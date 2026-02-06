# Team Korea Winter Dashboard 2025-26 (V4 Final Release)

이 폴더는 프로젝트의 모든 필수 구성 요소를 하나로 통합한 최종 버전입니다.

## 📁 폴더 구조
- **`src/`**: React 애플리케이션 소스 코드 및 컴포넌트
- **`public/`**: 정적 자산 및 최종 `athletes.json` 데이터
- **`source_data/`**: 원본 선수 데이터 (`athletes_base.json`) - **여기가 진짜 소스입니다.**
- **`pipeline/`**: 데이터 고도화 및 생성 스크립트 (`enhance_data.py`)

## 🚀 실행 방법
### 1. 웹 대시보드 실행
```bash
npm install
npm run dev
```

### 2. 데이터 업데이트
원본 데이터(`source_data/athletes_base.json`)를 수정한 후, 다음 명령어를 실행하면 웹에 반영될 데이터가 자동으로 생성됩니다.
```bash
python3 pipeline/enhance_data.py
```

## ✨ V4 개선 사항
- **구조 최적화**: 흩어져 있던 버전들을 하나로 통합 (V1, V2, Step1 등 제거 가능)
- **데이터 무결성**: 4자리 생년 및 정확한 종목 분류 체계 완비
- **단일 소스화**: `public/data/athletes.json`을 모든 화면의 단일 소스로 사용

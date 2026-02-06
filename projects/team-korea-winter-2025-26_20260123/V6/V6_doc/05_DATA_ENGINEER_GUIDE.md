# 데이터 엔지니어 작업 가이드

**역할:** 데이터 유지보수 및 업데이트
**작업 영역:** `V6/DATA_V6/`  
**최종 산출물:** `src/data/athletes.json`

---

> [!IMPORTANT]
> **Manual Update Mode**
> 자동화 스크립트는 현재 사용하지 않습니다. 데이터는 `V6/DATA_V6/athletes_real_fixed.json`을 통해 관리됩니다.

---

## ✅ 당신의 임무

**핵심 목표:**
1. `V6/DATA_V6/athletes_real_fixed.json` (Source of Truth) 관리
2. 변경 사항을 `src/data/athletes.json`에 반영

---

## 📂 작업 관리

**Source of Truth:**
```
V6/DATA_V6/athletes_real_fixed.json
```
- 모든 데이터의 원본입니다.
- 선수 정보, 경기 결과, 메타데이터가 포함되어 있습니다.

**Target File:**
```
src/data/athletes.json
```
- 프론트엔드 앱이 실제로 로드하는 파일입니다.
- 원본 파일의 `athletes` 배열만 추출하여 저장합니다.

---

## 🔧 작업 순서 (Manual Workflow)

### Step 1: 데이터 수정
1. `V6/DATA_V6/athletes_real_fixed.json` 파일을 엽니다.
2. 경기 결과 추가, 랭킹 변경 등을 수행합니다.
   ```json
   // 예시: 새 결과 추가
   {
     "date": "2026-02-15",
     "place": "Milano",
     "category": "OWG",
     "discipline": "Freeski Halfpipe",
     "rank": 1,
     "result_code": null,
     "fis_points": 100.0
   }
   ```

### Step 2: 배포 (Sync)
1. 수정된 원본 파일에서 `athletes` 배열 전체를 복사합니다.
2. `src/data/athletes.json` 파일을 열고 전체 내용을 덮어씁니다.
3. 앱을 실행(`npm run dev`)하여 데이터가 정상적인지 확인합니다.

---

## 📊 데이터 규칙

### Rule 1: Source of Truth 준수
- 항상 `DATA_V6/` 폴더의 파일을 먼저 수정해야 합니다.
- `src/data/` 파일을 직접 수정하면 원본과 싱크가 깨질 수 있습니다.

### Rule 2: 데이터 구조 유지
- 기존 JSON 구조(필드명, 타입)를 정확히 유지하세요.
- `id`, `fis_code` 등 식별자는 변경하지 마십시오.

---

## 📚 참고 문서

- [데이터 파이프라인 가이드](../07_DATA_PIPELINE_GUIDE.md) - 상세 데이터 워크플로우
- [데이터 스키마](../02_DATA_SCHEMA.md) - JSON 필드 설명
- [프로젝트 개요](../00_PROJECT_OVERVIEW.md) - 전체 프로젝트 이해

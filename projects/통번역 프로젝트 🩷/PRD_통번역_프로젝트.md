# 통번역 프로젝트 PRD (Dialogflow CX + Vertex AI 분리 엔진)

## 1. 요약
- 본 PRD는 `/Users/jenkim/Downloads/2026_Antigravity/projects/통번역 프로젝트 🩷/영한BA_통번역.md`, `/Users/jenkim/Downloads/2026_Antigravity/projects/통번역 프로젝트 🩷/한영AB_통번역.md`, `/Users/jenkim/Downloads/2026_Antigravity/projects/통번역 프로젝트 🩷/번역 지시서.md`의 **출력 형식 및 품질 요구사항**을 기준으로 작성한다.
- 시스템은 **두 엔진(각각 분리 스크립트)**를 유지하고, 입력 폴더 `translate_input`, 출력 폴더 `translate_output` 중심으로 운영한다.
- 언어 방향은 **자동 감지 + 필요 시 override 가능**을 기본으로 한다.

## 2. 문제 정의 및 목표
### 2.1 문제 정의
- 번역 프로젝트가 수동 경로 설정과 파일 관리에 의존함.
- 출력 형식의 일관성이 보장되지 않아 검수 비용이 증가함.
- 언어 방향에 대한 명시가 부족해 오류 가능성이 존재함.

### 2.2 목표
- 폴더 기반 자동 처리로 운영 효율 향상.
- 출력 형식을 Strict Format으로 고정하여 일관성 확보.
- 언어 방향 자동 감지 및 필요 시 강제 설정 가능.
- Dialogflow CX / Vertex AI 엔진 분리 운영.

## 3. 범위
### 3.1 In Scope
- `translate_input` → `translate_output` 기반 처리.
- Strict Format 출력 + Glossary Table 생성.
- 두 엔진 분리 실행 및 공통 입출력 규약.

### 3.2 Out of Scope
- UI/웹 대시보드.
- 용어집 DB/관리 도구.
- 자동 품질 평가 및 스케줄링(추후 확장).

## 4. 사용자 및 시나리오
### 4.1 사용자
- PM/관리자: 대량 문서 처리 및 결과 형식 검증.
- 번역가/검수자: 원문/번역/용어 설명을 한 파일에서 확인.

### 4.2 핵심 시나리오
1. 사용자가 `translate_input` 폴더에 문서를 넣는다.
2. 엔진 스크립트를 실행한다.
3. 결과가 `translate_output`에 Strict Format으로 저장된다.
4. 검수자가 결과를 바로 확인한다.

## 5. 핵심 요구사항
### 5.1 입출력 규격
- 입력 폴더: `translate_input`
- 출력 폴더: `translate_output`
- 파일 형식: `.md` (추후 `.txt` 확장 가능)

### 5.2 처리 규칙
- 청크 단위: 2–3문장.
- 언어 방향: 자동 감지 후 반대 언어로 번역.
- 예외: config/CLI override 가능.

### 5.3 출력 형식 (Strict Format)
- 각 청크는 반드시 아래 순서를 따른다.
  1. `[Source Text]` (원문)
  2. `[Target Text]` (번역문)
  3. `[Glossary Table]` (표현/의미/사용 뉘앙스 포함 Markdown table)

### 5.4 스타일 및 제약
- 문체: 아나운서/연설문 톤.
- 번역투/콩글리시 회피, 자연스러운 구어체.
- 원문 누락 금지, Glossary 누락 금지, 반말 금지.

## 6. 엔진 구조
### 6.1 Dialogflow CX 스크립트
- 파일 기반 처리.
- 세션 생성 및 병렬 청크 처리.
- 응답 메시지에서 텍스트 결합 후 저장.

### 6.2 Vertex AI 스크립트
- `GenerativeModel` 기반 호출.
- 동일한 입출력 규약 사용.

### 6.3 공통 인터페이스
- 동일한 폴더 구조 사용 (`translate_input`, `translate_output`).
- 동일한 프롬프트 구조 사용.

## 7. 언어 방향 제어
- 기본: 입력 텍스트 언어 자동 감지 후 반대 언어로 번역.
- Override: config/CLI에서 `source_lang`, `target_lang` 강제 지정 가능.
- 프롬프트 파일: 단일 `.md`에 `{source_lang}`, `{target_lang}`, `{source_text}` 변수 사용.

## 8. 출력 예시 (Strict Format 요약)
- Source Text → Target Text → Glossary Table 순서 유지.
- Glossary Table에는 표현/의미/활용 뉘앙스가 반드시 포함.

## 9. 품질 기준
- 의미 보존: 원문 의미 누락/왜곡 금지.
- 문체 준수: 아나운서/연설문 톤 유지.
- 용어 설명: 문단별 핵심 어휘와 활용 예시 포함.

## 10. 에러 및 엣지케이스
- 빈 파일: 건너뛰고 로그 기록.
- 문장 수 부족: 가능한 범위 내 청크 처리.
- 혼합 언어: 감지 실패 시 override 사용.
- 길이 과다: 청크 분할 처리.
- API 실패: 재시도 및 실패 로그 기록.

## 11. 운영 및 로깅
- 실행 로그: 처리 파일명, 청크 수, 실패 청크.
- 결과 파일명 규칙: `Translated_{원본파일명}`.

## 12. 성공 지표
- Strict Format 준수율 100%.
- 평균 처리 시간/문서 개선.
- 검수 수정률 감소.

## 13. 명세 충돌 정합성
- `번역 지시서.md`와 Strict Format 문서 간의 차이를 정리하고,
  PRD에는 **충돌 없는 통합 규칙**만 반영한다.

## 14. 테스트 케이스/시나리오
1. 단일 짧은 문단(2–3문장).
2. 긴 문서(다수 청크).
3. 혼합 언어 문서.
4. Glossary Table 누락 검사.

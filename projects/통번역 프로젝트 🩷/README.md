# 🩷 통번역 프로젝트 V2 (Translation Engine)

이 프로젝트는 **전문 통역사 수준(아나운서/연설문 톤)**의 고품질 번역을 수행하는 자동화 도구입니다.
두 가지 서로 다른 AI 엔진(Dialogflow CX vs Vertex AI)을 사용하여 동일한 "Strict Format" 결과를 산출합니다.

## 📂 폴더 구조 (Directory Structure)

*   `translate_input/`: 번역할 원본 파일(`.md`, `.txt`)을 여기에 넣으세요.
*   `translate_output/`: 번역 완료된 파일(`Translated_...`)이 여기에 저장됩니다.
*   `translate_Dialogflow CX .py`: **Dialogflow 엔진** 실행 스크립트.
*   `translate_vertexai.py`: **Vertex AI (Gemini)** 엔진 실행 스크립트.
*   `PRD_통번역_프로젝트.md`: 기획서 및 요구사항 명세.

---

## 🏎️ 엔진 비교 (Engine Comparison)

두 스크립트 모두 **동일한 프롬프트(아나운서 톤, Strict Format)**를 사용하지만, 구동 방식이 다릅니다.

| 특징 | **Dialogflow CX (`translate_Dialogflow CX .py`)** | **Vertex AI (`translate_vertexai.py`)** |
| :--- | :--- | :--- |
| **핵심 기술** | **Conversational AI (Session 기반)** | **Generative AI (Direct Model Access)** |
| **작동 원리** | 가상의 '상담 세션'을 열고, 텍스트를 대화 메시지로 보낸 뒤 응답을 받음. | Google의 최신 **Gemini 1.5 Pro** 모델에게 직접 텍스트 생성을 요청함. |
| **장점** | 사전 정의된 Agent Flow(대화 흐름)나 안전 장치를 클라우드 콘솔에서 관리 가능. 세션 유지 가능. | **속도가 빠르고**, 코드가 훨씬 간결함. 모델 파라미터(창의성 등)를 코드에서 직접 제어하기 쉬움. |
| **특이 사항** | 병렬 처리(Parallel Execution) 로직이 내장되어 있어 대량 처리 시 유리하도록 코딩됨. | 가장 순수한 형태의 LLM 호출 방식. |

> **추천**: 일반적인 고품질 번역 작업에는 **Vertex AI**가 더 직관적이고 빠를 수 있습니다. Dialogflow는 기업용 챗봇 구조를 테스트할 때 적합합니다.

---

## 🚀 사용 방법 (How to Run)

1.  **파일 준비**: `translate_input` 폴더에 번역하고 싶은 `.md` 파일들을 넣습니다.
2.  **실행**: 터미널에서 아래 명령 중 하나를 실행합니다.

    *   **Vertex AI (Gemini) 엔진 사용 시:**
        ```bash
        python3 translate_vertexai.py
        ```

    *   **Dialogflow CX 엔진 사용 시:**
        ```bash
        python3 "translate_Dialogflow CX .py"
        ```

3.  **결과 확인**: `translate_output` 폴더에 `Translated_파일명.md`가 생성되었는지 확인합니다.

---

## 📝 출력 포맷 (Strict Format)

모든 번역 결과는 아래 형식을 엄격하게 따릅니다.

1.  **[Source Text]**: 원문
2.  **[Target Text]**: 아나운서/연설문 톤으로 리라이팅된 번역문
3.  **[Glossary Table]**: 주요 용어의 의미와 선택 이유(뉘앙스)가 담긴 표

```markdown
### [Glossary Table]
| Term | Meaning | Nuance/Usage |
| :--- | :--- | :--- |
| Capitalism | 자본주의 | 경제 체제를 지칭하는 공식 용어 사용 |
```

# 프로젝트 실행 보고서: 인스타그램 캐로셀 생성

본 보고서는 `insta_pipeline.py` 스크립트의 전체 실행 과정을 상세히 기술합니다. 수많은 문제 해결 과정과 최종 해결책을 포함하며, 결과적으로 7개의 인스타그램 캐로셀 이미지를 성공적으로 생성했습니다.

## 1. 프로젝트 목표

주요 목표는 `insta_pipeline.py` 파이썬 스크립트를 실행하여 7장의 인스타그램 캐로셀 이미지를 자동으로 생성하는 것이었습니다. 이 과정은 두 가지 주요 AI 기반 단계로 이루어집니다:
1.  **콘텐츠 생성:** 강력한 언어 모델을 사용하여 사전 정의된 주제("FIS 월드컵 초보 가이드")에 대한 프로젝트 개요(PRD)와 7개 슬라이드의 텍스트 콘텐츠를 생성합니다.
2.  **이미지 생성:** 텍스트-이미지 변환 모델을 사용하여 각 텍스트 콘텐츠에 맞는 시각적 슬라이드를 생성하며, 특정 색상 팔레트와 스타일을 준수합니다.

## 2. 실행 및 문제 해결 과정 기록

이번 실행은 해결책을 찾기까지 여러 번의 실패를 겪은 복잡한 과정이었습니다. 가장 큰 어려움은 이미지 생성을 위해 Google의 AI 모델 API와 올바르게 상호작용하는 것이었습니다.

### 초기 시도 및 실패 (`google.generativeai` 라이브러리)

-   **`TypeError`:** 초기 스크립트는 `GenerationConfig`에서 잘못된 키워드 인자(`response_modalities`)를 사용하여 실패했습니다. 이는 이미지 생성 라이브러리의 API가 의도한 대로 사용되지 않았음을 보여주는 초기 신호였습니다.
-   **`NameError` & `IndentationError`:** 사용자의 수정과 저의 수정 과정에서 기본적인 파이썬 문법 오류가 발생했으며, 이는 신속하게 파악하고 수정했습니다.
-   **`404 Model Not Found`:** `google.generativeai` 라이브러리를 통해 다양한 모델 이름(`gemini-2.5-flash-exp-image-generation`, `imagen-3.0-generate-002`, `imagen-4.0` 변형 모델 등)으로 여러 차례 시도했지만 모두 실패했습니다. 이는 제가 호출한 방식으로는 `GenerativeModel` 클래스를 통해 해당 모델에 접근할 수 없음을 나타냅니다.
-   **`ImportError`:** 사용자가 제공한 `ImageGenerationModel` 코드 조각을 사용하려 했으나, 이 클래스를 `google.generativeai` 라이브러리에서 가져올 수 없어 `ImportError`가 발생했습니다. 이는 해당 클래스가 다른 (또는 최신) 라이브러리에 속해 있을 수 있음을 시사했습니다.

이 라이브러리에서 발생한 마지막이자 지속적인 오류는 API가 이미지 데이터 대신 원하는 이미지에 대한 *텍스트 설명*만을 반환한다는 것이었습니다. 이는 현재 구성에서 `google.generativeai` 라이브러리가 직접적인 텍스트-이미지 변환 생성에 적합하지 않다는 것을 확인시켜 주었습니다.

### 해결책: Vertex AI로 전환

사용자께서 `google.cloud.aiplatform` (Vertex AI) 라이브러리를 사용하도록 지시하면서 큰 돌파구가 마련되었습니다. 이를 위해 스크립트를 완전히 재구성해야 했습니다.

**주요 변경 사항:**
1.  **라이브러리:** `google.generativeai`에서 `vertexai`로 전환했습니다.
2.  **초기화:** 올바른 프로젝트 ID와 위치로 `vertexai.init()`을 구현했습니다.
3.  **모델 클래스:** 이 작업에 적합한 `vertexai.preview.vision_models.ImageGenerationModel` 클래스를 사용했습니다.
4.  **생성 메소드:** 일반적인 `.generate_content()` 대신 이미지 생성에 특화된 `.generate_images()` 메소드를 사용했습니다.

### 최종 난관: `PermissionDenied` 오류 및 `SyntaxError` 해결

올바른 라이브러리 전환 후에도 몇 가지 문제가 발생했습니다.
-   **`PermissionDenied` 오류:** Vertex AI API가 사용자 Google Cloud 프로젝트에서 활성화되지 않았거나, 인증된 사용자(`jjjenkim@gmail.com`)가 필요한 IAM 권한을 가지고 있지 않다고 진단되었습니다. 저는 사용자에게 `gcloud projects add-iam-policy-binding stitch-mcp-project-1769082170 --member=user:jjjenkim@gmail.com --role=roles/aiplatform.user` 명령어를 제공했고, 사용자가 권한을 할당했다고 확인한 후 스크립트는 API에 성공적으로 연결할 수 있었습니다.
-   **`SyntaxError`:** 이미지 프롬프트 내에서 한국어 텍스트를 포함하는 방식에 `SyntaxError`가 발생했습니다. 이는 f-스트링 내에서 삼중 따옴표를 잘못 사용한 것이 원인이었으며, 중복된 따옴표를 제거하여 수정되었습니다.

## 3. 최종 성공 실행

Vertex AI 라이브러리를 올바르게 구현하고, 클라우드 권한 및 스크립트 구문 문제를 해결한 후, 스크립트는 성공적으로 실행되었습니다.

-   **텍스트 생성 모델:** `gemini-1.0-pro`
-   **이미지 생성 모델:** `imagen-3.0-generate-001`
-   **출력:** 7개의 PNG 이미지가 생성되어 `instagram_carousel` 디렉토리에 저장되었습니다.

최종적으로 수정된 `insta_pipeline.py` 스크립트는 이 성공적인 Vertex AI 구현을 반영하고 있습니다.

## 4. 생성된 이미지

다음 7개의 이미지가 성공적으로 생성되었으며, 이 보고서 폴더(`01_Execution_Report`)에 포함되어 있습니다.

1.  `slide-01.png`
2.  `slide-02.png`
3.  `slide-03.png`
4.  `slide-04.png`
5.  `slide-05.png`
6.  `slide-06.png`
7.  `slide-07.png`
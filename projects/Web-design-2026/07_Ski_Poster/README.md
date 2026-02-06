# 실행 가이드

## 🎯 목적
Agent Builder를 통해 **140만원 크레딧**을 사용하여 포스터 HTML 생성

---

## 📁 생성된 파일

1. **`poster_brief.md`** - 상세 기획서
2. **`prompts_for_agent.md`** - 복사해서 붙여넣을 프롬프트
3. **`curl_commands.sh`** - 터미널 실행용 스크립트 (이 파일)

---

## 🚀 실행 방법

### 방법 1: Vertex AI Studio (GUI)

1. **Vertex AI Studio 접속**
   ```
   https://console.cloud.google.com/vertex-ai/studio
   ```

2. **Chat 또는 Freeform 선택**

3. **프롬프트 복사**
   - `prompts_for_agent.md` 파일 열기
   - "통합 프롬프트 (3개 한번에)" 섹션 복사
   - 또는 개별 프롬프트 1, 2, 3 중 선택

4. **붙여넣기 & 실행**
   - Studio에 붙여넣기
   - "Generate" 클릭
   - HTML 코드 생성 확인

5. **HTML 저장**
   - 생성된 코드를 `.html` 파일로 저장
   - 브라우저에서 열어 확인

---

### 방법 2: 터미널 (curl 명령어) ⭐ 추천

1. **터미널 열기**

2. **폴더 이동**
   ```bash
   cd "/Users/jenkim/Downloads/2026_Antigravity/projects/Web-design-2026/07_Ski_Poster"
   ```

3. **스크립트 실행**
   ```bash
   ./curl_commands.sh
   ```

4. **결과 확인**
   - `concept1_response.json` - 눈송이 파티
   - `concept2_response.json` - 레트로 스키 클럽
   - `concept3_response.json` - 사이버 슬로프

5. **JSON에서 HTML 추출**
   - 각 JSON 파일 열기
   - HTML 코드 부분 복사
   - `.html` 파일로 저장

---

## ⚠️ 중요 사항

### 크레딧 사용 확인
실행 후 반드시 확인:

1. **GCP Console 접속**
   ```
   https://console.cloud.google.com/billing/01B263-93C11F-BBA8A6
   ```

2. **확인 항목**
   - Service: "Vertex AI Agent Builder" ✅
   - Credits applied: 금액 확인 ✅
   - Cash charges: ₩0 확인 ✅

3. **세무사 모니터링**
   - 자동으로 일일 리포트 생성됨
   - 크레딧 사용 내역 추적

---

## 🔧 문제 해결

### 1. 인증 오류
```bash
# gcloud 로그인
gcloud auth login

# 프로젝트 설정
gcloud config set project gen-lang-client-0478396215
```

### 2. API 비활성화 오류
```bash
# Discovery Engine API 활성화
gcloud services enable discoveryengine.googleapis.com
```

### 3. 권한 오류
- GCP Console에서 IAM 확인
- "Discovery Engine Editor" 권한 필요

---

## 📊 예상 크레딧 사용량

- 컨셉 1개당: 약 ₩500-1,000
- 총 3개: 약 ₩1,500-3,000
- 남은 크레딧: ₩1,434,325 → ₩1,431,325 (예상)

---

## 💡 다음 단계

1. ✅ 스크립트 실행
2. ✅ JSON 응답 확인
3. ✅ HTML 추출 및 저장
4. ✅ 브라우저에서 테스트
5. ✅ 크레딧 사용 확인
6. ✅ 세무사 리포트 확인

---

## 📞 도움말

문제 발생 시:
1. 에러 메시지 복사
2. 안실장(저)에게 전달
3. 즉시 해결 지원

**크레딧 사용 = ₩0 현금 청구!** 🎉

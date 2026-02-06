# API 키 문제 해결 가이드

## 🔍 문제 진단

API 키가 유효하지 않다는 오류가 발생하는 경우, 다음 사항을 확인하세요:

## ✅ 해결 방법

### 1. API 키 확인
- Google AI Studio에서 API 키를 다시 확인하세요
- URL: https://aistudio.google.com/app/apikey
- 키가 활성화되어 있는지 확인

### 2. Generative Language API 활성화
Google Cloud Console에서 API를 활성화해야 합니다:

1. https://console.cloud.google.com 접속
2. 프로젝트 선택
3. "API 및 서비스" > "라이브러리" 이동
4. "Generative Language API" 검색
5. **"사용 설정"** 클릭

### 3. 새 API 키 생성 (권장)
기존 키에 문제가 있을 수 있으므로 새 키를 생성하세요:

1. https://aistudio.google.com/app/apikey 접속
2. "Create API key" 클릭
3. 프로젝트 선택 또는 새 프로젝트 생성
4. 생성된 키를 복사
5. `config.json`에 새 키 입력

### 4. API 키 제한 확인
API 키에 제한이 설정되어 있을 수 있습니다:

1. Google Cloud Console > API 및 서비스 > 사용자 인증 정보
2. API 키 클릭
3. "API 제한사항" 확인
4. 필요시 제한 해제 또는 "Generative Language API" 추가

### 5. 할당량 확인
무료 할당량을 초과했을 수 있습니다:

1. Google Cloud Console > IAM 및 관리자 > 할당량
2. "Generative Language API" 검색
3. 사용량 확인

## 🔧 임시 해결책

다른 API 키를 사용해보세요:

```bash
# 새 프로젝트로 API 키 생성
1. https://aistudio.google.com/app/apikey
2. "Create API key in new project" 선택
3. 생성된 키 복사
```

## 📝 참고사항

- **무료 티어**: 분당 15 요청, 일일 1,500 요청
- **API 활성화**: 최대 5분 소요될 수 있음
- **키 형식**: `AIza` 로 시작하는 39자 문자열

## 🆘 여전히 안 되는 경우

1. 완전히 새로운 Google 계정으로 시도
2. VPN 사용 중이면 비활성화
3. 브라우저 시크릿 모드로 API 키 생성

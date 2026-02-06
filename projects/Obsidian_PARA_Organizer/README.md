# Obsidian_PARA_Organizer
v3.0 | 2026-01-20

**로컬 키워드 스캔 기반 자동 분류 (토큰 소비 0원)**

## 🎯 핵심 개선

- ✅ **심플 구조**: 7개 폴더만 (기존 24개 → 7개)
- ✅ **키워드 스캔**: AI/API 없음, 로컬 처리 (완전 무료)
- ✅ **원본 보존**: INPUT 그대로, OUTPUT에 복사 분류
- ✅ **MOC 자동 생성**: 연결성 기반 지식 지도
- ✅ **미분류 제로**: 폴백 로직으로 100% 분류
- ✅ **연도별 Archive**: 생성일 메타데이터 기준

---

## 📁 폴더 구조 (심플화)

```
OUTPUT/
├── Projects/           # 프로젝트 (진행중+계획+완료 모두)
├── Work/               # 업무 문서
├── Personal/           # 개인 메모/일기
├── Knowledge/          # 지식/학습/참고자료
├── Archive/            # 보관 (연도별: 2023/, 2024/, 2025/)
├── Dashboard.md        # 통계 대시보드
└── _MOC/               # 지식 지도 (연결성 시각화)
```

**깊이**: 최대 2단계 (Archive만 연도별 하위 폴더)  
**검색**: 빠름 (경로 짧음)  
**유지보수**: 쉬움 (폴더 적음)

---

## ⚙️ config.txt 설정

```txt
# ==========================================
# INPUT/OUTPUT 경로 (필수)
# ==========================================
INPUT_FOLDER=/Users/yourname/Documents/Obsidian/Vault/Inbox
OUTPUT_FOLDER=/Users/yourname/Documents/Obsidian/Vault/OUTPUT

# ==========================================
# 분류 키워드 (커스텀 가능)
# ==========================================
# Projects: 프로젝트 관련 모든 문서
KEYWORDS_PROJECTS=프로젝트,project,deadline,목표,goal,진행중,완료,기획,planning,plan,active,completed

# Work: 업무 문서
KEYWORDS_WORK=업무,work,회의,meeting,보고,report,업무일지,미팅,발표,presentation

# Personal: 개인 문서
KEYWORDS_PERSONAL=일기,diary,생각,메모,memo,노트,개인,personal,느낌,감상

# Knowledge: 지식/학습 자료
KEYWORDS_KNOWLEDGE=연구,research,논문,paper,책,book,학습,study,배움,정리,요약,분석,analysis,참고,reference

# ==========================================
# 분류 로직
# ==========================================
# 키워드 점수가 가장 높은 폴더로 배치
# 동점 시 우선순위: Projects > Work > Personal > Knowledge

# 키워드 점수 0일 때 폴백 순서:
# 1. 최근 7일 내 생성 → Knowledge/ (임시)
# 2. 내부 링크 5개 이상 → Knowledge/ (영구)
# 3. 기본 → Knowledge/

FALLBACK_DAYS=7              # 최근 파일 기준
FALLBACK_LINK_COUNT=5        # 링크 밀도 기준

# ==========================================
# Archive 로직
# ==========================================
# 파일 생성일(메타데이터) 기준으로 연도별 분류
# 예: 2024-05-10 생성 → Archive/2024/
# 2년 이상 오래된 파일만 Archive로 이동

ARCHIVE_BY_YEAR=true
ARCHIVE_THRESHOLD_YEARS=2    # 2년 이상 된 파일만

# ==========================================
# MOC 생성
# ==========================================
CREATE_MOC=true              # MOC 자동 생성
MOC_MIN_LINKS=3              # 최소 3개 링크 이상만 MOC 포함

# ==========================================
# 실행 옵션
# ==========================================
AUTO_MOVE=false              # 원본 이동 안함 (복사만)
CREATE_DASHBOARD=true        # 대시보드 생성
DRY_RUN=false               # true=테스트 모드 (실제 이동 안함)
VERBOSE=true                # 상세 로그 출력
```

---

## 🔍 분류 로직 상세

### 1️⃣ 키워드 스캔 (로컬 처리, 토큰 0원)
```python
def classify_file(filepath):
    content = read_file(filepath)

    # 키워드 카운팅
    scores = {
        "Projects": count_keywords(content, KEYWORDS_PROJECTS),
        "Work": count_keywords(content, KEYWORDS_WORK),
        "Personal": count_keywords(content, KEYWORDS_PERSONAL),
        "Knowledge": count_keywords(content, KEYWORDS_KNOWLEDGE)
    }

    # 최고 점수 선택
    max_score = max(scores.values())

    if max_score > 0:
        return max(scores, key=scores.get)
    else:
        # 폴백 로직
        return fallback_classify(filepath)
```

### 2️⃣ 키워드 겹침 처리
```python
# 예시: "프로젝트 업무 회의록"
scores = {
    "Projects": 3,  # "프로젝트" 1회 + "업무" 관련
    "Work": 5       # "업무" 2회 + "회의" 2회
}
# Work 점수 더 높음 → Work/ 배치
result = "Work"

# 동점일 경우
if scores["Projects"] == scores["Work"]:
    # 우선순위: Projects > Work > Personal > Knowledge
    result = "Projects"
```

### 3️⃣ 미분류 방지 (폴백 로직)
```python
def fallback_classify(filepath):
    days_old = get_days_since_created(filepath)
    link_count = count_internal_links(filepath)

    # 최근 7일 이내 파일 → Knowledge (임시)
    if days_old <= 7:
        return "Knowledge"

    # 링크 5개 이상 → Knowledge (영구)
    elif link_count >= 5:
        return "Knowledge"

    # 기본 → Knowledge
    else:
        return "Knowledge"
```

### 4️⃣ Archive 연도별 분류
```python
def check_archive(filepath):
    created_date = get_file_metadata(filepath)["created"]
    year = int(created_date.split("-")[0])
    current_year = 2026

    # 2년 이상 오래된 파일
    if current_year - year >= 2:
        return f"Archive/{year}/"
    else:
        return None  # Archive 안함
```

---

## 🗺️ MOC 자동 생성

### 연결성 분석
```python
# 모든 파일의 링크 분석
links = {}
for file in all_files:
    links[file] = extract_links(file)

# 링크 밀도 계산
density = {file: len(link_list) for file, link_list in links.items()}

# 상위 노트 추출
top_notes = sorted(density.items(), key=lambda x: x[1], reverse=True)[:10]
```

### MOC 파일 생성
```markdown
# _MOC/Knowledge_Map.md
Last Updated: 2026-01-20 03:25

## 🔗 가장 연결된 노트 (Top 10)

1. [[FIS-Dashboard]] - 15 links
   - Connected to: [[Olympic Athletes]], [[Data Pipeline]], [[Dashboard Design]]

2. [[Sports Journalism Guide]] - 12 links
   - Connected to: [[Writing Tips]], [[Interview Techniques]], [[Ethics]]

3. [[AI Tools Comparison]] - 9 links
   - Connected to: [[ChatGPT]], [[Claude]], [[Perplexity]]

## 📊 카테고리별 연결성

### Projects (3 hubs)
- [[FIS-Dashboard]] ↔ [[Data Pipeline]] ↔ [[API Integration]]

### Knowledge (5 hubs)
- [[Python Basics]] ↔ [[Advanced Python]] ↔ [[Data Science]]

## 🌐 네트워크 통계
- Total Notes: 247
- Total Links: 892
- Avg Links per Note: 3.6
- Isolated Notes: 12 (4.9%)
```

---

## 📊 Dashboard 자동 생성

```markdown
# Dashboard.md
Last Update: 2026-01-20 03:25

## 📈 통계

| 항목 | 개수 |
|------|------|
| 총 파일 | 247 |
| 분류 완료 | 247 (100%) |
| 미분류 | 0 |

## 📂 폴더별 분포

```chart
type: pie
data:
  Projects: 18
  Work: 67
  Personal: 42
  Knowledge: 89
  Archive: 31
```

## 🔥 최근 활동 (7일)
- 생성: 8 files
- 수정: 23 files
- Archive 이동: 3 files

## 🔗 연결성 높은 노트
1. [[FIS-Dashboard]] (15 links)
2. [[Sports Journalism Guide]] (12 links)
3. [[AI Tools Comparison]] (9 links)

## 📅 Archive 현황
- 2023년: 15 files
- 2024년: 89 files
- 2025년: 67 files
```

---

## 🚀 Quick Start

### 1. config.txt 작성
```bash
nano config.txt
# INPUT_FOLDER, OUTPUT_FOLDER 경로 입력
```

### 2. 실행
**Mac:**
```bash
chmod +x run.command
./run.command
```

**Windows/Linux:**
```bash
python3 obsidian_organizer.py
```

### 3. 결과 확인
- `OUTPUT/` 폴더 생성 확인
- `Dashboard.md` 열어서 통계 확인
- `_MOC/` 폴더에서 연결성 탐색

---

## ✅ 핵심 특징

| 항목 | 설명 |
|------|------|
| **폴더 개수** | 7개 (기존 24개 → 70% 감소) |
| **깊이** | 최대 2단계 (검색 빠름) |
| **토큰 소비** | 0원 (로컬 키워드 스캔) |
| **원본 보존** | INPUT 그대로 유지 |
| **분류율** | 100% (폴백 로직) |
| **속도** | 1000개 파일 < 10초 |
| **MOC** | 자동 생성 (연결성 분석) |
| **Archive** | 연도별 (메타데이터 기준) |

---

## 🔧 Requirements

- Python 3.7+
- Obsidian Vault

---

## 📝 파일 구성

```
obsidian-organizer/
├── obsidian_organizer.py   # 메인 스크립트
├── config.txt               # 설정 파일
├── run.command              # Mac 실행 스크립트
├── README.md                # 이 파일
└── requirements.txt         # (없음, 표준 라이브러리만 사용)
```

---

## 🎯 사용 예시

### 입력 파일
```
INPUT/Inbox/
├── FIS-Dashboard 프로젝트.md
├── 2026-01-15 업무일지.md
├── Python 배우기.md
└── 일기_2024-05-10.md
```

### 출력 결과
```
OUTPUT/
├── Projects/
│   └── FIS-Dashboard 프로젝트.md
├── Work/
│   └── 2026-01-15 업무일지.md
├── Knowledge/
│   └── Python 배우기.md
├── Archive/
│   └── 2024/
│       └── 일기_2024-05-10.md
├── Dashboard.md
└── _MOC/
    └── Knowledge_Map.md
```

---

**Created**: 2026-01-20  
**Version**: 3.0  
**License**: MIT

# 20_DATA_TEAM.md
**Team Korea Winter Dashboard 2025-26 (V3)**
**Data Intelligence & Pipeline Architecture**

---

## 1. Mission
**"Trust but Verify"**
The V3 Data Team is responsible for constructing a **relational, validated source of truth**. We move away from flat ad-hoc scraping to a structured schema that ensures long-term stability and deep analytical capabilities.

---

## 2. Schema Architecture (Relational)
Instead of one giant file, we maintain normalized datasets to prevent duplication and errors.

### A. `athletes.json` (Profiles)
The central registry of all 43 athletes.
```json
[
  {
    "id": "KOR_AL_001",
    "name_ko": "김철수",
    "name_en": "KIM Cheolsu",
    "fis_code": "123456",
    "discipline": "ALPINE_SKIING",
    "team": "KOR_A",
    "birth_date": "2000-01-01",
    "status": "ACTIVE"
  }
]
```

### B. `events.json` (Calendar)
The competition schedule and metadata.
```json
[
  {
    "event_id": "FIS_WC_2026_01",
    "name": "FIS World Cup Adelboden",
    "date": "2026-01-15",
    "location": "Adelboden, SUI",
    "discipline": "ALPINE_SKIING",
    "type": "WORLD_CUP"
  }
]
```

### C. `results.json` (Performance)
The relational link between Athletes and Events.
```json
[
  {
    "result_id": "RES_00123",
    "event_id": "FIS_WC_2026_01",
    "athlete_id": "KOR_AL_001",
    "rank": 15,
    "fis_points": 24.50,
    "record": "1:52.33"
  }
]
```

---

## 3. The Modernized Pipeline

### Component A: The Smart Scraper
-   **Target**: FIS Official Website.
-   **Logic**: 
    1.  Read `athletes.json` to get target FIS Codes.
    2.  For each athlete, fetch their specific "Results" page.
    3.  Parse HTML table data.
    4.  **Difference Check**: Compare with existing data to only process new results.

### Component B: The Validator (Gatekeeper)
Before saving any JSON, the data must pass **Pydantic Validation**.
-   **Rule 1**: `rank` must be an integer or specific DNS/DNF string.
-   **Rule 2**: `date` must be ISO 8601 YYYY-MM-DD.
-   **Rule 3**: `athlete_id` in Result must exist in `athletes.json`.

### Component C: The Transformer
-   Calculates derived stats (e.g., "Top 10 Finishes", "Season Trend").
-   Injects these into a `stats` object within the athlete profile for easy frontend access.

---

## 4. Implementation Details (Python)

### Dependencies
-   `requests`: For fetching pages.
-   `beautifulsoup4`: For parsing HTML.
-   `pydantic`: For strict schema validation.
-   `pandas`: For complex aggregations (optional).

### Error Handling Strategy
-   **Soft Failure**: If one athlete's page fails, log it and continue. Do not crash the entire pipeline.
-   **Alerting**: Generate a `pipeline_report.txt` after every run highlighting new results and any parsing errors.

---

## 5. Development Checklist
-   [ ] Define `Athlete`, `Event`, `Result` Pydantic models.
-   [ ] Write migration script to convert V2 flat data to V3 relational schema.
-   [ ] Implement `FIS_Scraper_V3.py` with difference checking.
-   [ ] Create `validate_data.py` to run CI/CD checks.

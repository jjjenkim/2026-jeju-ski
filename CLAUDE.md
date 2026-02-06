# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a multi-project repository containing tools for organizing notes, tracking winter sports data, generating dashboards, and creating web designs.

---

## Active Projects

### projects/Fail_fis-korea-dashboard/
React/TypeScript dashboard for FIS Korea national team athletes. Displays athlete data, competition results, and statistics with charts. Uses Vite, Highcharts, and Excel data integration.

### JEN Group Agents & Governance
Control Tower for the entire workspace.
- **Agents Location**: `JEN Group/Agents/{Team}/` (e.g., Office_of_Choice, Finance_Team)
- **Reports Location**: `JEN Group/Reports/{Team}/`
- **Key Protocol**: Cost Zero Protocol (Vertex AI Migration), Auto-Documentation.

### projects/fis-regs-mvp/
Streamlit RAG application for querying FIS regulations. Uses Perplexity for document retrieval and Gemini for answering.

### projects/antigravity_engine_20260120/
Python AI tool that converts images/CSV files to HTML dashboards using Gemini AI. Generates styled dashboards from data inputs.

### projects/team-korea-V3-Build/
React/TypeScript dashboard with Vite and Tailwind CSS. One of the Team Korea dashboard iterations.

### projects/team-korea-winter-2025-26_20260123/
Latest Team Korea dashboard project with multiple iterations (V5, V6). Includes data analysis Python scripts and complex design variations.
- **Project V6 (Noir Luxury Style)**: Successfully deployed on **Vercel** (verified 2026-02-05).
- Key Features: Dark mode, sophisticated data visualization, relational data structure.

### projects/Web-design-2026/
Collection of 7 web design templates, each a standalone Vite + React project:
- `01_SaaS_Bento` - SaaS bento grid design
- `02_ThreeD_Scroll` - 3D scroll effects
- `03_Organic_AntiGrid` - Organic anti-grid layout
- `04_HandDrawn_Nostalgic` - Hand-drawn nostalgic style
- `05_Dopamine_Y2K` - Y2K dopamine aesthetic
- `06_Cyber_Poster` - Cyberpunk poster design
- `07_Ski_Poster` - Ski-themed poster

### projects/Press_Center/
Article management system with markdown files, HTML outputs, and translation support. Contains workflow guides and batch processing scripts.

### projects/인스타_캐로셀/
Python pipeline for generating Instagram carousel content. Uses `insta_pipeline.py` with `config.py` configuration.

### projects/통번역 프로젝트 🩷/
Translation pipeline with `translate_mission.py`. Includes sequential interpretation guides for English-Korean and Korean-English.

### projects/Notion_Organizer/
Python tool for analyzing and organizing Notion workspaces via API.

### projects/Obsidian_PARA_Organizer/
Python tool for organizing Obsidian vaults using the PARA method.

### projects/옵시디언_정리프로그램/
Korean-language Obsidian vault organizer.

### projects/Project_vilan_note/
Data archive with character/villain database markdown files.

---

## Shared Utilities

### shared/
Reusable Python utilities used across projects:
- `cache.py` - Caching utility for performance
- `orchestrator.py` - Task orchestration
- `corrector.py` - Auto-correction and retry logic

---

## Root-Level Tools

### convert_md_to_html.py
Markdown to HTML converter designed for Korean job performance reports.

### scripts/gemini_reviewer.py
Code review tool using Gemini AI.

---

## Archived/Legacy Projects

> These projects are documented for reference but may no longer exist at their original locations.

### ~~Root Level - Obsidian Vault Organizer~~ (Archived)
Previously at root with `main.py` and `enhancer.py`. Python tool for organizing Obsidian markdown vaults.

### ~~fis-korea-dashboard/~~ (Moved)
Originally at root level. Now located at `projects/Fail_fis-korea-dashboard/`.

---

## Common Commands

### FIS Korea Dashboard
```bash
cd projects/Fail_fis-korea-dashboard
npm install                  # Install dependencies
npm run dev                  # Start dev server (localhost:5173)
npm run build                # Production build (tsc + vite)
npm run lint                 # ESLint
npm run preview              # Preview built output
npm run update-excel-data    # Scrape all 40 athletes
npm run excel-scrape <id>    # Scrape single athlete by FIS ID
npm run dev:full             # Concurrent Vite + Node server
```

### FIS Regs MVP
```bash
cd projects/fis-regs-mvp
pip install -r requirements.txt
streamlit run app.py         # Start Streamlit app
```
Requires `.env` with `GEMINI_API_KEY`, `GEMINI_MODEL`, `PERPLEXITY_API_KEY`

### Antigravity Engine
```bash
cd projects/antigravity_engine_20260120
./run.command                # Executable launcher
# or
python src/antigravity_engine.py
```
Config: `config.json` with Google API key, target file, design style

### Team Korea Dashboards
```bash
cd projects/team-korea-V3-Build
# or
cd projects/team-korea-winter-2025-26_20260123
npm install
npm run dev                  # Start dev server
npm run build                # Production build
npm run preview              # Preview built output
```

### Web Design Templates
```bash
cd projects/Web-design-2026/<template-name>
npm install
npm run dev                  # Start dev server
npm run build                # Production build
npm run lint                 # ESLint
npm run preview              # Preview built output
```

### Instagram Carousel Generator
```bash
cd projects/인스타_캐로셀
python insta_pipeline.py
```
Config: `config.py`

### Translation Pipeline
```bash
cd "projects/통번역 프로젝트 🩷"
python translate_mission.py
```

### Notion Organizer
```bash
cd projects/Notion_Organizer
pip3 install notion-client
python3 notion_organizer.py
```
Config: `config.txt` with `NOTION_TOKEN` and `OUTPUT_PAGE_ID`

---

## Architecture Notes

### FIS Dashboard Data Flow
1. Scraper scripts (`scripts/fis-to-excel.ts`) fetch athlete data from FIS website
2. Multiple scraping methods: Playwright, Cheerio, Manual, Auto
3. Data stored as Excel files in `public/data/athletes/` (one file per athlete)
4. React app loads Excel files via hooks in `src/hooks/`
5. Components display data with Highcharts (`src/components/charts/`)
6. Uses shared utilities (orchestrator, cache, corrector) for performance

### Antigravity Engine Architecture
- Entry: `src/antigravity_engine.py`
- Uses Gemini AI to convert images/CSV to HTML dashboards
- Config-driven: `config.json` specifies API key, input file, design style
- Outputs styled HTML dashboard files

### Team Korea Dashboard Pattern
- Multiple iterations exist (V3, V5, V6) showing design evolution
- Each version is a standalone Vite + React + TypeScript project
- Uses Tailwind CSS, Framer Motion, Recharts
- Contains data analysis scripts (`audit_fis_data.py`, `enhance_data.py`)

### Web Design Templates
- 7 distinct design styles as standalone projects
- Each uses Vite + React + TypeScript
- Demonstrates different modern web design patterns

---

## Korean Language Context

Documentation and UI strings are primarily in Korean. The tools are designed for Korean users managing personal knowledge bases and tracking Korean winter sports athletes.

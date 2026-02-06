# Autonomous Loop Runner (fis-regs-mvp)

## What this does
Runs a repeatable debug loop:
1) py_compile
2) import check
3) Streamlit headless smoke test (brief run)

If a step fails, it sends the error + current allowlisted files to Gemini and applies safe updates
(ONLY: app.py, requirements.txt, README.md, .gitignore).

## Required
Create: projects/fis-regs-mvp/.env

GEMINI_API_KEY=YOUR_KEY
GEMINI_MODEL=gemini-2.5-flash

## Run
From anywhere:

cd projects/fis-regs-mvp
python3 autoloop.py

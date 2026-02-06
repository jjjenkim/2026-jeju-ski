# ENGINEERING PLAN

## Stack
- **Framework**: Streamlit
- **Networking**: requests
- **Parsing**: beautifulsoup4 (for listing), pypdf (for content)
- **Config**: python-dotenv
- **AI**: Google Generative AI (Gemini API)

## Architecture
- **Session Cache**: Store parsed PDF text in `st.session_state` to avoid re-downloading.
- **No Disk Writes**: Use `io.BytesIO` for PDF handling.
- **Evidence Gate**: Pre-filter chunks based on vector similarity or keyword overlap before sending to LLM.
- **Page Scoring**: Heuristic to identify most relevant pages for citation.


# DESIGN UI

## Streamlit UI States

### 1. Catalog Refresh
- Button to fetch latest document list.
- Spinner/Progress bar during fetch.

### 2. Doc Select
- Multi-select dropdown keying off document titles.
- "Select All" / "Clear All" helpers.

### 3. Load Status
- Visual indicator of memory ingestion progress.
- Success/Error toasts for individual files.

### 4. Q&A Interface
- Chat input at bottom.
- Message history display.

### 5. Refusal State
- Distinct visual cue (e.g., yellow warning box) when answering with a refusal/no evidence found.

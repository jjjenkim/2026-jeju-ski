# FIS Chat (MVP)

An intelligent, search-driven RAG system for FIS regulations using Perplexity for retrieval and Gemini for answering.

## Setup

1.  **Environment**:
    Create a `.env` file in this directory:
    ```bash
    GEMINI_API_KEY=your_gemini_key
    GEMINI_MODEL=gemini-2.5-flash
    PERPLEXITY_API_KEY=your_perplexity_key
    ```

2.  **Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

1.  Run the application:
    ```bash
    streamlit run app.py
    ```

2.  **Workflow**:
    -   **Configure**: Select Discipline/Area in the sidebar.
    -   **Ask**: Type your question in Korean.
    -   **Auto-Search**: Uses Perplexity to find relevant FIS PDF URLs.
    -   **Load & Answer**: Downloads PDFs to memory, extracts text, and generates an evidence-based answer via Gemini.

## Notes
-   **In-Memory Only**: NO disk storage.
-   **Strict Citation**: Refuses to answer if evidence is missing in the loaded PDFs.
-   **Cache**: Keeps up to 5 PDFs in memory for 2 hours.

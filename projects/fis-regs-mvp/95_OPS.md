# OPS

## Configuration
- **Seed Hubs**:
  - https://www.fis-ski.com/inside-fis/document-library/alpine-documents
  - https://www.fis-ski.com/inside-fis/document-library/cross-country-documents
  - https://www.fis-ski.com/inside-fis/document-library/ski-jumping-documents
  - https://www.fis-ski.com/inside-fis/document-library/nordic-combined-documents
  - https://www.fis-ski.com/inside-fis/document-library/snowboard-documents
  - https://www.fis-ski.com/inside-fis/document-library/freestyle-freeski-documents

- **Refresh Policy**: Manual refresh by user; no auto-cron.
- **Rate Limits**: Adhere to Gemini API limits (check RPM/TPM).
- **Key Management**: API keys via `.env` only.

## Monitoring
- **Logging**: Minimal console logging for errors. No persistent logs.

# QA TESTS

## Test Cases
1. **Refusal Exact Line**: Query irrelevant topic (e.g., "cooking recipes"). Expect standard refusal.
2. **Citation Required**: Query valid rule. Expect "참고 문서: ..." footer.
3. **Korean Output**: Verify explanation is in Korean.
4. **English Preservation**: Verify rule text is in English.
5. **No Evidence -> Refuse**: Query something not in loaded docs. Expect refusal.
6. **Multi-PDF Selection**: Load 3+ large PDFs. Verify memory usage/stability.
7. **Network Failure**: Simulate offline during fetch. Expect graceful error.

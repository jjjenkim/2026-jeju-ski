# CORE TEMPLATE

## Non-negotiables
1. **No Local Storage**: Do not save PDFs or text files to disk. All processing must be in-memory.
2. **Evidence-Only Answers**: All answers must be derived solely from the provided documents.
3. **Fixed Refusal Line**: If the answer is not in the documents, strictly refuse to answer using the standard refusal message.

## Answer Contract
Structure all responses as follows:
1. **Conclusion**: A direct answer to the user's question.
2. **Evidence**: Cite the specific document name and page number.
3. **English Excerpt**: Include the exact English text from the document that supports the answer.
4. **Final Line**: End with "참고 문서: [Document Name] (p. [Page Number])"

## Language Policy
- **Korean Explanation**: Provide explanations and context in Korean.
- **English Preservation**: Keep official terms and direct quotes in their original English.

## Definition of Done
- Scraping links works correctly.
- In-memory PDF extraction functions without errors.
- Refusal mechanism triggers correctly when evidence is missing.

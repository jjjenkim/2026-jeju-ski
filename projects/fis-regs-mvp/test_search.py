#!/usr/bin/env python3
"""
Quick test script for search functionality
Usage: python test_search.py
"""

import os
import json
import re
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")

def test_perplexity_search(query, scope_context):
    """Test Perplexity search"""
    if not PERPLEXITY_API_KEY:
        print("❌ Perplexity API Key not found")
        return []

    client = OpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai")

    sys_prompt = """You are a FIS regulation document search assistant.
Task: Find official FIS PDF documents from fis-ski.com domain.

Output format: Return ONLY a valid JSON array like this:
[
  {"title": "Alpine ICR 2024", "url": "https://...pdf"},
  {"title": "World Cup Rules", "url": "https://...pdf"}
]

Requirements:
1. URLs must end with .pdf
2. URLs must be from fis-ski.com or assets.fis-ski.com
3. Prioritize current season regulations (2024-2025)
4. Maximum 5 results
5. NO markdown formatting, NO explanations, ONLY the JSON array
"""

    try:
        print(f"\n🔍 검색어: {query}")
        print(f"📋 컨텍스트: {scope_context}\n")

        response = client.chat.completions.create(
            model="sonar-pro",
            messages=[
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": f"Search context: {scope_context}\nFind PDF documents for: {query}"},
            ],
            temperature=0.1,
            max_tokens=1000
        )
        content = response.choices[0].message.content

        print("=" * 60)
        print("Raw API Response:")
        print("=" * 60)
        print(content)
        print("=" * 60)

        # Try multiple JSON extraction methods
        results = []

        # Method 1: Direct JSON parse
        try:
            results = json.loads(content)
            if isinstance(results, list):
                print(f"\n✅ 방법 1 성공: {len(results)}개 발견")
                return results[:5]
        except Exception as e:
            print(f"⚠️ 방법 1 실패: {e}")

        # Method 2: Extract JSON array with regex
        match = re.search(r'\[\s*\{.*?\}\s*\]', content, re.DOTALL)
        if match:
            try:
                results = json.loads(match.group(0))
                if isinstance(results, list):
                    print(f"\n✅ 방법 2 성공: {len(results)}개 발견")
                    return results[:5]
            except Exception as e:
                print(f"⚠️ 방법 2 실패: {e}")

        # Method 3: Extract URLs manually from text
        urls = re.findall(r'https?://[^\s<>"]+?\.pdf', content)
        if urls:
            results = [{"title": f"Document {i+1}", "url": url} for i, url in enumerate(urls[:5])]
            print(f"\n⚠️ 방법 3 (URL 추출): {len(results)}개 발견")
            return results

        print("\n❌ 유효한 PDF URL을 찾지 못했습니다.")

    except Exception as e:
        print(f"\n❌ 검색 중 오류 발생: {str(e)}")
        import traceback
        traceback.print_exc()

    return []

def main():
    print("=" * 60)
    print("FIS Document Search Test")
    print("=" * 60)

    # Test cases
    test_cases = [
        {
            "query": "FIS Alpine international competition rules ICR official",
            "scope": "Official FIS Alpine regulations and competition rules"
        },
        {
            "query": "FIS Cross-Country international competition rules ICR official",
            "scope": "Official FIS Cross-Country regulations and competition rules"
        },
        {
            "query": "FIS Snowboard international competition rules ICR official",
            "scope": "Official FIS Snowboard regulations and competition rules"
        }
    ]

    for i, test in enumerate(test_cases, 1):
        print(f"\n\n{'=' * 60}")
        print(f"Test Case {i}")
        print(f"{'=' * 60}")

        results = test_perplexity_search(test["query"], test["scope"])

        if results:
            print(f"\n📚 검색 결과:")
            for j, doc in enumerate(results, 1):
                print(f"  {j}. {doc.get('title', 'N/A')}")
                print(f"     URL: {doc.get('url', 'N/A')}")
        else:
            print("\n❌ 검색 결과 없음")

        # Wait for user input before next test
        if i < len(test_cases):
            input("\n⏸️ Press Enter to continue to next test...")

if __name__ == "__main__":
    main()

import streamlit as st
import requests
import pypdf
import io
import os
import time
import json
import re
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from google import genai
from google.genai.types import HttpOptions, GenerateContentConfig
from openai import OpenAI
from anthropic import Anthropic

# --- Configuration & Setup ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")

# --- Constants ---
MAX_DOCS = 5
CACHE_TTL = 7200  # 2 hours

# Discipline names and their document page URLs
DISCIPLINE_CONFIG = {
    "Alpine Skiing": {
        "url": "https://www.fis-ski.com/en/inside-fis/document-library/alpine-documents",
        "keywords": ["alpine", "slalom", "giant slalom", "super-g", "downhill"]
    },
    "Cross-Country": {
        "url": "https://www.fis-ski.com/en/inside-fis/document-library/cross-country-documents",
        "keywords": ["cross-country", "cross country", "nordic", "xc"]
    },
    "Ski Jumping": {
        "url": "https://www.fis-ski.com/en/inside-fis/document-library/ski-jumping-documents",
        "keywords": ["ski jumping", "jump", "hill"]
    },
    "Nordic Combined": {
        "url": "https://www.fis-ski.com/en/inside-fis/document-library/nordic-combined-documents",
        "keywords": ["nordic combined"]
    },
    "Freeski Park&Pipe": {
        "url": "https://www.fis-ski.com/en/inside-fis/document-library/freeski-documents",
        "keywords": ["freeski", "park", "pipe", "halfpipe", "slopestyle"]
    },
    "Ski Cross": {
        "url": "https://www.fis-ski.com/en/inside-fis/document-library/ski-cross-documents",
        "keywords": ["ski cross", "skicross"]
    },
    "Freestyle": {
        "url": "https://www.fis-ski.com/en/inside-fis/document-library/freestyle-documents",
        "keywords": ["freestyle", "moguls", "aerials"]
    },
    "Snowboard Park&Pipe": {
        "url": "https://www.fis-ski.com/en/inside-fis/document-library/snowboard-documents",
        "keywords": ["snowboard", "park", "pipe", "halfpipe", "slopestyle"]
    },
    "Snowboard Alpine": {
        "url": "https://www.fis-ski.com/en/inside-fis/document-library/snowboard-documents",
        "keywords": ["snowboard alpine", "parallel giant slalom", "pgs"]
    },
    "Snowboard Cross": {
        "url": "https://www.fis-ski.com/en/inside-fis/document-library/snowboard-documents",
        "keywords": ["snowboard cross", "sbx"]
    }
}

DISCIPLINES = ["Select Discipline"] + list(DISCIPLINE_CONFIG.keys())

ROLES = ["Judge/TD", "Athlete/Coach", "Marketing/Ops"]

# Language mapping for friendly display
LANG_MAP = {
    "ko": "한국어",
    "en": "English",
    "ja": "日本語",
    "zh": "中文"
}

# --- Helper Functions ---

def get_gemini_client():
    if not GEMINI_API_KEY:
        return None
    try:
        return genai.Client(api_key=GEMINI_API_KEY, http_options=HttpOptions(api_version="v1alpha"))
    except Exception:
        return None

def get_claude_client():
    if not CLAUDE_API_KEY:
        return None
    try:
        return Anthropic(api_key=CLAUDE_API_KEY)
    except Exception:
        return None

def normalize_query(user_query):
    """
    Uses Gemini to extract English search keywords and detect input language.
    Returns dict: {'original': str, 'english': str, 'keywords': list, 'language': str}
    """
    client = get_gemini_client()
    if not client:
        return {
            "original": user_query, 
            "english": user_query, 
            "keywords": user_query.split(),
            "language": "en"
        }

    prompt = f"""
    Task: 
    1. Detect the input language (ko for Korean, ja for Japanese, en for English, zh for Chinese)
    2. Convert the User Query into English search keywords for finding FIS regulation PDFs.
    
    Input: "{user_query}"
    
    Output Requirement: JSON only.
    Schema: {{ 
        "detected_language": "ko", 
        "english_query": "string (sentence)", 
        "keywords": ["word1", "word2"] 
    }}
    
    Rules:
    - detected_language should be: ko, ja, en, zh, etc (ISO 639-1 code)
    - If input is Korean/Japanese/Chinese, translate to English sport/technical terms
    - Keep official FIS terms (ICR, DSQ, Gate, Bib) exact
    """
    
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL, 
            contents=prompt,
            config=GenerateContentConfig(response_mime_type="application/json")
        )
        data = json.loads(response.text)
        return {
            "original": user_query,
            "english": data.get("english_query", user_query),
            "keywords": data.get("keywords", []),
            "language": data.get("detected_language", "en")
        }
    except Exception as e:
        st.warning(f"Language detection failed: {e}")
        return {
            "original": user_query, 
            "english": user_query, 
            "keywords": user_query.split(),
            "language": "en"
        }

def scrape_fis_documents(discipline):
    """Scrape PDF links directly from FIS document library pages."""
    if discipline not in DISCIPLINE_CONFIG:
        return []

    config = DISCIPLINE_CONFIG[discipline]
    doc_url = config["url"]

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        resp = requests.get(doc_url, headers=headers, timeout=15)
        if resp.status_code != 200:
            return []

        soup = BeautifulSoup(resp.text, 'html.parser')

        results = []
        # Find all links that point to PDFs
        for link in soup.find_all('a', href=True):
            href = link.get('href', '')
            if '.pdf' in href.lower():
                # Get the title from link text or nearby text
                title = link.get_text(strip=True)
                if not title:
                    title = href.split('/')[-1].replace('.pdf', '').replace('-', ' ').replace('_', ' ')

                # Make absolute URL if relative
                if href.startswith('/'):
                    href = f"https://www.fis-ski.com{href}"
                elif not href.startswith('http'):
                    href = f"https://www.fis-ski.com/{href}"

                # Filter for ICR, rules, regulations
                title_lower = title.lower()
                if any(kw in title_lower for kw in ['icr', 'rule', 'regulation', 'world cup', 'specification']):
                    results.append({"title": title, "url": href})

        # Deduplicate by URL
        seen = set()
        unique_results = []
        for r in results:
            if r['url'] not in seen:
                seen.add(r['url'])
                unique_results.append(r)

        return unique_results[:10]  # Return max 10 results

    except Exception as e:
        st.error(f"문서 페이지 스크래핑 실패: {e}")
        return []

def perplexity_search_candidates(query, discipline):
    """Uses Perplexity as fallback to find candidate PDF URLs from fis-ski.com."""
    if not PERPLEXITY_API_KEY:
        return []

    client = OpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai")

    sys_prompt = f"""
    Find official FIS (International Ski Federation) regulation PDF URLs.
    Discipline: {discipline}

    STRICT RULES:
    1. ONLY return URLs from the domain: fis-ski.com
    2. URLs MUST end with .pdf
    3. Search for: "{query}" ICR, rules, regulations
    4. Prioritize current season rules (2024/2025 or latest)
    5. Maximum 5 results

    Return ONLY a valid JSON array: [{{"title": "Document Name", "url": "https://www.fis-ski.com/....pdf"}}]
    """

    try:
        response = client.chat.completions.create(
            model="sonar-pro",
            messages=[
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": f"site:fis-ski.com {discipline} {query} ICR rules PDF"},
            ]
        )
        content = response.choices[0].message.content
        match = re.search(r'\[.*\]', content, re.DOTALL)
        if match:
            results = json.loads(match.group(0))
            filtered = [r for r in results if 'fis-ski.com' in r.get('url', '') and '.pdf' in r.get('url', '').lower()]
            return filtered
    except Exception:
        pass
    return []

def search_documents(discipline):
    """Main search function - tries direct scraping first, then Perplexity fallback."""
    # First try direct scraping
    results = scrape_fis_documents(discipline)

    # If no results, try Perplexity as fallback
    if not results and PERPLEXITY_API_KEY:
        with st.spinner("직접 검색 실패, Perplexity로 재시도..."):
            results = perplexity_search_candidates("", discipline)

    return results

def load_pdf_to_memory(url):
    """Downloads & extracts text to memory."""
    try:
        resp = requests.get(url, timeout=15)
        if resp.status_code == 200:
            f = io.BytesIO(resp.content)
            reader = pypdf.PdfReader(f)
            pages = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text and len(text) > 50:
                    pages.append({"page_num": i+1, "text": text})
            return pages
    except Exception as e:
        st.error(f"PDF 로드 실패 ({url}): {e}")
    return None

def score_pages_hybrid(query_data, loaded_docs, top_k=5):
    """
    Scores pages based on keyword overlap (English terms) + ngram overlap.
    query_data = {original, english, keywords, language}
    """
    query_terms = set([k.lower() for k in query_data['keywords']])
    # Simple bigrams from english query for phrase matching
    eng_words = query_data['english'].lower().split()
    query_bigrams = set(zip(eng_words, eng_words[1:]))

    scored = []
    
    for url, doc in loaded_docs.items():
        for page in doc['pages']:
            score = 0
            text_lower = page['text'].lower()
            
            # Keyword hit
            for term in query_terms:
                if term in text_lower:
                    score += 1.0
            
            # Bigram hit (higher weight)
            for bg in query_bigrams:
                phrase = f"{bg[0]} {bg[1]}"
                if phrase in text_lower:
                    score += 2.0
            
            if score > 0:
                scored.append({
                    "doc_title": doc['title'],
                    "page_num": page['page_num'],
                    "text": page['text'],
                    "score": score
                })

    # Sort DESC
    return sorted(scored, key=lambda x: x['score'], reverse=True)[:top_k]

def generate_answer_gemini(query_str, context_pages, role, detected_lang="ko"):
    """Generate answer using Gemini"""
    client = get_gemini_client()
    if not client:
        return "❌ Gemini API를 사용할 수 없습니다."

    # Build context blob with indexing
    ctx_blob = ""
    for i, p in enumerate(context_pages, 1):
        ctx_blob += f"[{i}] {p['doc_title']} (p.{p['page_num']})\n{p['text']}\n\n"

    lang_name = LANG_MAP.get(detected_lang, "English")
    
    sys_prompt = f"""당신은 FIS(국제스키연맹) 규정 전문가이자 친절한 선생님입니다.

**역할**: {role}을 돕는 교육자
**말투**: 1인칭 화자, 교육적이고 친근함
- "제가 설명드리겠습니다"
- "규정을 살펴보니 이렇습니다"
- "이 부분은 중요한데요"

**응답 언어**: {lang_name}

**엄격한 규칙**:
1. 제공된 문서([1], [2] 등) 내용만 사용
2. 답이 문서에 없으면 정확히 "NO_EVIDENCE" 출력
3. 출력 형식:

   [친절하고 교육적인 설명]
   
   **근거**
   (1) [문서명], p.[페이지]
   (2) [문서명], p.[페이지]
   
   **원문 발췌**
   "[핵심 문장 인용]"
"""

    user_msg = f"Context:\n{ctx_blob}\n\nQuestion: {query_str}"

    try:
        resp = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[
                {"role": "user", "parts": [{"text": sys_prompt}]},
                {"role": "user", "parts": [{"text": user_msg}]}
            ]
        )
        return resp.text
    except Exception as e:
        return f"❌ 답변 생성 중 오류: {str(e)}"

def generate_answer_claude(query_str, context_pages, role, detected_lang="ko"):
    """Generate answer using Claude"""
    client = get_claude_client()
    if not client:
        return "❌ Claude API를 사용할 수 없습니다."
    
    # Build context blob with indexing
    ctx_blob = ""
    for i, p in enumerate(context_pages, 1):
        ctx_blob += f"[{i}] {p['doc_title']} (p.{p['page_num']})\n{p['text']}\n\n"
    
    lang_name = LANG_MAP.get(detected_lang, "English")
    
    sys_prompt = f"""당신은 FIS(국제스키연맹) 규정 전문가이자 친절한 선생님입니다.

**역할**: {role}을 돕는 교육자
**말투**: 1인칭 화자, 교육적이고 친근함
- "제가 설명드리겠습니다"
- "규정을 살펴보니 이렇습니다"
- "이 부분은 중요한데요"

**응답 언어**: {lang_name}

**엄격한 규칙**:
1. 제공된 문서([1], [2] 등) 내용만 사용
2. 답이 문서에 없으면 정확히 "NO_EVIDENCE" 출력
3. 출력 형식:

   [친절하고 교육적인 설명]
   
   **근거**
   (1) [문서명], p.[페이지]
   (2) [문서명], p.[페이지]
   
   **원문 발췌**
   "[핵심 문장 인용]"
"""
    
    user_msg = f"Context:\n{ctx_blob}\n\nQuestion: {query_str}"
    
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            system=sys_prompt,
            messages=[{"role": "user", "content": user_msg}]
        )
        return response.content[0].text
    except Exception as e:
        return f"❌ 답변 생성 중 오류: {str(e)}"

def format_answer_with_citations(answer_text, context_pages, message_id=None):
    """Display answer with clickable citation buttons that reveal source text"""
    # Display main answer
    st.markdown(answer_text)

    # Extract citation numbers
    citations = re.findall(r'\((\d+)\)', answer_text)

    if citations and context_pages:
        unique_citations = sorted(set([int(c) for c in citations]))

        # Citation buttons row
        st.markdown("---")
        st.markdown("**📚 Sources** - 번호를 클릭하면 원문을 볼 수 있습니다")

        # Create button columns for citations
        cols = st.columns(min(len(unique_citations), 5))

        for idx, cite_num in enumerate(unique_citations):
            if cite_num <= len(context_pages):
                page_info = context_pages[cite_num - 1]
                col_idx = idx % 5

                with cols[col_idx]:
                    btn_key = f"cite_{message_id}_{cite_num}" if message_id else f"cite_{cite_num}"
                    if st.button(f"({cite_num})", key=btn_key, use_container_width=True):
                        st.session_state.citation_visible[cite_num] = not st.session_state.citation_visible.get(cite_num, False)
                        st.rerun()

        # Display visible citations with smooth popup style
        for cite_num in unique_citations:
            if st.session_state.citation_visible.get(cite_num, False) and cite_num <= len(context_pages):
                page_info = context_pages[cite_num - 1]

                # Extract article numbers if present (e.g., "3345.3.2")
                article_match = re.search(r'(\d+\.?\d*\.?\d*)\s', page_info['text'][:100])
                article_num = article_match.group(1) if article_match else ""

                st.markdown(f"""
                <div class="citation-popup">
                    <div class="citation-header">
                        ({cite_num}) {page_info['doc_title']} | p.{page_info['page_num']} {f'| Art. {article_num}' if article_num else ''}
                    </div>
                    <div class="citation-text">
                        {page_info['text'][:800]}{'...' if len(page_info['text']) > 800 else ''}
                    </div>
                </div>
                """, unsafe_allow_html=True)

# --- UI Layout ---

st.set_page_config(page_title="FIS Chat", layout="wide", page_icon="⛷️")

# FIS Brand Colors CSS
st.markdown("""
<style>
    /* FIS Brand Colors */
    :root {
        --fis-blue: #003366;
        --fis-light-blue: #0066cc;
        --fis-orange: #ff6600;
        --fis-white: #ffffff;
        --fis-gray: #f5f5f5;
    }

    /* Header styling */
    .main h1 {
        color: #003366 !important;
        font-weight: 700;
    }

    /* Sidebar styling */
    [data-testid="stSidebar"] {
        background-color: #003366;
    }

    [data-testid="stSidebar"] .stMarkdown,
    [data-testid="stSidebar"] label,
    [data-testid="stSidebar"] .stCaption {
        color: white !important;
    }

    [data-testid="stSidebar"] h1,
    [data-testid="stSidebar"] h2,
    [data-testid="stSidebar"] h3 {
        color: #ff6600 !important;
    }

    /* Button styling */
    .stButton > button {
        background-color: #0066cc;
        color: white;
        border: none;
        border-radius: 4px;
    }

    .stButton > button:hover {
        background-color: #ff6600;
        color: white;
    }

    /* Citation popup styling */
    .citation-popup {
        background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
        border-left: 4px solid #ff6600;
        padding: 16px;
        margin: 8px 0;
        border-radius: 0 8px 8px 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .citation-header {
        color: #003366;
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 8px;
    }

    .citation-text {
        color: #333;
        font-size: 13px;
        line-height: 1.6;
        font-family: 'Georgia', serif;
    }

    /* Chat message styling */
    .stChatMessage {
        border-radius: 12px;
    }

    /* Selectbox styling */
    [data-testid="stSidebar"] .stSelectbox label {
        color: white !important;
    }
</style>
""", unsafe_allow_html=True)

# Session State Init
if "messages" not in st.session_state:
    st.session_state.messages = []
if "loaded_docs" not in st.session_state:
    st.session_state.loaded_docs = {}
if "search_candidates" not in st.session_state:
    st.session_state.search_candidates = []
if "prev_disc" not in st.session_state:
    st.session_state.prev_disc = "Select Discipline"
if "citation_visible" not in st.session_state:
    st.session_state.citation_visible = {}

# --- Sidebar ---
with st.sidebar:
    st.header("FIS Chat")
    st.caption("Official FIS Regulations Assistant")

    st.divider()

    # A) LLM Selection
    st.subheader("AI Model")
    llm_choice = st.radio(
        "Response Model",
        ["Gemini", "Claude"],
        index=0,
        help="Gemini: Fast / Claude: Detailed"
    )

    st.divider()

    # B) Discipline Selection
    st.subheader("Discipline")
    disc = st.selectbox("Select", DISCIPLINES, key="discipline_select", label_visibility="collapsed")

    # Search and Refresh buttons
    col1, col2 = st.columns(2)
    with col1:
        search_clicked = st.button("🔍 Search", use_container_width=True)
    with col2:
        refresh_clicked = st.button("🔄 Refresh", use_container_width=True)

    # Handle search/refresh
    if search_clicked or refresh_clicked or (disc != st.session_state.prev_disc and disc != "Select Discipline"):
        st.session_state.prev_disc = disc
        if disc != "Select Discipline":
            with st.spinner(f"'{disc}' 문서 검색 중..."):
                cands = search_documents(disc)
                st.session_state.search_candidates = cands
                if cands:
                    st.success(f"✅ {len(cands)}개 문서 발견!")
                else:
                    st.warning("⚠️ 문서를 찾지 못했습니다.")

    # Show document source URL
    if disc in DISCIPLINE_CONFIG:
        st.caption(f"📎 [문서 페이지 열기]({DISCIPLINE_CONFIG[disc]['url']})")

    st.divider()

    # C) Document Management
    st.subheader("Documents")

    # Manual URL input
    man_url = st.text_input("PDF URL 직접 입력", placeholder="https://...")
    if st.button("➕ URL 추가", use_container_width=True):
        if man_url and man_url.endswith('.pdf'):
            st.session_state.search_candidates.append({"title": "Manual PDF", "url": man_url})
            st.rerun()

    # Candidates Table
    candidates = st.session_state.search_candidates
    if candidates:
        st.caption(f"📋 검색 결과: {len(candidates)}개")
        with st.form("load_form"):
            selected_urls = []
            for c in candidates:
                is_checked = st.checkbox(f"{c['title'][:40]}...", value=True, key=c['url'])
                if is_checked:
                    selected_urls.append(c)

            if st.form_submit_button("✅ Load Selected", use_container_width=True):
                curr_len = len(st.session_state.loaded_docs)
                if curr_len + len(selected_urls) > MAX_DOCS:
                    st.error(f"❌ 최대 {MAX_DOCS}개까지 가능")
                else:
                    success_count = 0
                    fail_count = 0

                    with st.spinner("PDF 로드 중..."):
                        for item in selected_urls:
                            if item['url'] not in st.session_state.loaded_docs:
                                pages = load_pdf_to_memory(item['url'])
                                if pages:
                                    st.session_state.loaded_docs[item['url']] = {
                                        "title": item['title'],
                                        "pages": pages,
                                        "ts": time.time()
                                    }
                                    success_count += 1
                                else:
                                    fail_count += 1

                    if success_count > 0:
                        st.success(f"✅ {success_count}개 로드 완료!")
                    if fail_count > 0:
                        st.error(f"❌ {fail_count}개 실패")

                    st.session_state.search_candidates = []
                    st.rerun()

    st.divider()

    # Loaded Documents
    st.subheader("Loaded")
    doc_keys = list(st.session_state.loaded_docs.keys())
    st.caption(f"{len(doc_keys)} / {MAX_DOCS}")

    if st.button("🗑️ Clear All", type="secondary", use_container_width=True):
        st.session_state.loaded_docs = {}
        st.session_state.messages = []
        st.session_state.search_candidates = []
        st.rerun()

    for url in doc_keys:
        d = st.session_state.loaded_docs[url]
        c1, c2 = st.columns([0.85, 0.15])
        c1.markdown(f"**{d['title'][:25]}...**")
        c1.caption(f"{len(d['pages'])} pages")
        if c2.button("✕", key=f"del_{url}"):
            del st.session_state.loaded_docs[url]
            st.rerun()

    st.divider()

    # D) Role
    role = st.selectbox("👤 Role", ROLES)

    # Version info
    st.caption("---")
    st.caption(f"🤖 {llm_choice} | v3.0")


# --- Main Chat UI ---
st.title("FIS Chat ⛷️")
st.caption("Ask anything about FIS regulations")

if len(st.session_state.loaded_docs) == 0:
    st.info("👈 Select a discipline and load documents to start")
    st.markdown("""
    **How to use**:
    1. Select a **Discipline** from sidebar
    2. Click **Search** to find documents
    3. **Load** the documents
    4. Ask your question below!
    """)

# Display History
for idx, msg in enumerate(st.session_state.messages):
    with st.chat_message(msg["role"]):
        if msg["role"] == "assistant" and "context_pages" in msg:
            format_answer_with_citations(msg["content"], msg["context_pages"], message_id=idx)
        else:
            st.markdown(msg["content"])

# Input
if prompt := st.chat_input("Ask a question..."):
    if len(st.session_state.loaded_docs) == 0:
        st.error("❌ No documents loaded. Please load documents first.")
        st.stop()

    # User Msg
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Assistant Logic
    with st.chat_message("assistant"):
        msg_placeholder = st.empty()
        msg_placeholder.write("🔍 Searching documents...")

        # 1. Normalize
        q_data = normalize_query(prompt)
        detected_lang = q_data.get("language", "en")

        # 2. Score
        hits = score_pages_hybrid(q_data, st.session_state.loaded_docs, top_k=5)

        # 3. Decision
        has_evidence = len(hits) > 0 and hits[0]['score'] >= 1.0

        if not has_evidence:
            final_text = f"Sorry, I couldn't find relevant content for '{prompt}' in the loaded documents.\n\nTry different keywords!"
            msg_placeholder.markdown(final_text)
            st.session_state.messages.append({
                "role": "assistant",
                "content": final_text
            })
        else:
            # Generate Answer
            msg_placeholder.write(f"🤖 Generating response with {llm_choice}...")

            if llm_choice == "Claude":
                ans = generate_answer_claude(prompt, hits, role, detected_lang)
            else:
                ans = generate_answer_gemini(prompt, hits, role, detected_lang)

            # Post-check: did LLM say NO_EVIDENCE?
            if "NO_EVIDENCE" in ans:
                ans = "Sorry, I couldn't find the answer in the provided documents."

            msg_placeholder.empty()
            msg_id = len(st.session_state.messages)
            format_answer_with_citations(ans, hits, message_id=msg_id)

            st.session_state.messages.append({
                "role": "assistant",
                "content": ans,
                "context_pages": hits
            })

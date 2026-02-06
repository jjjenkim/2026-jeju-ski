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
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-exp")
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")

# --- Constants ---
MAX_DOCS = 5
CACHE_TTL = 7200

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

DISCIPLINES = ["종목 선택"] + list(DISCIPLINE_CONFIG.keys())
ROLES = ["심판/TD", "선수/코치", "마케팅/운영"]
LANG_MAP = {"ko": "한국어", "en": "English", "ja": "日本語", "zh": "中文"}

# --- Helper Functions ---

def get_gemini_client():
    if not GEMINI_API_KEY: return None
    try: return genai.Client(api_key=GEMINI_API_KEY, http_options=HttpOptions(api_version="v1alpha"))
    except: return None

def get_claude_client():
    if not CLAUDE_API_KEY: return None
    try: return Anthropic(api_key=CLAUDE_API_KEY)
    except: return None

def normalize_query(user_query):
    client = get_gemini_client()
    if not client: return {"original": user_query, "english": user_query, "keywords": user_query.split(), "language": "en"}
    prompt = f"Detect language and extract English keywords for FIS regs: '{user_query}'\nReturn JSON: {{'detected_language': 'ko', 'english_query': '...', 'keywords': [...]}}"
    try:
        response = client.models.generate_content(model=GEMINI_MODEL, contents=prompt, config=GenerateContentConfig(response_mime_type="application/json"))
        data = json.loads(response.text)
        return {"original": user_query, "english": data.get("english_query", user_query), "keywords": data.get("keywords", []), "language": data.get("detected_language", "en")}
    except: return {"original": user_query, "english": user_query, "keywords": user_query.split(), "language": "en"}

def scrape_fis_documents(discipline):
    if discipline not in DISCIPLINE_CONFIG: return []
    url = DISCIPLINE_CONFIG[discipline]["url"]
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        resp = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(resp.text, 'html.parser')
        results = []
        for link in soup.find_all('a', href=True):
            href = link.get('href', '')
            if '.pdf' in href.lower():
                title = link.get_text(strip=True) or href.split('/')[-1]
                if href.startswith('/'): href = f"https://www.fis-ski.com{href}"
                if any(kw in title.lower() for kw in ['icr', 'rule', 'regulation', 'world cup']):
                    results.append({"title": title, "url": href})
        seen = set()
        return [r for r in results if not (r['url'] in seen or seen.add(r['url']))][:10]
    except: return []

def perplexity_search_candidates(query, discipline):
    if not PERPLEXITY_API_KEY: return []
    client = OpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai")
    sys_prompt = f"Find FIS regulation PDF URLs for {discipline}. JSON array only."
    try:
        response = client.chat.completions.create(model="sonar-pro", messages=[{"role": "system", "content": sys_prompt},{"role": "user", "content": f"site:fis-ski.com {discipline} rules PDF"}])
        match = re.search(r'\[.*\]', response.choices[0].message.content, re.DOTALL)
        if match: return json.loads(match.group(0))
    except: pass
    return []

def search_documents(discipline):
    results = scrape_fis_documents(discipline)
    if not results and PERPLEXITY_API_KEY: results = perplexity_search_candidates("", discipline)
    return results

def load_pdf_to_memory(url):
    try:
        resp = requests.get(url, timeout=15)
        if resp.status_code == 200:
            reader = pypdf.PdfReader(io.BytesIO(resp.content))
            pages = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text and len(text) > 50: pages.append({"page_num": i+1, "text": text})
            return pages
    except: pass
    return None

def score_pages_hybrid(query_data, loaded_docs, top_k=5):
    query_terms = set([k.lower() for k in query_data['keywords']])
    scored = []
    for url, doc in loaded_docs.items():
        for page in doc['pages']:
            score = sum(1.0 for term in query_terms if term in page['text'].lower())
            if score > 0: scored.append({"doc_title": doc['title'], "page_num": page['page_num'], "text": page['text'], "score": score})
    return sorted(scored, key=lambda x: x['score'], reverse=True)[:top_k]

def generate_answer_gemini(query_str, context_pages, role, detected_lang="ko"):
    client = get_gemini_client()
    if not client: return "❌ Gemini API Error"
    ctx = "".join([f"[{i+1}] {p['doc_title']} (p.{p['page_num']})\n{p['text']}\n\n" for i, p in enumerate(context_pages)])
    sys_prompt = f"당신은 FIS 규정 전문가입니다. 역할: {role}. 언어: {LANG_MAP.get(detected_lang, '한국어')}. [1][2] 형식으로 근거를 남기세요."
    try:
        resp = client.models.generate_content(model=GEMINI_MODEL, contents=[{"role": "user", "parts": [{"text": sys_prompt}]}, {"role": "user", "parts": [{"text": f"Context: {ctx}\nQuestion: {query_str}"}]}])
        return resp.text
    except: return "❌ Error"

def generate_answer_claude(query_str, context_pages, role, detected_lang="ko"):
    client = get_claude_client()
    if not client: return "❌ Claude API Error"
    ctx = "".join([f"[{i+1}] {p['doc_title']} (p.{p['page_num']})\n{p['text']}\n\n" for i, p in enumerate(context_pages)])
    sys_prompt = f"당신은 FIS 규정 전문가입니다. 역할: {role}. 언어: {LANG_MAP.get(detected_lang, '한국어')}. [1][2] 형식으로 근거를 남기세요."
    try:
        response = client.messages.create(model="claude-3-5-sonnet-20241022", max_tokens=2000, system=sys_prompt, messages=[{"role": "user", "content": f"Context: {ctx}\nQuestion: {query_str}"}])
        return response.content[0].text
    except: return "❌ Error"

# --- CUSTOM CSS ---
def inject_custom_css():
    st.markdown("""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        :root { --fis-blue: #002D62; --fis-yellow: #F0AB00; --fis-grey: #F4F6F9; }
        html, body, [class*="css"] { font-family: 'Roboto', sans-serif; color: var(--fis-blue); }
        
        /* SIDEBAR */
        [data-testid="stSidebar"] { background-color: var(--fis-blue) !important; color: white !important; }
        [data-testid="stSidebar"] * { color: white !important; }
        
        /* BUTTONS */
        div.stButton > button { background-color: var(--fis-yellow); color: var(--fis-blue); border-radius: 8px; font-weight: bold; border: none; }
        div.stButton > button:hover { background-color: white; color: var(--fis-blue); border: 1px solid var(--fis-blue); }
        
        /* CARDS */
        .fis-card { background: white; padding: 15px; border-radius: 12px; border-left: 5px solid var(--fis-yellow); box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px; }
        .citation-card { background: #FFFFFF; border-left: 4px solid var(--fis-yellow); padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 0.85rem; border: 1px solid #E5E7EB; border-left-width: 4px; }
        
        /* CHAT MESSAGES */
        [data-testid="stChatMessage"][data-author="user"] { background-color: #E8F0FE; border-radius: 15px; }
        [data-testid="stChatMessage"][data-author="assistant"] { background-color: white; border: 1px solid #E5E7EB; border-radius: 15px; }
        
        header { background: transparent !important; }
        footer { visibility: hidden; }
        </style>
    """, unsafe_allow_html=True)

# --- APP ---
def main():
    st.set_page_config(page_title="FIS Regulations AI", layout="wide", page_icon="⛷️")
    inject_custom_css()

    if "messages" not in st.session_state: st.session_state.messages = []
    if "loaded_docs" not in st.session_state: st.session_state.loaded_docs = {}
    if "search_candidates" not in st.session_state: st.session_state.search_candidates = []
    if "prev_disc" not in st.session_state: st.session_state.prev_disc = "종목 선택"

    # --- SIDEBAR: ALL CONTROLS ---
    with st.sidebar:
        st.image("https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/FIS_Logo.svg/100px-FIS_Logo.svg.png", width=60)
        st.subheader("FIS Regulations Chat")
        st.divider()
        
        llm_choice = st.radio("AI 모델 선택", ["Gemini", "Claude"], index=0)
        st.divider()
        
        disc = st.selectbox("종목 선택", DISCIPLINES, key="discipline_select")
        col1, col2 = st.columns(2)
        if col1.button("🔍 검색", use_container_width=True):
            if disc != "종목 선택":
                with st.spinner("검색 중..."): st.session_state.search_candidates = search_documents(disc)
        if col2.button("🔄 새로고침", use_container_width=True): st.rerun()

        if st.session_state.search_candidates:
            with st.form("load_form"):
                selected = []
                for c in st.session_state.search_candidates:
                    if st.checkbox(f"{c['title'][:30]}...", value=True, key=c['url']): selected.append(c)
                if st.form_submit_button("✅ 문서 로드", use_container_width=True):
                    with st.spinner("로드 중..."):
                        for item in selected:
                            if item['url'] not in st.session_state.loaded_docs:
                                pages = load_pdf_to_memory(item['url'])
                                if pages: st.session_state.loaded_docs[item['url']] = {"title": item['title'], "pages": pages}
                        st.session_state.search_candidates = []
                        st.rerun()

        st.divider()
        doc_keys = list(st.session_state.loaded_docs.keys())
        if doc_keys:
            st.subheader(f"로드된 문서 ({len(doc_keys)})")
            if st.button("🗑️ 모두 지우기"):
                st.session_state.loaded_docs = {}; st.session_state.messages = []; st.rerun()
            for k in doc_keys: st.caption(f"📄 {st.session_state.loaded_docs[k]['title'][:30]}...")

    # --- MAIN CONTENT: CHAT & CITATIONS ---
    # Split main area: 75% Chat, 25% Citations
    chat_col, cite_col = st.columns([0.7, 0.3], gap="large")

    with chat_col:
        st.title("FIS Regulations AI ⛷️")
        st.markdown('<div class="fis-card"><b>⛷️ FIS 규정 도우미</b><br>공식 규정을 바탕으로 답변을 제공합니다.</div>', unsafe_allow_html=True)
        
        if not st.session_state.messages and not st.session_state.loaded_docs:
            st.info("👈 사이드바에서 종목을 선택하고 문서를 로드해 주세요.")

        # Show Chat History
        for msg in st.session_state.messages:
            with st.chat_message(msg["role"]): st.markdown(msg["content"])

        # Chat Input
        if prompt := st.chat_input("규정에 대해 물어보세요..."):
            if not st.session_state.loaded_docs: st.error("❌ 문서를 먼저 로드해 주세요.")
            else:
                st.session_state.messages.append({"role": "user", "content": prompt})
                with st.chat_message("user"): st.markdown(prompt)
                
                with st.chat_message("assistant"):
                    with st.spinner("검색 및 답변 생성 중..."):
                        q_data = normalize_query(prompt)
                        hits = score_pages_hybrid(q_data, st.session_state.loaded_docs)
                        if not hits: ans = "관련 내용을 찾을 수 없습니다."
                        else:
                            ans = generate_answer_claude(prompt, hits, "전문가") if llm_choice == "Claude" else generate_answer_gemini(prompt, hits, "전문가")
                        st.markdown(ans)
                        st.session_state.messages.append({"role": "assistant", "content": ans, "context_pages": hits})
                        st.rerun()

    with cite_col:
        st.subheader("📚 인용 및 출처")
        last_msg = next((m for m in reversed(st.session_state.messages) if m["role"] == "assistant"), None)
        if last_msg and "context_pages" in last_msg and last_msg["context_pages"]:
            for i, p in enumerate(last_msg["context_pages"]):
                st.markdown(f"""
                <div class="citation-card">
                    <b>[{i+1}] {p['doc_title'][:20]}... (p.{p['page_num']})</b><br>
                    <span style="color:#666; font-style:italic;">"{p['text'][:200]}..."</span>
                </div>
                """, unsafe_allow_html=True)
        else:
            st.caption("질문에 대한 답변의 근거가 이곳에 표시됩니다.")

if __name__ == "__main__": main()

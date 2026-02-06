import os
print("DEBUG: SCRIPT STARTED")
import time
import subprocess
import google.auth
from google.auth.transport.requests import Request
from google.cloud import dialogflowcx_v3beta1 as dialogflow
from google.api_core.client_options import ClientOptions

# Configuration for Agent Builder (Dialogflow CX backed)
PROJECT_ID = "gen-lang-client-0478396215"
LOCATION = "global"
AGENT_ID = "67cf465c-5b2e-4542-ae41-00ad465684d9" 

# Directory Configuration (Based on PRD)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = os.path.join(BASE_DIR, "translate_input")
OUTPUT_DIR = os.path.join(BASE_DIR, "translate_output")

# Standardized Prompt (Strict Format per PRD)
def get_unified_prompt(source_text, target_lang="auto"):
    return f"""
You are a top-tier simultaneous interpreter (International Conference level).
Your task is to rewrite/translate the following text into {{target_lang}} with an **"Announcer/Speech Style" (아나운서/연설문 톤)**.

## STRICT OUTPUT FORMAT
You must split the input text into small segments (approx. 2-3 sentences max) and output them in the following repeating structure:

### [Segment]
**Source:**
(Original text - 2~3 lines)

**Target:**
(Translated text - Announcer/Speech tone)

**Glossary:**
| Term | Meaning | Nuance/Usage |
| :--- | :--- | :--- |
| (Term) | (Def) | (Why this word was chosen) |
... (Repeat for next segment)

## CONSTRAINTS
- **Tone**: Professional, rhythmical, suitable for broadcasting or public speaking. Avoid "Translationese" (직역투).
- **Structure**: interleaving Source and Target is CRITICAL. Do not output all source then all target.
- **Accuracy**: Do not skip any sentences.
- **Language**: If input is Korean, translate to English. If English, translate to Korean (unless specified).

## INPUT TEXT
{source_text}
    """

# Removed manual get_access_token function

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def save_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def init_client():
    api_endpoint = "dialogflow.googleapis.com"
    if LOCATION != "global":
        api_endpoint = f"{LOCATION}-dialogflow.googleapis.com"
        
    client_options = ClientOptions(api_endpoint=api_endpoint)
    
    # Use Application Default Credentials
    creds, project = google.auth.default()
    if not project or project != PROJECT_ID:
        print(f"⚠️ ADC Project ID ({project}) differs from Config ({PROJECT_ID}), ensuring quotas set correctly.")
    
    return dialogflow.SessionsClient(client_options=client_options, credentials=creds)

def translate_with_agent(text, client, session_path):
    # Detect Language (Simple Heuristic for Prompt Injection)
    # Note: In a real scenario, we might pass 'ko' or 'en' explicitly.
    # For this prompt, let's assume 'auto' is handled by the LLM or we infer it.
    is_korean = any(ord('가') <= ord(c) <= ord('힣') for c in text[:100])
    target_lang = "English" if is_korean else "Korean"
    
    prompt_content = get_unified_prompt(text, target_lang)
    
    text_input = dialogflow.TextInput(text=prompt_content)
    query_input = dialogflow.QueryInput(text=text_input, language_code="en")
    
    request = dialogflow.DetectIntentRequest(
        session=session_path,
        query_input=query_input,
    )
    
    try:
        response = client.detect_intent(request=request)
        messages = response.query_result.response_messages
        full_text = ""
        for msg in messages:
            if msg.text:
                full_text += "".join(msg.text.text) + "\n"
        
        return full_text.strip()
    except Exception as e:
        return f"Agent Error: {e}"

def chunk_text(text, max_chars=2000):
    chunks = []
    current_chunk = ""
    lines = text.split('\n')
    
    for line in lines:
        if len(current_chunk) + len(line) + 1 > max_chars:
            chunks.append(current_chunk)
            current_chunk = line + "\n"
        else:
            current_chunk += line + "\n"
            
    if current_chunk:
        chunks.append(current_chunk)
        
    return chunks


def translate_full_text(source_text, target_lang="auto"):
    """
    Splits text into chunks and processes them in parallel using Dialogflow CX.
    Returns the assembled text.
    """
    from concurrent.futures import ThreadPoolExecutor, as_completed
    
    client = init_client()
    chunks = chunk_text(source_text)
    print(f"📦 Split into {len(chunks)} chunks.")
    
    translations = [""] * len(chunks)
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        future_to_index = {}
        for i, chunk in enumerate(chunks):
            session_id = f"trans-sess-{int(time.time())}-{i}"
            session_path = client.session_path(
                project=PROJECT_ID,
                location=LOCATION,
                agent=AGENT_ID,
                session=session_id
            )
            future = executor.submit(translate_with_agent, chunk, client, session_path)
            future_to_index[future] = i
            
        for future in as_completed(future_to_index):
            idx = future_to_index[future]
            try:
                result = future.result()
                translations[idx] = result + "\n\n"
            except Exception as exc:
                print(f"   ❌ Exception in chunk {idx+1}: {exc}")
                translations[idx] = f"\n[ERROR CHUNK {idx+1}]\n"

    return "".join(translations)

def main():
    if not os.path.exists(INPUT_DIR):
        print(f"DTOO created input dir: {INPUT_DIR}")
        os.makedirs(INPUT_DIR)
        
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    print(f"🚀 [Dialogflow Engine] Starting Translation Mission")
    print(f"📂 Input: {INPUT_DIR}")
    print(f"📂 Output: {OUTPUT_DIR}")
    
    # Scan Directory
    files = [f for f in os.listdir(INPUT_DIR) if f.endswith(".md") or f.endswith(".txt")]
    
    if not files:
        print("⚠️ No .md or .txt files found in input directory.")
        return

    for filename in files:
        file_path = os.path.join(INPUT_DIR, filename)
        print(f"\nPROCESSING: {filename}...")
        
        source_text = read_file(file_path)
        
        final_translation = translate_full_text(source_text)
        
        output_filename = f"Translated_{filename}"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        save_file(output_path, full_translated_text)
        
        print(f"✅ Saved to: {output_filename}")

    print("\n🎉 All tasks completed.")

if __name__ == "__main__":
    main()
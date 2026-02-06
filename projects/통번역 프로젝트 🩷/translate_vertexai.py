import os
import vertexai
import google.auth
from vertexai.generative_models import GenerativeModel, SafetySetting

# Directory Configuration (Same as Dialogflow Script)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = os.path.join(BASE_DIR, "translate_input")
OUTPUT_DIR = os.path.join(BASE_DIR, "translate_output")

# Standardized Prompt (Strict Format per PRD) -- Identical Copy
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

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def save_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def run_translation():
    print("🚀 [Vertex AI Engine] Starting Translation Mission")
    print(f"📂 Input: {INPUT_DIR}")
    print(f"📂 Output: {OUTPUT_DIR}")

    # 1. Environment & Auth
    creds, project = google.auth.default()
    if not project:
        project = "gen-lang-client-0478396215" # Fallback
        
    print(f"🔑 Authenticated as Project: {project}")
        
    location = "us-central1"
    vertexai.init(project=project, location=location, credentials=creds)
    
    # 2. Model Selection
    model_name = "gemini-1.5-pro-001"
    model = GenerativeModel(model_name)
    
    # 3. Scan & Process
    if not os.path.exists(INPUT_DIR):
        print(f"Making input dir: {INPUT_DIR}")
        os.makedirs(INPUT_DIR)
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    files = [f for f in os.listdir(INPUT_DIR) if f.endswith(".md") or f.endswith(".txt")]
    
    if not files:
        print("⚠️ No input files found.")
        return

    for filename in files:
        print(f"\nPROCESSING: {filename}...")
        file_path = os.path.join(INPUT_DIR, filename)
        source_text = read_file(file_path)
        
        # Determine strict language or auto
        is_korean = any(ord('가') <= ord(c) <= ord('힣') for c in source_text[:100])
        target_lang = "English" if is_korean else "Korean"
        
        prompt = get_unified_prompt(source_text, target_lang)
        
        try:
            # Vertex AI Generation
            response = model.generate_content(
                prompt,
                generation_config={"temperature": 0.3}, # Low temp for translation accuracy
            )
            
            result_text = response.text
            
            output_filename = f"Translated_{filename}"
            output_path = os.path.join(OUTPUT_DIR, output_filename)
            save_file(output_path, result_text)
            print(f"✅ Saved to: {output_filename}")
            
        except Exception as e:
            print(f"❌ Error generating content: {e}")

    print("\n🎉 All tasks completed.")

if __name__ == "__main__":
    run_translation()
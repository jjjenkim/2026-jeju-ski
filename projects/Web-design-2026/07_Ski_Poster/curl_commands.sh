#!/bin/bash

# Ensure we are in the script's directory
cd "$(dirname "$0")"

# Configuration
PROJECT_ID="gen-lang-client-0478396215"
AGENT_ID="67cf465c-5b2e-4542-ae41-00ad465684d9"
LOCATION="global"
API_ENDPOINT="https://dialogflow.googleapis.com/v3/projects/${PROJECT_ID}/locations/${LOCATION}/agents/${AGENT_ID}/sessions"

# Authentication Setup
export CLOUDSDK_PYTHON=/usr/bin/python3
# Workaround for read-only filesystem permissions if needed
export CLOUDSDK_CONFIG="/tmp/gcloud_config_poster_$(date +%s)"
mkdir -p "$CLOUDSDK_CONFIG"
cp -R "$HOME/.config/gcloud/"* "$CLOUDSDK_CONFIG/" 2>/dev/null || true

# Helper function to get access token
get_token() {
    # Ensure absolute path to gcloud is used or rely on PATH if configured, 
    # but based on history, absolute path is safer.
    if [ -f "/Users/jenkim/Downloads/2026_Antigravity/google-cloud-sdk/bin/gcloud" ]; then
        /Users/jenkim/Downloads/2026_Antigravity/google-cloud-sdk/bin/gcloud auth print-access-token
    else
        gcloud auth print-access-token
    fi
}

# Python script for HTML extraction (embedded)
cat <<'EOF' > extract_temp.py
import json
import re
import sys

def extract(json_file, output_file):
    try:
        with open(json_file, 'r') as f:
            data = json.load(f)
        
        # Try to find text in standard Dialogflow response
        try:
            text = data['queryResult']['responseMessages'][0]['text']['text'][0]
        except:
             print(f"No standard text found in {json_file}")
             print(json.dumps(data, indent=2))
             return False

        # Extract markdown block
        match = re.search(r'```(?:html)?\s*(.*?)```', text, re.DOTALL)
        if match:
            content = match.group(1).strip()
        else:
            # Try to find start if truncated
            match_start = re.search(r'```(?:html)?\s*', text)
            if match_start:
                content = text[match_start.end():].strip()
            else:
                # Use entire text if no code blocks found
                content = text.strip()
        
        with open(output_file, 'w') as f:
            f.write(content)
        return True

    except Exception as e:
        print(f"Error extracting from {json_file}: {e}")
        # Print data for debug
        try:
            print(json.dumps(data, indent=2))
        except:
            pass
        return False

if __name__ == "__main__":
    extract(sys.argv[1], sys.argv[2])
EOF

# Function to generate poster
generate_poster() {
    local concept_name="$1"
    local session_id="poster-session-${concept_name}-$(date +%s)"
    local prompt="$2"
    local output_html="${concept_name}.html"
    local temp_json="${concept_name}_response.json"

    echo "🎨 Generating ${concept_name}..."

    # Create payload safely using jq to handle escaping
    jq -n --arg text "$prompt" '{queryInput: {text: {text: $text}, languageCode: "en"}}' > "${concept_name}_req.json"

    curl -s -X POST "${API_ENDPOINT}/${session_id}:detectIntent" \
      -H "Authorization: Bearer $(get_token)" \
      -H "x-goog-user-project: ${PROJECT_ID}" \
      -H "Content-Type: application/json" \
      -d @"${concept_name}_req.json" > "$temp_json"

    # Extract HTML
    /usr/bin/python3 extract_temp.py "$temp_json" "$output_html"
    
    # Simple check for completeness (basic heuristic)
    if grep -q "</html>" "$output_html"; then
        echo "✅ ${concept_name} generated successfully!"
        rm -f "${concept_name}_req.json" "$temp_json"
    else
        echo "⚠️ ${concept_name} seems truncated. Attempting to continue..."
        local temp_json_part2="${concept_name}_part2.json"
        local output_html_part2="${concept_name}_part2.html"
        
        # Payload for continuation
        jq -n --arg text "Continue exactly where you left off. Output ONLY the remaining HTML code." '{queryInput: {text: {text: $text}, languageCode: "en"}}' > "${concept_name}_req_part2.json"

        curl -s -X POST "${API_ENDPOINT}/${session_id}:detectIntent" \
          -H "Authorization: Bearer $(get_token)" \
          -H "x-goog-user-project: ${PROJECT_ID}" \
          -H "Content-Type: application/json" \
          -d @"${concept_name}_req_part2.json" > "$temp_json_part2"
          
          /usr/bin/python3 extract_temp.py "$temp_json_part2" "$output_html_part2"
          cat "$output_html_part2" >> "$output_html"
          echo "✅ ${concept_name} completed."
          rm -f "$temp_json_part2" "$output_html_part2" "${concept_name}_req_part2.json" "${concept_name}_req.json" "$temp_json"
    fi
}

# --- Execution ---

# Concept 1: Snowflake Party
PROMPT_1="Create a complete HTML file for a vertical web poster (1080x1920px) for \"2026 Jeju Ski Association Competition\". \n\nDesign Concept: \"Snowflake Party\" - Bright and cheerful winter festival.\n\nRequirements:\n- Vertical layout (9:16 ratio)\n- Animated snowflakes falling across the screen\n- Skiing character moving in zigzag pattern\n- Competition info in snowflake-shaped cards\n\nColor Palette:\n- Primary: #FF6B9D (Pink)\n- Secondary: #00D9FF (Cyan)\n- Accent: #FFE66D (Yellow)\n- Background: #F0F4FF (Light Blue)\n\nTypography:\n- English headline: 'Fredoka One' from Google Fonts\n- Korean headline: 'Black Han Sans' from Google Fonts\n- Body: 'Poppins' and 'Noto Sans KR'\n\nContent to include:\n- Title: \"2026 제주스키협회 스키대회\"\n- Date: \"2026년 2월 27일 금요일\"\n- Events: \"모글 / 알파인 (대회전)\"\n- Slopes: \"핑크 / 메가그린\"\n\nAnimations:\n- Snowflakes falling continuously\n- Skier character sliding left-right\n- Text bouncing on hover\n- Smooth transitions\n\nOutput: Complete, self-contained HTML file with embedded CSS and JavaScript. DO NOT use markdown. START directly with <!DOCTYPE html>."
generate_poster "concept1" "$PROMPT_1"

# Concept 2: Retro Ski Club
PROMPT_2="Create a complete HTML file for a vertical web poster (1080x1920px) for \"2026 Jeju Ski Association Competition\". \n\nDesign Concept: \"Retro Ski Club\" - 80s arcade game style.\n\nRequirements:\n- Vertical layout (9:16 ratio)\n- Pixel art aesthetics\n- Neon grid background\n- Badge/Sticker style elements\n- 8-bit style animations\n\nColor Palette:\n- Primary: #FF00FF (Magenta)\n- Secondary: #00FFFF (Cyan)\n- Accent: #FFFF00 (Neon Yellow)\n- Background: #1a1a2e (Deep Dark Blue)\n\nTypography:\n- English headline: 'Press Start 2P' (Google Fonts)\n- Korean headline: 'Black Han Sans' (Google Fonts)\n\nContent to include:\n- Title: \"2026 제주스키협회 스키대회\"\n- Date: \"2026-02-27\"\n- Subtitle: \"RETRO SKI CLUB\"\n\nAnimations:\n- Blink/Flash effects\n- Marquee scrolling text\n- 3D flip effect on badges\n\nOutput: Complete, self-contained HTML file with embedded CSS and JavaScript. DO NOT use markdown. START directly with <!DOCTYPE html>."
generate_poster "concept2" "$PROMPT_2"

# Concept 3: Neon Future
PROMPT_3="Create a complete HTML file for a vertical web poster (1080x1920px) for \"2026 Jeju Ski Association Competition\". \n\nDesign Concept: \"Cyber Slope\" - Futuristic ski game aesthetic.\n\nRequirements:\n- Vertical layout (9:16 ratio)\n- Neon lines forming slope design\n- Glitch effect on title text\n- Digital countdown timer effect\n\nColor Palette:\n- Primary: #2CFF05 (Neon Green)\n- Secondary: #FF1493 (Neon Pink)\n- Accent: #00CAFF (Neon Blue)\n- Background: #000000 (Black)\n\nTypography:\n- English headline: 'Orbitron' (Google Fonts)\n- Korean headline: 'Black Han Sans' (Google Fonts)\n\nContent to include:\n- Title: \"2026 제주스키협회 스키대회\"\n- Date: \"2026년 2월 27일 금요일\"\n- Events: \"모글 / 알파인 (대회전)\"\n\nAnimations:\n- Neon glow pulse effect\n- Glitch animation on title\n- Cyber grid background animation\n\nOutput: Complete, self-contained HTML file with embedded CSS and JavaScript. DO NOT use markdown. START directly with <!DOCTYPE html>."
generate_poster "concept3" "$PROMPT_3"

# Cleanup
rm -f extract_temp.py
rm -rf "$CLOUDSDK_CONFIG"

echo "🎉 All posters generated successfully."
ls -l concept*.html

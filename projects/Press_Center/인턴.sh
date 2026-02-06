#!/bin/bash

# Gemini CLI Agent: 인턴
# Purpose: Korean Translationese Removal & Broadcast Rewrite

PROMPT_FILE="master_prompt_translationese.md"

echo "🤖 Starting Gemini CLI Agent: 인턴"
echo "📝 Loading master prompt from: $PROMPT_FILE"
echo ""

# Read the prompt file
MASTER_PROMPT=$(cat "$PROMPT_FILE")

# Launch Gemini CLI in interactive mode with the master prompt
GEMINI_API_KEY=AIzaSyAaNAfLsf5AzNV2aRQBIfOWkHpv-mpfDCI npx -y @google/gemini-cli -i "당신의 이름은 '인턴'입니다. 

다음은 당신이 따라야 할 MASTER PROMPT입니다:

$MASTER_PROMPT

이제 준비되었습니다. 번역투 제거 및 방송용 리라이팅 작업을 시작하세요."

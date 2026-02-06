#!/bin/bash
cd "$(dirname "$0")"

# Enter the V6 project directory
cd V6

clear
echo "================================================"
echo "   🇰🇷 TEAM KOREA: V6 PREMIUM DASHBOARD"
echo "================================================"

# 1. Check Node.js
if ! command -v npm &> /dev/null; then
    echo "❌ Error: Node.js (npm) not found."
    read -p "Press any key to exit..."
    exit 1
fi

# 2. Dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installing V6 dependencies..."
  npm install
fi

# 3. Port Cleanup (Default Vite port)
echo "🧹 Cleaning up port 5173..."
lsof -ti:5173 | xargs kill -9 2>/dev/null

echo "------------------------------------------------"
echo "🚀 Starting V6 Dashboard on http://localhost:5173"
echo "🌐 Opening Google Chrome..."
echo "------------------------------------------------"

# 4. Open Google Chrome Specifically
(sleep 3 && open -a "Google Chrome" "http://localhost:5173") &

# 5. Start Server
npm run dev

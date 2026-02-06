#!/bin/bash

# 브라우저에서 URL 열기
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$1"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "$1"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    start "$1"
fi

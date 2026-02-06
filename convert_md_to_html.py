#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
마크다운을 깔끔한 HTML로 변환하는 스크립트
Word에서 열 수 있는 형식으로 출력
"""

import re
import sys

def convert_markdown_to_html(md_file, html_file):
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # HTML 시작
    html = '''<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>직무수행계획서</title>
    <style>
        body {
            font-family: "맑은 고딕", "Malgun Gothic", sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            font-size: 24px;
            font-weight: bold;
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        h2 {
            font-size: 20px;
            font-weight: bold;
            margin-top: 25px;
            margin-bottom: 12px;
            color: #2c3e50;
        }
        h3 {
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
            color: #34495e;
        }
        h4 {
            font-size: 16px;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 8px;
        }
        p {
            margin: 10px 0;
        }
        ul, ol {
            margin: 10px 0;
            padding-left: 30px;
        }
        li {
            margin: 5px 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        strong {
            font-weight: bold;
        }
        em {
            font-style: italic;
        }
        hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 30px 0;
        }
    </style>
</head>
<body>
'''
    
    # 마크다운 변환
    lines = content.split('\n')
    in_table = False
    table_html = []
    
    for line in lines:
        # 빈 줄
        if not line.strip():
            if in_table:
                html += '\n'.join(table_html) + '</table>\n'
                table_html = []
                in_table = False
            html += '<p></p>\n'
            continue
        
        # 구분선
        if line.strip() == '---':
            html += '<hr>\n'
            continue
        
        # 제목
        if line.startswith('# '):
            html += f'<h1>{line[2:]}</h1>\n'
        elif line.startswith('## '):
            html += f'<h2>{line[3:]}</h2>\n'
        elif line.startswith('### '):
            html += f'<h3>{line[4:]}</h3>\n'
        elif line.startswith('#### '):
            html += f'<h4>{line[5:]}</h4>\n'
        
        # 표
        elif '|' in line:
            if not in_table:
                table_html = ['<table>']
                in_table = True
            
            # 헤더 구분선 무시
            if re.match(r'^\|[\s\-:]+\|', line):
                continue
            
            cells = [cell.strip() for cell in line.split('|')[1:-1]]
            
            # 첫 번째 행은 헤더
            if len(table_html) == 1:
                row = '<tr>' + ''.join([f'<th>{cell}</th>' for cell in cells]) + '</tr>'
            else:
                # 볼드 처리
                cells = [re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', cell) for cell in cells]
                # 줄바꿈 처리
                cells = [cell.replace('<br>', '<br>').replace('•', '•') for cell in cells]
                row = '<tr>' + ''.join([f'<td>{cell}</td>' for cell in cells]) + '</tr>'
            
            table_html.append(row)
        
        # 리스트
        elif line.startswith('- '):
            text = line[2:]
            # 볼드 처리
            text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
            html += f'<li>{text}</li>\n'
        
        # 일반 텍스트
        else:
            text = line
            # 볼드 처리
            text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
            html += f'<p>{text}</p>\n'
    
    # 마지막 표 처리
    if in_table:
        html += '\n'.join(table_html) + '</table>\n'
    
    # HTML 종료
    html += '''
</body>
</html>'''
    
    # 파일 저장
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✅ 변환 완료: {html_file}")
    print(f"📝 Word에서 이 파일을 열어서 .docx로 저장하세요!")

if __name__ == "__main__":
    md_file = "/Users/jenkim/Library/Mobile Documents/iCloud~md~obsidian/Documents/Mac book 옵시디언/🤍 그라비티_볼트/직무수행서_자기소개서_2026.02.01(일)/아웃풋/최종_2027_충청권_직무수행계획서_김현정_국제협력.md"
    html_file = "/Users/jenkim/Library/Mobile Documents/iCloud~md~obsidian/Documents/Mac book 옵시디언/🤍 그라비티_볼트/직무수행서_자기소개서_2026.02.01(일)/아웃풋/직무수행계획서_김현정_국제협력.html"
    
    convert_markdown_to_html(md_file, html_file)

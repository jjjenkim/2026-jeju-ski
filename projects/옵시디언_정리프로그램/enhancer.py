#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Obsidian Vault Organizer - Enhancement Patch
기존 리포트에 연결 강화, MOC, 관계 시각화, 스마트 필터 추가
"""

import json
from pathlib import Path
from datetime import datetime
from collections import Counter
import re

class ReportEnhancer:
    def __init__(self, output_path):
        self.output_path = Path(output_path)
        self.snapshot = self.load_latest_snapshot()
        self.files_data = self.snapshot['files']
        
    def load_latest_snapshot(self):
        """최신 스냅샷 로드"""
        history_dir = self.output_path / "history"
        snapshots = list(history_dir.glob("snapshot_*.json"))
        if not snapshots:
            print("⚠️  스냅샷 파일이 없습니다. main.py가 먼저 실행되었는지 확인하세요.")
            return {'files': []}
        latest = max(snapshots, key=lambda x: x.stat().st_mtime)
        
        with open(latest, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def add_navigation_links(self):
        """모든 리포트 상단에 내비게이션 추가"""
        nav = """---
**📍 Quick Nav:** [[00_Master_Index|🏠 Home]] | [[01_Categories|📂 Categories]] | [[02_Tags_System|🏷️ Tags]] | [[03_Action_Queue|🔧 Actions]] | [[04_Statistics|📊 Stats]] | [[05_Smart_Filters|⚡ Filters]] | [[06_Frequent_Phrases|💬 Phrases]]
---

"""
        
        for report in ['00_Master_Index.md', '01_Categories.md', '02_Tags_System.md', 
                       '03_Action_Queue.md', '04_Statistics.md']:
            file_path = self.output_path / report
            if file_path.exists():
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 기존 nav 제거 후 새로 추가
                if '**📍 Quick Nav:**' in content:
                    content = re.sub(r'---\n\*\*📍 Quick Nav:.*?---\n\n', '', content, flags=re.DOTALL)
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(nav + content)
        
        print("✓ 내비게이션 링크 추가 완료")
    
    def create_moc_structure(self):
        """주제별 MOC (Map of Content) 생성"""
        output = []
        output.append("# 🗺️ Map of Contents - 주제별 허브\n")
        output.append("## 🏔️ 겨울 스포츠 허브\n")
        
        sports_files = [f for f in self.files_data if f['category'] == 'Winter Sports']
        if sports_files:
            # FIS 관련
            fis_files = [f for f in sports_files if 'fis' in f['title'].lower() or 'mogul' in f['title'].lower()]
            output.append("### FIS & Moguls Coverage\n")
            for f in sorted(fis_files, key=lambda x: x['word_count'], reverse=True)[:10]:
                output.append(f"- [[{f['title']}]] ({f['word_count']} words)")
            
            # UPSHOT 관련
            upshot_files = [f for f in sports_files if 'upshot' in f['title'].lower()]
            if upshot_files:
                output.append("\n### UPSHOT Newsletter Archive\n")
                for f in sorted(upshot_files, key=lambda x: x['last_modified'], reverse=True):
                    output.append(f"- [[{f['title']}]] - {f['last_modified']}")
        
        output.append("\n## 🗣️ 통역 & 언어 학습 허브\n")
        lang_files = [f for f in self.files_data if f['category'] == 'Language & Interpretation']
        if lang_files:
            # 표현 관련
            expr_files = [f for f in lang_files if '표현' in f['title']]
            if expr_files:
                output.append("### 표현 데이터베이스\n")
                for f in expr_files:
                    output.append(f"- [[{f['title']}]] ({f['word_count']} words)")
            
            # 통대 관련
            tugs_files = [f for f in lang_files if '통대' in f['title'] or '통역' in f['title']]
            if tugs_files:
                output.append("\n### 통대 준비 & 통역 노트\n")
                for f in sorted(tugs_files, key=lambda x: x['word_count'], reverse=True)[:10]:
                    output.append(f"- [[{f['title']}]] ({f['word_count']} words)")
        
        output.append("\n## 🤖 AI & Tools 허브\n")
        ai_files = [f for f in self.files_data if f['category'] == 'AI & Tools']
        if ai_files:
            for f in sorted(ai_files, key=lambda x: x['word_count'], reverse=True)[:10]:
                output.append(f"- [[{f['title']}]] ({f['word_count']} words)")
        
        output.append("\n## 📰 미디어 & 뉴스레터 허브\n")
        media_files = [f for f in self.files_data if f['category'] == 'Media & Newsletter']
        if media_files:
            for f in sorted(media_files, key=lambda x: x['last_modified'], reverse=True):
                output.append(f"- [[{f['title']}]] - {f['last_modified']}")
        
        self.save_file("07_MOC_Hub.md", '\n'.join(output))
    
    def create_relationship_diagram(self):
        """관계 시각화 다이어그램 생성"""
        output = []
        output.append("# 🔗 문서 관계 시각화\n")
        
        if not self.files_data:
            output.append("⚠️ 분석할 문서가 없습니다.\n")
            self.save_file("08_Relationship_Map.md", '\n'.join(output))
            return
        
        # 통계 정보
        total_files = len(self.files_data)
        total_links = sum(f['links_out'] for f in self.files_data)
        output.append(f"**총 문서 수**: {total_files} | **총 링크 수**: {total_links}\n")
        
        # 1. 링크가 많은 허브 문서들 (incoming links 기준)
        output.append("## 📊 주요 허브 문서 (Incoming Links)\n")
        hubs_by_incoming = sorted(self.files_data, key=lambda x: x['links_in'], reverse=True)[:10]
        
        if hubs_by_incoming and hubs_by_incoming[0]['links_in'] > 0:
            for i, hub in enumerate(hubs_by_incoming, 1):
                output.append(f"{i}. **[[{hub['title']}]]** - {hub['links_in']} 개 문서에서 참조됨")
        else:
            output.append("*현재 incoming links가 있는 문서가 없습니다.*\n")
        
        # 2. 링크를 많이 하는 문서들 (outgoing links 기준)
        output.append("\n## 🔗 연결이 많은 문서 (Outgoing Links)\n")
        hubs_by_outgoing = sorted(self.files_data, key=lambda x: x['links_out'], reverse=True)[:10]
        
        if hubs_by_outgoing and hubs_by_outgoing[0]['links_out'] > 0:
            for i, hub in enumerate(hubs_by_outgoing, 1):
                output.append(f"{i}. **[[{hub['title']}]]** - {hub['links_out']} 개 문서로 링크")
        else:
            output.append("*현재 outgoing links가 있는 문서가 없습니다.*\n")
        
        # 3. 실제 데이터 기반 관계도 생성
        output.append("\n## 🗺️ 문서 연결 다이어그램\n")
        
        # 상위 5개 허브 문서의 실제 연결 관계 시각화
        top_hubs = sorted(self.files_data, key=lambda x: x['links_out'], reverse=True)[:5]
        
        if top_hubs and top_hubs[0]['links_out'] > 0:
            output.append("```mermaid")
            output.append("graph TD")
            
            # 노드 ID를 안전하게 생성하기 위한 함수
            def safe_id(text, prefix="N"):
                # 특수문자 제거 및 공백을 언더스코어로
                safe = re.sub(r'[^a-zA-Z0-9가-힣]', '', text)
                return f"{prefix}_{safe[:15]}"
            
            # 각 허브 문서와 그 연결들
            for i, hub in enumerate(top_hubs, 1):
                hub_id = safe_id(hub['title'], f"Hub{i}")
                hub_label = hub['title'][:30].replace('"', "'")
                
                output.append(f'    {hub_id}["{hub_label}"]')
                
                # 이 문서가 링크하는 문서들 (최대 5개)
                for j, link in enumerate(hub['links_out_list'][:5], 1):
                    # 링크 텍스트 정리 (파이프 기호로 분리된 경우 첫 부분만 사용)
                    link_text = link.split('|')[0][:25].replace('"', "'")
                    link_id = safe_id(link_text, f"L{i}_{j}")
                    
                    output.append(f'    {hub_id} --> {link_id}["{link_text}"]')
            
            output.append("```\n")
        else:
            output.append("*현재 링크 관계를 시각화할 데이터가 충분하지 않습니다.*\n")
        
        # 4. 카테고리별 문서 분포
        output.append("## 📂 카테고리별 문서 분포\n")
        
        category_counts = Counter(f['category'] for f in self.files_data)
        
        if category_counts:
            output.append("```mermaid")
            output.append("pie title 카테고리별 문서 분포")
            for category, count in category_counts.most_common():
                safe_category = category.replace('"', "'")
                output.append(f'    "{safe_category}" : {count}')
            output.append("```\n")
        
        # 5. 카테고리 간 연결 구조 (실제 데이터 기반)
        output.append("## 🌐 카테고리 간 연결 구조\n")
        
        # 각 카테고리에서 가장 활발한 문서 찾기
        category_hubs = {}
        for category in category_counts.keys():
            cat_files = [f for f in self.files_data if f['category'] == category]
            if cat_files:
                top_file = max(cat_files, key=lambda x: x['links_out'])
                if top_file['links_out'] > 0:
                    category_hubs[category] = top_file
        
        if category_hubs:
            output.append("```mermaid")
            output.append("graph LR")
            
            for i, (category, hub) in enumerate(category_hubs.items(), 1):
                cat_id = safe_id(category, "Cat")
                cat_label = category[:20].replace('"', "'")
                output.append(f'    {cat_id}["{cat_label}<br/>{hub["links_out"]} links"]')
            
            output.append("```\n")
        else:
            output.append("*카테고리 간 연결 구조를 시각화할 데이터가 충분하지 않습니다.*\n")
        
        # 6. 상세 링크 목록 (디버깅용)
        output.append("## 📋 상세 링크 분석\n")
        for i, hub in enumerate(hubs_by_outgoing[:3], 1):
            output.append(f"\n### {i}. [[{hub['title']}]]\n")
            output.append(f"- **카테고리**: {hub['category']}")
            output.append(f"- **단어 수**: {hub['word_count']}")
            output.append(f"- **Outgoing Links**: {hub['links_out']}")
            output.append(f"- **Incoming Links**: {hub['links_in']}")
            output.append(f"- **최종 수정**: {hub['last_modified']}\n")
            
            if hub['links_out_list']:
                output.append("**링크 목록** (처음 10개):")
                for link in hub['links_out_list'][:10]:
                    link_display = link.split('|')[0][:50]
                    output.append(f"  - {link_display}")
                if len(hub['links_out_list']) > 10:
                    output.append(f"  - ... 외 {len(hub['links_out_list']) - 10}개")
        
        self.save_file("08_Relationship_Map.md", '\n'.join(output))
    
    def create_smart_filters(self):
        """스마트 필터링 - 다양한 기준으로 문서 분류"""
        output = []
        output.append("# ⚡ Smart Filters - 스마트 문서 필터\n")
        
        # 1. 워드 카운트 기준
        output.append("## 📏 워드 카운트별 분류\n")
        
        output.append("### 🔥 Long Form (2000+ words)\n")
        long_docs = [f for f in self.files_data if f['word_count'] >= 2000]
        for f in sorted(long_docs, key=lambda x: x['word_count'], reverse=True)[:15]:
            output.append(f"- [[{f['title']}]] - {f['word_count']} words")
        
        output.append("\n### 📝 Medium (500-2000 words)\n")
        medium_docs = [f for f in self.files_data if 500 <= f['word_count'] < 2000]
        for f in sorted(medium_docs, key=lambda x: x['word_count'], reverse=True)[:15]:
            output.append(f"- [[{f['title']}]] - {f['word_count']} words")
        
        output.append("\n### 💡 Short Notes (100-500 words)\n")
        short_docs = [f for f in self.files_data if 100 <= f['word_count'] < 500]
        for f in sorted(short_docs, key=lambda x: x['word_count'], reverse=True)[:15]:
            output.append(f"- [[{f['title']}]] - {f['word_count']} words")
        
        output.append("\n### ⚠️ Stub (10-100 words) - 확장 필요\n")
        stub_docs = [f for f in self.files_data if 10 <= f['word_count'] < 100]
        for f in sorted(stub_docs, key=lambda x: x['word_count'], reverse=True)[:20]:
            output.append(f"- [ ] [[{f['title']}]] - {f['word_count']} words")
        
        # 2. 최근 활동 기준
        output.append("\n## 📅 최근 활동 기준\n")
        output.append("### 🔥 이번 달 작업 (최근 30일)\n")
        recent = sorted(self.files_data, key=lambda x: x['last_modified'], reverse=True)[:20]
        for f in recent:
            output.append(f"- [[{f['title']}]] - {f['last_modified']} ({f['word_count']} words)")
        
        # 3. 완성도 기준
        output.append("\n## ✅ 완성도 기준\n")
        output.append("### 🌟 High Quality (500+ words, 2+ links)\n")
        quality = [f for f in self.files_data 
                   if f['word_count'] >= 500 and f['links_out'] >= 2]
        for f in sorted(quality, key=lambda x: x['word_count'], reverse=True)[:20]:
            output.append(f"- [[{f['title']}]] - {f['word_count']} words, {f['links_out']} links")
        
        output.append("\n### 🚧 Work in Progress (100-500 words, few links)\n")
        wip = [f for f in self.files_data 
               if 100 <= f['word_count'] < 500 and f['links_out'] < 2]
        for f in sorted(wip, key=lambda x: x['last_modified'], reverse=True)[:20]:
            output.append(f"- [ ] [[{f['title']}]] - {f['word_count']} words")
        
        self.save_file("05_Smart_Filters.md", '\n'.join(output))
    
    def create_frequent_phrases(self):
        """자주 쓰는 표현 분석 (태그 대신)"""
        output = []
        output.append("# 💬 자주 쓰는 표현 & 키워드 분석\n")
        
        # 모든 파일의 제목에서 단어 추출
        all_words = []
        for f in self.files_data:
            # 한글, 영어 단어만 추출
            words = re.findall(r'[가-힣]{2,}|[a-zA-Z]{3,}', f['title'])
            all_words.extend(words)
        
        # 불용어 제거
        stopwords = ['the', 'and', 'for', 'with', 'this', 'that', '있는', '하는', '되는', '있다', '한다']
        all_words = [w for w in all_words if w.lower() not in stopwords]
        
        word_counts = Counter(all_words)
        
        output.append("## 📊 자주 등장하는 키워드 TOP 30\n")
        for word, count in word_counts.most_common(30):
            # 해당 단어 포함 문서 찾기
            docs_with_word = [f for f in self.files_data if word in f['title']]
            output.append(f"### {word} ({count}회)\n")
            for doc in docs_with_word[:5]:
                output.append(f"- [[{doc['title']}]]")
            if len(docs_with_word) > 5:
                output.append(f"- ... 외 {len(docs_with_word)-5}개")
            output.append("")
        
        # 영어 표현 vs 한글 표현
        korean_words = [w for w in all_words if re.match(r'[가-힣]+', w)]
        english_words = [w for w in all_words if re.match(r'[a-zA-Z]+', w)]
        
        output.append("\n## 🇰🇷 한글 키워드 TOP 10\n")
        for word, count in Counter(korean_words).most_common(10):
            output.append(f"- **{word}**: {count}회")
        
        output.append("\n## 🇺🇸 영어 키워드 TOP 10\n")
        for word, count in Counter(english_words).most_common(10):
            output.append(f"- **{word}**: {count}회")
        
        self.save_file("06_Frequent_Phrases.md", '\n'.join(output))
    
    def save_file(self, filename, content):
        """파일 저장"""
        filepath = self.output_path / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ {filename} 생성")


def main():
    print("\n" + "="*60)
    print("🚀 Obsidian Vault Organizer - Enhancement Patch")
    print("="*60 + "\n")
    
    output_path = "/Users/jenkim/Library/Mobile Documents/iCloud~md~obsidian/Documents/Mac book 옵시디언/output"
    
    try:
        enhancer = ReportEnhancer(output_path)
        
        print("📝 고도화 기능 추가 중...\n")
        enhancer.add_navigation_links()
        enhancer.create_moc_structure()
        enhancer.create_relationship_diagram()
        enhancer.create_smart_filters()
        enhancer.create_frequent_phrases()
        
        print("\n" + "="*60)
        print("✅ 모든 고도화 완료!")
        print("="*60)
        print("새로 생성된 파일:")
        print("  - 05_Smart_Filters.md")
        print("  - 06_Frequent_Phrases.md")
        print("  - 07_MOC_Hub.md")
        print("  - 08_Relationship_Map.md")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n✗ 오류 발생: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()

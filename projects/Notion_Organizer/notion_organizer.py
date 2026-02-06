#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Notion to Obsidian Organizer
Notion 워크스페이스를 분석하여 Obsidian 볼트에 리포트 생성
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict, Counter
from notion_client import Client
import time

class NotionToObsidianOrganizer:
    def __init__(self, config_path="config.txt"):
        """설정 파일 로드 및 초기화"""
        self.config = self.load_config(config_path)
        self.notion = Client(auth=self.config['NOTION_TOKEN'])
        self.obsidian_vault = Path(self.config['OBSIDIAN_VAULT_PATH'])
        self.output_dir = self.obsidian_vault / "Notion_Index"
        self.output_dir.mkdir(exist_ok=True)
        self.snapshot_dir = Path("output")
        self.snapshot_dir.mkdir(exist_ok=True)
        self.pages_data = []
        
    def load_config(self, config_path):
        """config.txt 로드"""
        config = {}
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        config[key.strip()] = value.strip()
            
            # 필수 설정 확인
            if not config.get('NOTION_TOKEN'):
                raise Exception("NOTION_TOKEN이 설정되지 않았습니다")
            if not config.get('OBSIDIAN_VAULT_PATH'):
                raise Exception("OBSIDIAN_VAULT_PATH가 설정되지 않았습니다")
            
            return config
        except Exception as e:
            raise Exception(f"설정 파일 로드 실패: {e}")
    
    def search_all_pages(self):
        """워크스페이스의 모든 페이지 검색"""
        print("\n📂 Notion 페이지 스캔 중...")
        all_pages = []
        has_more = True
        start_cursor = None
        
        while has_more:
            try:
                response = self.notion.search(
                    filter={"property": "object", "value": "page"},
                    start_cursor=start_cursor,
                    page_size=100
                )
                
                all_pages.extend(response['results'])
                has_more = response['has_more']
                start_cursor = response.get('next_cursor')
                
                print(f"\r진행: {len(all_pages)}개 페이지 발견...", end="")
                time.sleep(0.3)  # API rate limit 방지
                
            except Exception as e:
                print(f"\n⚠️ 검색 중 오류: {e}")
                break
        
        print(f"\n✓ {len(all_pages)}개의 페이지 발견\n")
        return all_pages
    
    def extract_page_metadata(self, page):
        """페이지에서 메타데이터 추출"""
        try:
            page_id = page['id']
            
            # 제목 추출
            title = "Untitled"
            if 'properties' in page:
                title_prop = page['properties'].get('title') or page['properties'].get('Name')
                if title_prop and title_prop.get('title'):
                    title = ''.join([t['plain_text'] for t in title_prop['title']])
            
            # 생성/수정 날짜
            created_time = page.get('created_time', '')
            last_edited_time = page.get('last_edited_time', '')
            
            # 페이지 내용 가져오기 (블록 읽기)
            content_text = self.get_page_content(page_id)
            
            # 단어 수 계산
            word_count = len(content_text.split())
            
            # 태그 추출
            tags = self.extract_tags(page, content_text)
            
            # 링크 추출
            links = self.extract_links(content_text)
            
            # 카테고리 추정
            category = self.estimate_category(title, content_text, tags)
            
            # 신뢰도
            confidence = self.estimate_confidence(word_count, len(links))
            
            return {
                'id': page_id,
                'title': title,
                'category': category,
                'tags': tags,
                'word_count': word_count,
                'links_out': len(links),
                'links_out_list': links[:10],
                'confidence': confidence,
                'created_time': created_time[:10] if created_time else '',
                'last_edited_time': last_edited_time[:10] if last_edited_time else '',
                'url': page.get('url', '')
            }
        except Exception as e:
            return None
    
    def get_page_content(self, page_id):
        """페이지의 텍스트 내용 가져오기"""
        try:
            blocks = self.notion.blocks.children.list(page_id)
            content = []
            
            for block in blocks['results']:
                block_type = block['type']
                if block_type in ['paragraph', 'heading_1', 'heading_2', 'heading_3', 
                                 'bulleted_list_item', 'numbered_list_item', 'to_do', 'quote']:
                    text_content = block.get(block_type, {}).get('rich_text', [])
                    for text in text_content:
                        content.append(text.get('plain_text', ''))
            
            return ' '.join(content)
        except:
            return ""
    
    def extract_tags(self, page, content):
        """태그 추출"""
        tags = []
        
        # 속성에서 태그 추출
        if 'properties' in page:
            for prop_name, prop_value in page['properties'].items():
                if prop_value['type'] == 'multi_select':
                    tags.extend([tag['name'] for tag in prop_value.get('multi_select', [])])
        
        # 내용에서 #태그 추출
        hash_tags = re.findall(r'#(\w+)', content)
        tags.extend(hash_tags)
        
        return list(set(tags))[:5]
    
    def extract_links(self, content):
        """Notion 페이지 링크 추출"""
        links = re.findall(r'https://www\.notion\.so/[\w-]+', content)
        return list(set(links))
    
    def estimate_category(self, title, content, tags):
        """도메인 지식 기반 카테고리 추정"""
        title_lower = title.lower()
        content_lower = content[:1000].lower()
        tags_str = ' '.join(tags).lower()
        
        # 🤖 AI & Tools
        ai_keywords = ['gpt', 'chatgpt', 'claude', 'perplexity', 'ai', '프롬프트', 'prompt', 
                       'gemini', 'anthropic', 'llm', 'notebooklm', '자동화', 'automation']
        if any(word in title_lower or word in content_lower or word in tags_str 
               for word in ai_keywords):
            return 'AI & Tools'
        
        # 🗣️ 통역 & 언어
        interp_keywords = ['통역', '순차통역', '동시통역', 'interpretation', 'interpreter', 
                           '표현', '영어', 'english', '통대', '언어', '발음', '문법', 
                           'broca', 'note-taking', '메모리', '구술', '번역']
        if any(word in title_lower or word in content_lower or word in tags_str 
               for word in interp_keywords):
            return 'Language & Interpretation'
        
        # 🏔️ 스포츠
        sports_keywords = ['fis', 'mogul', 'freestyle', '스키', '스노보드', 'halfpipe', 
                           '올림픽', 'olympic', 'world cup', 'upshot', '선수', 'athlete',
                           '월드컵', '하프파이프', '모글']
        if any(word in title_lower or word in content_lower or word in tags_str 
               for word in sports_keywords):
            return 'Winter Sports'
        
        # 📰 미디어 & 뉴스레터
        media_keywords = ['뉴스레터', 'newsletter', '메일리', 'upshot', 'template', 
                          'seo', '콘텐츠', 'content', '발행', '구독', 'cover story']
        if any(word in title_lower or word in content_lower or word in tags_str 
               for word in media_keywords):
            return 'Media & Newsletter'
        
        # 🎓 학업 & 연구
        academic_keywords = ['논문', 'thesis', '연구', 'research', '학습', '공부', 
                            '스터디', 'study', '외대', '통번역', '수업', 'diplomacy']
        if any(word in title_lower or word in content_lower or word in tags_str 
               for word in academic_keywords):
            return 'Academic & Research'
        
        # 📝 Notes
        if any(word in title_lower 
               for word in ['today', '메모', 'note', '임시', 'temp', '초안', 'draft', '생각']):
            return 'Notes'
        
        # 🚀 Projects
        if any(word in title_lower or word in content_lower 
               for word in ['프로젝트', 'project', '진행', 'todo', 'task', 'mvp', '구현']):
            return 'Projects'
        
        # 🔗 Resources
        if any(word in title_lower or word in content_lower 
               for word in ['링크', 'link', '자료', 'resource', 'reference', '가이드', 'guide']):
            return 'Resources'
        
        return 'General Knowledge'
    
    def estimate_confidence(self, word_count, link_count):
        """문서 완성도 추정"""
        if word_count < 50:
            return 'draft'
        elif word_count < 300:
            return 'partial'
        else:
            return 'complete'
    
    def calculate_links_in(self):
        """역링크 계산"""
        links_in_map = defaultdict(int)
        
        for page_data in self.pages_data:
            for link in page_data['links_out_list']:
                links_in_map[link] += 1
        
        for page_data in self.pages_data:
            page_id = page_data['id']
            page_data['links_in'] = links_in_map.get(page_id, 0)
    
    def load_from_snapshot(self):
        """최신 스냅샷에서 데이터 로드"""
        snapshots = list(self.snapshot_dir.glob("snapshot_*.json"))
        if not snapshots:
            return False
        
        latest = max(snapshots, key=lambda x: x.stat().st_mtime)
        print(f"\n📦 스냅샷 로드 중: {latest.name}")
        
        try:
            with open(latest, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.pages_data = data['pages']
                print(f"✓ {len(self.pages_data)}개 페이지 데이터 로드 완료\n")
                return True
        except Exception as e:
            print(f"⚠️ 스냅샷 로드 실패: {e}")
            return False
    
    def incremental_update(self):
        """증분 업데이트: 기존 데이터 + 새로운/수정된 페이지만 스캔"""
        # 기존 스냅샷 로드
        if not self.load_from_snapshot():
            print("⚠️ 기존 스냅샷이 없습니다. 전체 스캔으로 전환합니다...\n")
            self.analyze_workspace(use_snapshot=False)
            return
        
        old_pages_data = self.pages_data.copy()
        old_pages_map = {p['id']: p for p in old_pages_data}
        
        print("🔄 증분 업데이트 시작...")
        print(f"기존 데이터: {len(old_pages_data)}개 페이지\n")
        
        # 전체 페이지 ID만 빠르게 스캔
        print("📂 Notion 페이지 ID 스캔 중...")
        all_pages = self.search_all_pages()
        current_page_ids = {page['id'] for page in all_pages}
        
        # 새로운 페이지, 수정된 페이지, 삭제된 페이지 찾기
        new_pages = []
        updated_pages = []
        deleted_page_ids = []
        
        for page in all_pages:
            page_id = page['id']
            last_edited = page.get('last_edited_time', '')
            
            if page_id not in old_pages_map:
                new_pages.append(page)
            elif old_pages_map[page_id]['last_edited_time'] != last_edited[:10]:
                updated_pages.append(page)
        
        # 삭제된 페이지 찾기
        for old_page_id in old_pages_map.keys():
            if old_page_id not in current_page_ids:
                deleted_page_ids.append(old_page_id)
        
        print(f"\n📊 발견된 변경사항:")
        print(f"  - 새 페이지: {len(new_pages)}개")
        print(f"  - 수정된 페이지: {len(updated_pages)}개")
        print(f"  - 삭제된 페이지: {len(deleted_page_ids)}개")
        print(f"  - 변경 없음: {len(all_pages) - len(new_pages) - len(updated_pages)}개\n")
        
        # 삭제된 페이지 제거
        if deleted_page_ids:
            print(f"🗑️ 삭제된 페이지 제거 중...")
            for deleted_id in deleted_page_ids:
                del old_pages_map[deleted_id]
            print(f"✓ {len(deleted_page_ids)}개 페이지 제거 완료\n")
        
        # 새로운/수정된 페이지만 메타데이터 추출
        to_process = new_pages + updated_pages
        if to_process:
            print("📊 메타데이터 추출 중...")
            new_data = []
            for i, page in enumerate(to_process, 1):
                print(f"\r진행: {i}/{len(to_process)} ({i/len(to_process)*100:.1f}%)", end="")
                metadata = self.extract_page_metadata(page)
                if metadata and metadata['word_count'] >= 10:
                    new_data.append(metadata)
                    # 기존 데이터 업데이트
                    old_pages_map[metadata['id']] = metadata
                time.sleep(0.1)
            
            print(f"\n✓ {len(new_data)}개 페이지 처리 완료\n")
        
        # 병합된 데이터
        self.pages_data = list(old_pages_map.values())
        
        # 역링크 재계산
        self.calculate_links_in()
        
        # 새 스냅샷 저장
        self.save_snapshot()
        
        print(f"✓ 최종 데이터: {len(self.pages_data)}개 페이지")
        if deleted_page_ids or new_pages or updated_pages:
            print(f"   ({len(old_pages_data)}개 → {len(self.pages_data)}개)")
    
    def analyze_workspace(self, use_snapshot=True):
        """워크스페이스 전체 분석"""
        # 스냅샷 사용 시도
        if use_snapshot and self.load_from_snapshot():
            print("✓ 기존 스냅샷 사용 (Notion API 호출 없음)\n")
            return
        
        # 스냅샷이 없으면 새로 스캔
        print("⚠️ 스냅샷이 없습니다. Notion API로 새로 스캔합니다...\n")
        pages = self.search_all_pages()
        
        print("📊 메타데이터 추출 중...")
        for i, page in enumerate(pages, 1):
            print(f"\r진행: {i}/{len(pages)} ({i/len(pages)*100:.1f}%)", end="")
            metadata = self.extract_page_metadata(page)
            if metadata and metadata['word_count'] >= 10:
                self.pages_data.append(metadata)
            time.sleep(0.1)
        
        print(f"\n✓ {len(self.pages_data)}개 페이지 분석 완료\n")
        
        # 역링크 계산
        self.calculate_links_in()
        
        # 스냅샷 저장
        self.save_snapshot()
    
    def save_snapshot(self):
        """분석 결과 스냅샷 저장"""
        snapshot_file = self.snapshot_dir / f"snapshot_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
        
        with open(snapshot_file, 'w', encoding='utf-8') as f:
            json.dump({
                'date': datetime.now().isoformat(),
                'total_pages': len(self.pages_data),
                'pages': self.pages_data
            }, f, ensure_ascii=False, indent=2)
        
        print(f"✓ 스냅샷 저장: {snapshot_file.name}")
    
    def save_markdown(self, filename, content):
        """마크다운 파일 저장"""
        filepath = self.output_dir / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ {filename} 생성")
    
    def generate_all_reports(self):
        """모든 리포트 생성 (Obsidian 마크다운)"""
        print(f"\n📝 Obsidian 리포트 생성 중...")
        print(f"출력 경로: {self.output_dir}\n")
        
        self.create_master_index()
        self.create_categories_index()
        self.create_tags_index()
        self.create_action_queue()
        self.create_statistics()
        self.create_smart_filters()
        self.create_frequent_phrases()
        self.create_moc_hub()
        
        print("\n✓ 모든 리포트 생성 완료!")
    
    def create_master_index(self):
        """00_Master_Index.md 생성"""
        total = len(self.pages_data)
        by_category = Counter(p['category'] for p in self.pages_data)
        
        content = []
        content.append("# 📊 Notion Workspace Master Index\n")
        content.append(f"> 최종 업데이트: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        
        content.append("## 📈 통계 요약\n")
        content.append(f"- 총 문서: {total}개\n")
        
        emoji_map = {
            'AI & Tools': '🤖',
            'Language & Interpretation': '🗣️',
            'Winter Sports': '🏔️',
            'Media & Newsletter': '📰',
            'Academic & Research': '🎓',
            'Projects': '🚀',
            'Notes': '📝',
            'Resources': '🔗',
            'General Knowledge': '📚'
        }
        
        for cat, count in by_category.most_common():
            emoji = emoji_map.get(cat, '📄')
            content.append(f"- {emoji} {cat}: {count}개\n")
        
        content.append("\n## 📌 최근 수정 (TOP 10)\n")
        recent = sorted(self.pages_data, key=lambda x: x['last_edited_time'], reverse=True)[:10]
        for p in recent:
            content.append(f"- [{p['title']}]({p['url']}) - {p['last_edited_time']} ({p['word_count']} words)\n")
        
        content.append("\n## 🔥 허브 문서 (링크 많음)\n")
        hubs = sorted(self.pages_data, key=lambda x: x['links_in'], reverse=True)[:10]
        for p in hubs:
            if p['links_in'] > 0:
                content.append(f"- [{p['title']}]({p['url']}) ({p['links_in']}개 링크)\n")
        
        self.save_markdown("00_Master_Index.md", ''.join(content))
    
    def create_categories_index(self):
        """01_Categories.md 생성"""
        content = []
        content.append("# 📂 카테고리별 문서 목록\n")
        
        by_category = defaultdict(list)
        for p in self.pages_data:
            by_category[p['category']].append(p)
        
        categories_order = [
            ('AI & Tools', '🤖'),
            ('Language & Interpretation', '🗣️'),
            ('Winter Sports', '🏔️'),
            ('Media & Newsletter', '📰'),
            ('Academic & Research', '🎓'),
            ('Projects', '🚀'),
            ('Notes', '📝'),
            ('Resources', '🔗'),
            ('General Knowledge', '📚')
        ]
        
        for cat, emoji in categories_order:
            pages = by_category.get(cat, [])
            if not pages:
                continue
            
            content.append(f"\n## {emoji} {cat} ({len(pages)}개)\n")
            
            for p in sorted(pages, key=lambda x: x['word_count'], reverse=True)[:30]:
                tags_str = ' '.join(f'#{t}' for t in p['tags'][:3])
                content.append(f"- [{p['title']}]({p['url']}) - {p['word_count']} words {tags_str}\n")
        
        self.save_markdown("01_Categories.md", ''.join(content))
    
    def create_tags_index(self):
        """02_Tags_System.md 생성"""
        content = []
        content.append("# 🏷️ 태그 시스템\n")
        
        tag_pages = defaultdict(list)
        for p in self.pages_data:
            for tag in p['tags']:
                tag_pages[tag].append(p)
        
        if not tag_pages:
            content.append("\n태그가 발견되지 않았습니다.\n")
        else:
            content.append("\n## 📊 태그 사용 빈도 TOP 30\n")
            
            for tag, pages in sorted(tag_pages.items(), key=lambda x: len(x[1]), reverse=True)[:30]:
                content.append(f"\n### #{tag} ({len(pages)}개)\n")
                for p in pages[:10]:
                    content.append(f"- [{p['title']}]({p['url']})\n")
                if len(pages) > 10:
                    content.append(f"- ... 외 {len(pages)-10}개\n")
        
        self.save_markdown("02_Tags_System.md", ''.join(content))
    
    def create_action_queue(self):
        """03_Action_Queue.md 생성"""
        content = []
        content.append("# 🔧 정리 액션 제안\n")
        content.append(f"> 생성일: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        
        content.append("\n## 🗑️ Delete 후보 (짧고 링크 없음)\n")
        delete_candidates = [p for p in self.pages_data 
                            if p['word_count'] < 50 and p['links_in'] == 0 and p['links_out'] == 0]
        
        if delete_candidates:
            for p in delete_candidates[:20]:
                content.append(f"- [ ] [{p['title']}]({p['url']}) ({p['word_count']} words)\n")
        else:
            content.append("없음\n")
        
        content.append("\n## ✂️ Split 후보 (3000+ words)\n")
        split_candidates = [p for p in self.pages_data if p['word_count'] > 3000]
        if split_candidates:
            for p in split_candidates[:20]:
                content.append(f"- [ ] [{p['title']}]({p['url']}) ({p['word_count']} words)\n")
        else:
            content.append("없음\n")
        
        self.save_markdown("03_Action_Queue.md", ''.join(content))
    
    def create_statistics(self):
        """04_Statistics.md 생성"""
        content = []
        content.append("# 📊 통계 및 분석\n")
        
        by_category = Counter(p['category'] for p in self.pages_data)
        content.append("\n## 카테고리 분포\n")
        for cat, count in by_category.most_common():
            pct = count / len(self.pages_data) * 100
            content.append(f"- {cat}: {count}개 ({pct:.1f}%)\n")
        
        # 태그 TOP 10
        all_tags = []
        for p in self.pages_data:
            all_tags.extend(p['tags'])
        
        if all_tags:
            tag_counts = Counter(all_tags)
            content.append("\n## 자주 쓰는 태그 TOP 20\n")
            for tag, count in tag_counts.most_common(20):
                content.append(f"- #{tag}: {count}회\n")
        
        # 문서 크기 분포
        content.append("\n## 문서 크기 분포\n")
        word_counts = [p['word_count'] for p in self.pages_data]
        if word_counts:
            content.append(f"- 평균: {sum(word_counts)/len(word_counts):.0f} words\n")
            content.append(f"- 최대: {max(word_counts)} words\n")
            content.append(f"- 최소: {min(word_counts)} words\n")
        
        self.save_markdown("04_Statistics.md", ''.join(content))
    
    def create_smart_filters(self):
        """05_Smart_Filters.md 생성"""
        content = []
        content.append("# ⚡ Smart Filters - 스마트 문서 필터\n")
        
        content.append("\n## 🔥 Long Form (2000+ words)\n")
        long_docs = [p for p in self.pages_data if p['word_count'] >= 2000]
        for p in sorted(long_docs, key=lambda x: x['word_count'], reverse=True)[:20]:
            content.append(f"- [{p['title']}]({p['url']}) - {p['word_count']} words\n")
        
        content.append("\n## 📝 Medium (500-2000 words)\n")
        medium_docs = [p for p in self.pages_data if 500 <= p['word_count'] < 2000]
        for p in sorted(medium_docs, key=lambda x: x['word_count'], reverse=True)[:20]:
            content.append(f"- [{p['title']}]({p['url']}) - {p['word_count']} words\n")
        
        content.append("\n## 💡 Short Notes (100-500 words)\n")
        short_docs = [p for p in self.pages_data if 100 <= p['word_count'] < 500]
        for p in sorted(short_docs, key=lambda x: x['word_count'], reverse=True)[:20]:
            content.append(f"- [{p['title']}]({p['url']}) - {p['word_count']} words\n")
        
        self.save_markdown("05_Smart_Filters.md", ''.join(content))
    
    def create_frequent_phrases(self):
        """06_Frequent_Phrases.md 생성"""
        content = []
        content.append("# 💬 자주 쓰는 표현 & 키워드 분석\n")
        
        all_words = []
        for p in self.pages_data:
            words = re.findall(r'[가-힣]{2,}|[a-zA-Z]{3,}', p['title'])
            all_words.extend(words)
        
        stopwords = ['the', 'and', 'for', 'with', 'this', 'that']
        all_words = [w for w in all_words if w.lower() not in stopwords]
        
        word_counts = Counter(all_words)
        
        content.append("\n## 📊 자주 등장하는 키워드 TOP 30\n")
        for word, count in word_counts.most_common(30):
            content.append(f"- **{word}**: {count}회\n")
        
        self.save_markdown("06_Frequent_Phrases.md", ''.join(content))
    
    def create_moc_hub(self):
        """07_MOC_Hub.md 생성"""
        content = []
        content.append("# 🗺️ Map of Contents - 주제별 허브\n")
        
        content.append("\n## 🏔️ 겨울 스포츠 허브\n")
        sports_files = [p for p in self.pages_data if p['category'] == 'Winter Sports']
        for p in sorted(sports_files, key=lambda x: x['word_count'], reverse=True)[:15]:
            content.append(f"- [{p['title']}]({p['url']}) ({p['word_count']} words)\n")
        
        content.append("\n## 🗣️ 통역 & 언어 학습 허브\n")
        lang_files = [p for p in self.pages_data if p['category'] == 'Language & Interpretation']
        for p in sorted(lang_files, key=lambda x: x['word_count'], reverse=True)[:15]:
            content.append(f"- [{p['title']}]({p['url']}) ({p['word_count']} words)\n")
        
        content.append("\n## 🤖 AI & Tools 허브\n")
        ai_files = [p for p in self.pages_data if p['category'] == 'AI & Tools']
        for p in sorted(ai_files, key=lambda x: x['word_count'], reverse=True)[:15]:
            content.append(f"- [{p['title']}]({p['url']}) ({p['word_count']} words)\n")
        
        self.save_markdown("07_MOC_Hub.md", ''.join(content))


def main():
    print("\n" + "="*60)
    print("🚀 Notion to Obsidian Organizer")
    print("="*60 + "\n")
    
    try:
        # 초기화
        organizer = NotionToObsidianOrganizer()
        
        # 스냅샷 확인
        snapshots = list(organizer.snapshot_dir.glob("snapshot_*.json"))
        
        if snapshots:
            latest = max(snapshots, key=lambda x: x.stat().st_mtime)
            snapshot_date = datetime.fromtimestamp(latest.stat().st_mtime)
            
            print(f"📦 기존 스냅샷 발견: {latest.name}")
            print(f"   생성일: {snapshot_date.strftime('%Y-%m-%d %H:%M')}")
            print(f"   크기: {latest.stat().st_size / 1024:.1f} KB\n")
            
            print("어떻게 진행하시겠습니까?\n")
            print("1️⃣  기존 스냅샷 사용")
            print("   → 저장된 데이터로 리포트만 재생성 (Notion API 호출 없음)")
            print("   → 소요 시간: 0초")
            print("   → 언제: 리포트만 다시 보고 싶을 때\n")
            
            print("2️⃣  증분 업데이트 (추천)")
            print("   → 기존 데이터 유지 + 새/수정 페이지만 스캔")
            print("   → 소요 시간: 5-10분")
            print("   → 언제: 문서를 추가/수정했을 때\n")
            
            print("3️⃣  전체 새로 스캔")
            print("   → 모든 페이지를 처음부터 다시 스캔")
            print("   → 소요 시간: 60-90분")
            print("   → 언제: 완전히 새로 시작하고 싶을 때\n")
            
            choice = input("선택 (1, 2, 또는 3): ").strip()
            
            start_time = datetime.now()
            
            if choice == "2":
                print("\n✓ 증분 업데이트를 시작합니다...\n")
                organizer.incremental_update()
            elif choice == "3":
                print("\n✓ Notion API로 전체 새로 스캔합니다...\n")
                organizer.analyze_workspace(use_snapshot=False)
            else:
                print("\n✓ 기존 스냅샷을 사용합니다...\n")
                organizer.analyze_workspace(use_snapshot=True)
        else:
            print("⚠️ 스냅샷이 없습니다. Notion API로 새로 스캔합니다...\n")
            start_time = datetime.now()
            organizer.analyze_workspace(use_snapshot=False)
        
        # 리포트 생성 (Obsidian 마크다운)
        organizer.generate_all_reports()
        
        elapsed = (datetime.now() - start_time).total_seconds()
        
        print("\n" + "="*60)
        print("✅ 완료!")
        print("="*60)
        print(f"처리된 페이지: {len(organizer.pages_data)}개")
        print(f"소요 시간: {elapsed:.1f}초")
        print(f"출력 경로: {organizer.output_dir}")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n✗ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
    
    input("\n아무 키나 눌러 종료...")


if __name__ == "__main__":
    main()

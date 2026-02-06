#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Obsidian Vault Organizer - 메타데이터 기반 인벤토리 시스템
토큰 절약형 설계: AI 없이 파일 메타데이터만으로 전체 지도 생성
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict, Counter

class VaultAnalyzer:
    def __init__(self, vault_path, output_path):
        self.vault_path = Path(vault_path)
        self.output_path = Path(output_path)
        self.files_data = []
        self.stats = defaultdict(int)
        
    def scan_vault(self):
        """모든 .md 파일 스캔 (메타데이터만)"""
        print("\n📂 파일 스캔 중...")
        md_files = list(self.vault_path.rglob("*.md"))
        
        # _Inventory와 output 폴더는 제외
        md_files = [f for f in md_files if "_Inventory" not in str(f) and "output" not in str(f)]
        
        print(f"✓ {len(md_files)}개의 마크다운 파일 발견\n")
        
        for i, file_path in enumerate(md_files, 1):
            print(f"\r진행: {i}/{len(md_files)} ({i/len(md_files)*100:.1f}%)", end="")
            metadata = self.extract_metadata(file_path)
            # 빈 파일 제외 (10 words 미만)
            if metadata['word_count'] >= 10:
                self.files_data.append(metadata)
        
        print("\n✓ 스캔 완료\n")
        return self.files_data
    
    def extract_metadata(self, file_path):
        """파일에서 메타데이터 추출 (AI 없이)"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                first_100_lines = '\n'.join(content.split('\n')[:100])
        except:
            content = ""
            first_100_lines = ""
        
        # 기본 정보
        stat = file_path.stat()
        
        # 제목: 파일명 우선 사용 (Daily Notes 구분 위해)
        title = file_path.stem
        
        # 태그 추출
        tags = re.findall(r'#(\w+)', first_100_lines)
        tags = list(set(tags))[:5]  # 중복 제거, 최대 5개
        
        # 링크 추출
        links_out = re.findall(r'\[\[([^\]]+)\]\]', content)
        
        # 단어 수
        word_count = len(content.split())
        
        # 분류 추정
        category = self.estimate_category(file_path.name, content, tags)
        
        # 신뢰도
        confidence = self.estimate_confidence(word_count, len(links_out))
        
        return {
            'path': str(file_path.relative_to(self.vault_path)),
            'name': file_path.name,
            'title': title,
            'category': category,
            'tags': tags,
            'word_count': word_count,
            'links_out': len(links_out),
            'links_out_list': links_out[:10],  # 최대 10개만
            'confidence': confidence,
            'last_modified': datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d'),
            'size_bytes': stat.st_size
        }

    def estimate_category(self, filename, content, tags):
        """도메인 지식 기반 카테고리 추정"""
        filename_lower = filename.lower()
        content_lower = content[:1000].lower()
        tags_str = ' '.join(tags).lower()
        
        # 🤖 AI & Tools
        ai_keywords = ['gpt', 'chatgpt', 'claude', 'perplexity', 'ai', '프롬프트', 'prompt', 
                       'gemini', 'anthropic', 'llm', 'notebooklm', '자동화', 'automation']
        if any(word in filename_lower or word in content_lower or word in tags_str 
               for word in ai_keywords):
            return 'AI & Tools'
        
        # 🗣️ 통역 & 언어
        interp_keywords = ['통역', '순차통역', '동시통역', 'interpretation', 'interpreter', 
                           '표현', '영어', 'english', '통대', '언어', '발음', '문법', 
                           'broca', 'note-taking', '메모리', '구술', '번역']
        if any(word in filename_lower or word in content_lower or word in tags_str 
               for word in interp_keywords):
            return 'Language & Interpretation'
        
        # 🏔️ 스포츠
        sports_keywords = ['fis', 'mogul', 'freestyle', '스키', '스노보드', 'halfpipe', 
                           '올림픽', 'olympic', 'world cup', 'upshot', '선수', 'athlete',
                           '월드컵', '하프파이프', '모글']
        if any(word in filename_lower or word in content_lower or word in tags_str 
               for word in sports_keywords):
            return 'Winter Sports'
        
        # 📰 미디어 & 뉴스레터
        media_keywords = ['뉴스레터', 'newsletter', '메일리', 'upshot', 'template', 
                          'seo', '콘텐츠', 'content', '발행', '구독', 'cover story']
        if any(word in filename_lower or word in content_lower or word in tags_str 
               for word in media_keywords):
            return 'Media & Newsletter'
        
        # 🎓 학업 & 연구
        academic_keywords = ['논문', 'thesis', '연구', 'research', '학습', '공부', 
                            '스터디', 'study', '외대', '통번역', '수업', 'diplomacy']
        if any(word in filename_lower or word in content_lower or word in tags_str 
               for word in academic_keywords):
            return 'Academic & Research'
        
        # 📝 Notes (일일 메모)
        if any(word in filename_lower 
               for word in ['today', '메모', 'note', '임시', 'temp', '초안', 'draft', '생각']):
            return 'Notes'
        
        # 🚀 Projects
        if any(word in filename_lower or word in content_lower 
               for word in ['프로젝트', 'project', '진행', 'todo', 'task', 'mvp', '구현']):
            return 'Projects'
        
        # 🔗 Resources
        if any(word in filename_lower or word in content_lower 
               for word in ['링크', 'link', '자료', 'resource', 'reference', '가이드', 'guide']):
            return 'Resources'
        
        # 기본값
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
        
        for file_data in self.files_data:
            for link in file_data['links_out_list']:
                # 링크에서 확장자 제거
                link_clean = link.replace('.md', '')
                links_in_map[link_clean] += 1
        
        # 각 파일에 links_in 추가
        for file_data in self.files_data:
            file_title = file_data['title']
            file_data['links_in'] = links_in_map.get(file_title, 0)
    
    def generate_reports(self):
        """모든 리포트 생성"""
        self.output_path.mkdir(parents=True, exist_ok=True)
        
        print("📝 리포트 생성 중...\n")
        
        # 역링크 계산
        self.calculate_links_in()
        
        # 각종 인덱스 생성
        self.create_master_index()
        self.create_categories_index()
        self.create_tags_index()
        self.create_action_queue()
        self.create_statistics()
        
        # 스냅샷 저장
        self.save_snapshot()
        
        print("✓ 모든 리포트 생성 완료\n")
    
    def create_master_index(self):
        """00_Master_Index.md 생성"""
        output = []
        output.append("# 📊 Vault Master Index")
        output.append(f"> 최종 업데이트: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        
        # 통계
        total = len(self.files_data)
        by_category = Counter(f['category'] for f in self.files_data)
        
        output.append("## 📈 통계 요약")
        output.append(f"- 총 문서: {total}개")
        for cat, count in by_category.most_common():
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
            emoji = emoji_map.get(cat, '📄')
            output.append(f"- {emoji} {cat}: {count}개")
        
        # 최근 수정
        output.append("\n## 📌 최근 수정 (7일 이내)")
        recent = sorted(self.files_data, key=lambda x: x['last_modified'], reverse=True)[:10]
        for f in recent:
            output.append(f"- [[{f['title']}]] - {f['last_modified']} ({f['word_count']} words)")
        
        # 허브 문서
        output.append("\n## 🔥 허브 문서 (링크 많음)")
        hubs = sorted(self.files_data, key=lambda x: x['links_in'], reverse=True)[:10]
        for f in hubs:
            if f['links_in'] > 0:
                output.append(f"- [[{f['title']}]] ({f['links_in']}개 링크)")
        
        # 고아 문서
        orphans = [f for f in self.files_data if f['links_in'] == 0 and f['links_out'] == 0]
        output.append(f"\n## ⚠️ 고아 문서 (링크 없음): {len(orphans)}개")
        for f in orphans[:10]:
            output.append(f"- [[{f['title']}]] ({f['word_count']} words)")
        
        self.save_file("00_Master_Index.md", '\n'.join(output))
    
    def create_categories_index(self):
        """01_Categories.md 생성"""
        output = []
        output.append("# 📂 카테고리별 문서 목록\n")
        
        by_category = defaultdict(list)
        for f in self.files_data:
            by_category[f['category']].append(f)
        
        # 카테고리 순서 및 이모지
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
            files = by_category.get(cat, [])
            if not files:
                continue
            
            output.append(f"## {emoji} {cat} ({len(files)}개)\n")
            
            # 단어 수 많은 순으로 정렬
            for f in sorted(files, key=lambda x: x['word_count'], reverse=True):
                tags_str = ' '.join(f'#{t}' for t in f['tags'][:3])
                output.append(f"- [[{f['title']}]] - {f['word_count']} words {tags_str}")
            
            output.append("")
        
        self.save_file("01_Categories.md", '\n'.join(output))
    
    def create_tags_index(self):
        """02_Tags_System.md 생성"""
        output = []
        output.append("# 🏷️ 태그 시스템\n")
        
        # 태그별 문서 수집
        tag_files = defaultdict(list)
        for f in self.files_data:
            for tag in f['tags']:
                tag_files[tag].append(f['title'])
        
        if not tag_files:
            output.append("태그가 발견되지 않았습니다.\n")
        else:
            # 빈도순 정렬
            output.append("## 📊 태그 사용 빈도 TOP 20\n")
            for tag, files in sorted(tag_files.items(), key=lambda x: len(x[1]), reverse=True)[:20]:
                output.append(f"### #{tag} ({len(files)}개)")
                for title in files[:5]:
                    output.append(f"- [[{title}]]")
                if len(files) > 5:
                    output.append(f"- ... 외 {len(files)-5}개")
                output.append("")
        
        self.save_file("02_Tags_System.md", '\n'.join(output))
    
    def create_action_queue(self):
        """03_Action_Queue.md 생성"""
        output = []
        output.append("# 🔧 정리 액션 제안\n")
        output.append(f"> 생성일: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        
        # Delete 후보 (짧고 링크 없음)
        output.append("## 🗑️ Delete 후보 (짧고 링크 없음)\n")
        delete_candidates = [f for f in self.files_data 
                            if f['word_count'] < 50 and f['links_in'] == 0 and f['links_out'] == 0]
        if delete_candidates:
            for f in delete_candidates[:10]:
                output.append(f"- [ ] [[{f['title']}]] ({f['word_count']} words)")
        else:
            output.append("없음\n")
        
        # Archive 후보 (오래됨)
        output.append("\n## 📦 Archive 후보 (1년 이상 미수정)\n")
        output.append("- (날짜 필터링 로직 추가 필요)\n")
        
        # Split 후보 (너무 김)
        output.append("## ✂️ Split 후보 (3000+ words)\n")
        split_candidates = [f for f in self.files_data if f['word_count'] > 3000]
        if split_candidates:
            for f in split_candidates[:10]:
                output.append(f"- [ ] [[{f['title']}]] ({f['word_count']} words)")
        else:
            output.append("없음\n")
        
        self.save_file("03_Action_Queue.md", '\n'.join(output))
    
    def create_statistics(self):
        """04_Statistics.md 생성"""
        output = []
        output.append("# 📊 통계 및 분석\n")
        
        # 카테고리 분포
        by_category = Counter(f['category'] for f in self.files_data)
        output.append("## 카테고리 분포\n")
        for cat, count in by_category.most_common():
            pct = count / len(self.files_data) * 100
            output.append(f"- {cat}: {count}개 ({pct:.1f}%)")
        
        # 태그 TOP 10
        all_tags = []
        for f in self.files_data:
            all_tags.extend(f['tags'])
        
        if all_tags:
            tag_counts = Counter(all_tags)
            output.append("\n## 자주 쓰는 태그 TOP 10\n")
            for tag, count in tag_counts.most_common(10):
                output.append(f"- #{tag}: {count}회")
        else:
            output.append("\n## 자주 쓰는 태그\n태그가 없습니다.\n")
        
        # 문서 크기 분포
        output.append("\n## 문서 크기 분포\n")
        word_counts = [f['word_count'] for f in self.files_data]
        if word_counts:
            output.append(f"- 평균: {sum(word_counts)/len(word_counts):.0f} words")
            output.append(f"- 최대: {max(word_counts)} words")
            output.append(f"- 최소: {min(word_counts)} words")
        
        self.save_file("04_Statistics.md", '\n'.join(output))
    
    def save_snapshot(self):
        """스냅샷 저장"""
        history_dir = self.output_path / "history"
        history_dir.mkdir(exist_ok=True)
        
        snapshot_file = history_dir / f"snapshot_{datetime.now().strftime('%Y%m%d')}.json"
        
        with open(snapshot_file, 'w', encoding='utf-8') as f:
            json.dump({
                'date': datetime.now().isoformat(),
                'total_files': len(self.files_data),
                'files': self.files_data
            }, f, ensure_ascii=False, indent=2)
        
        print(f"✓ 스냅샷 저장: {snapshot_file.name}")
    
    def save_file(self, filename, content):
        """파일 저장"""
        filepath = self.output_path / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ {filename} 생성")


def load_config(config_path="config.txt"):
    """config.txt 로드"""
    config = {}
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    config[key.strip()] = value.strip().strip('"')
        return config
    except Exception as e:
        raise Exception(f"설정 파일 로드 실패: {e}")


def main():
    print("\n" + "="*60)
    print("Obsidian Vault Organizer - 메타데이터 기반 인벤토리")
    print("="*60 + "\n")
    
    # 설정 로드
    try:
        config = load_config()
        vault_path = config.get('vault_path')
        output_path = config.get('output_path', 'output')
        
        if not vault_path:
            raise Exception("vault_path가 설정되지 않았습니다")
        
        if not os.path.exists(vault_path):
            raise Exception(f"Vault path does not exist: {vault_path}")
        
        print(f"✓ 설정 로드 완료")
        print(f"  볼트 경로: {vault_path}")
        print(f"  출력 경로: {output_path}\n")
        
    except Exception as e:
        print(f"✗ 설정 로드 실패: {e}")
        input("\n아무 키나 눌러 종료...")
        return
    
    # 분석 시작
    start_time = datetime.now()
    
    try:
        analyzer = VaultAnalyzer(vault_path, output_path)
        analyzer.scan_vault()
        analyzer.generate_reports()
        
        elapsed = (datetime.now() - start_time).total_seconds()
        
        print("\n" + "="*60)
        print("✅ 완료!")
        print("="*60)
        print(f"처리된 파일: {len(analyzer.files_data)}개")
        print(f"소요 시간: {elapsed:.1f}초")
        print(f"출력 경로: {output_path}")
        print("="*60 + "\n")
        
        # 자동으로 enhancer.py 실행
        print("🚀 Step 2: 고도화 리포트 생성 중...\n")
        try:
            import subprocess
            result = subprocess.run(['python3', 'enhancer.py'], 
                                  cwd='/Users/jenkim/Downloads/2026_Antigravity',
                                  capture_output=False)
            if result.returncode == 0:
                print("\n✅ 모든 리포트 생성 완료!")
        except Exception as e:
            print(f"\n⚠️ enhancer.py 실행 중 오류: {e}")
        
    except Exception as e:
        print(f"\n✗ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
    
    input("아무 키나 눌러 종료...")


if __name__ == "__main__":
    main()

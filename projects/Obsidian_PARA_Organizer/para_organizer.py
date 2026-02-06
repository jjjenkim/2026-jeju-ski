#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Obsidian PARA Organizer
옵시디언 볼트를 PARA + 제텔카스텐 구조로 자동 정리
"""

import os
import json
import re
import shutil
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict, Counter

class PARAOrganizer:
    def __init__(self, config_path="config.txt"):
        """설정 파일 로드 및 초기화"""
        self.config = self.load_config(config_path)
        self.vault_path = Path(self.config['VAULT_PATH'])
        self.para_root = self.vault_path / self.config['PARA_ROOT']
        self.output_dir = Path("output")
        self.output_dir.mkdir(exist_ok=True)
        self.files_data = []
        
        # PARA 구조 정의
        self.para_structure = {
            '000 Meta': ['Dashboard.md', 'MOC', 'About'],
            '100 Projects': ['Active', 'Planning', 'Completed'],
            '200 Areas': ['Work', 'Personal', 'Health', 'Finance'],
            '300 Resources': ['Inbox', 'Literature Notes', 'Permanent Notes', 'References'],
            '400 Archive': [],
            '900 Templates': [],
            '_attachments': []
        }
    
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
            if not config.get('VAULT_PATH'):
                raise Exception("VAULT_PATH가 설정되지 않았습니다")
            
            # 기본값 설정
            config.setdefault('PARA_ROOT', 'PARA_System')
            config.setdefault('CREATE_BACKUP', 'true')
            config.setdefault('AUTO_MOVE', 'true')
            config.setdefault('INBOX_DAYS', '7')
            config.setdefault('ARCHIVE_DAYS', '90')
            
            return config
        except Exception as e:
            raise Exception(f"설정 파일 로드 실패: {e}")
    
    def create_para_structure(self):
        """PARA 폴더 구조 생성"""
        print("\n📁 PARA 구조 생성 중...")
        
        # 루트 폴더 생성
        self.para_root.mkdir(exist_ok=True)
        
        created_count = 0
        for folder, subfolders in self.para_structure.items():
            folder_path = self.para_root / folder
            folder_path.mkdir(exist_ok=True)
            created_count += 1
            
            # 하위 폴더 생성
            for subfolder in subfolders:
                if subfolder.endswith('.md'):
                    # 파일 생성
                    file_path = folder_path / subfolder
                    if not file_path.exists():
                        file_path.write_text(f"# {subfolder.replace('.md', '')}\n\n", encoding='utf-8')
                else:
                    # 폴더 생성
                    sub_path = folder_path / subfolder
                    sub_path.mkdir(exist_ok=True)
                    created_count += 1
        
        print(f"✓ {created_count}개 폴더/파일 생성 완료\n")
    
    def scan_vault(self):
        """볼트의 모든 마크다운 파일 스캔"""
        print("📂 볼트 스캔 중...")
        
        md_files = []
        for file_path in self.vault_path.rglob("*.md"):
            # PARA 폴더 내부 파일은 제외
            if str(file_path).startswith(str(self.para_root)):
                continue
            # 숨김 파일 제외
            if any(part.startswith('.') for part in file_path.parts):
                continue
            md_files.append(file_path)
        
        print(f"✓ {len(md_files)}개 파일 발견\n")
        return md_files
    
    def extract_metadata(self, file_path):
        """파일에서 메타데이터 추출"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            metadata = {
                'path': str(file_path),
                'name': file_path.name,
                'title': file_path.stem,
                'content': content,
                'tags': [],
                'yaml': {},
                'links': [],
                'word_count': len(content.split()),
                'created': datetime.fromtimestamp(file_path.stat().st_ctime),
                'modified': datetime.fromtimestamp(file_path.stat().st_mtime)
            }
            
            # YAML frontmatter 추출
            yaml_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
            if yaml_match:
                yaml_text = yaml_match.group(1)
                for line in yaml_text.split('\n'):
                    if ':' in line:
                        key, value = line.split(':', 1)
                        metadata['yaml'][key.strip()] = value.strip()
                
                # YAML에서 태그 추출
                if 'tags' in metadata['yaml']:
                    tags_str = metadata['yaml']['tags']
                    # [tag1, tag2] 형식 처리
                    tags_str = tags_str.strip('[]')
                    metadata['tags'].extend([t.strip().strip('"\'') for t in tags_str.split(',')])
            
            # 본문에서 #태그 추출
            hash_tags = re.findall(r'#(\w+)', content)
            metadata['tags'].extend(hash_tags)
            metadata['tags'] = list(set(metadata['tags']))  # 중복 제거
            
            # [[링크]] 추출
            links = re.findall(r'\[\[([^\]]+)\]\]', content)
            metadata['links'] = links
            metadata['link_count'] = len(links)
            
            return metadata
        except Exception as e:
            print(f"⚠️ {file_path.name} 메타데이터 추출 실패: {e}")
            return None
    
    def classify_file(self, metadata):
        """파일을 PARA 카테고리로 분류"""
        tags = [t.lower() for t in metadata['tags']]
        yaml = {k.lower(): v.lower() for k, v in metadata['yaml'].items()}
        content_lower = metadata['content'][:1000].lower()
        title_lower = metadata['title'].lower()
        
        # 1. 명시적 태그 우선
        if 'archive' in tags or yaml.get('status') == 'archived':
            return '400 Archive', ''
        
        if 'project' in tags or yaml.get('type') == 'project':
            status = yaml.get('status', 'active')
            if status == 'completed':
                return '100 Projects', 'Completed'
            elif status == 'planning':
                return '100 Projects', 'Planning'
            else:
                return '100 Projects', 'Active'
        
        # 2. Areas 분류
        if 'work' in tags or 'business' in tags:
            return '200 Areas', 'Work'
        if 'personal' in tags or 'life' in tags:
            return '200 Areas', 'Personal'
        if 'health' in tags or 'fitness' in tags:
            return '200 Areas', 'Health'
        if 'finance' in tags or 'money' in tags:
            return '200 Areas', 'Finance'
        
        # 3. Resources 분류
        # Literature Notes
        if any(tag in tags for tag in ['book', 'article', 'video', 'paper']):
            return '300 Resources', 'Literature Notes'
        if 'source' in yaml or 'author' in yaml:
            return '300 Resources', 'Literature Notes'
        
        # Permanent Notes (높은 링크 밀도)
        if metadata['link_count'] >= 5:
            return '300 Resources', 'Permanent Notes'
        
        # References
        if 'reference' in tags or 'ref' in tags:
            return '300 Resources', 'References'
        
        # Inbox (최근 생성, 태그 없음)
        inbox_threshold = datetime.now() - timedelta(days=int(self.config['INBOX_DAYS']))
        if metadata['created'] > inbox_threshold and len(metadata['tags']) == 0:
            return '300 Resources', 'Inbox'
        
        # 4. 키워드 기반 분류
        # Project 키워드
        project_keywords = ['프로젝트', 'project', '마감', 'deadline', '목표', 'goal']
        if any(kw in title_lower or kw in content_lower for kw in project_keywords):
            return '100 Projects', 'Active'
        
        # Area 키워드
        work_keywords = ['업무', 'work', '회사', 'company', '직장', 'office']
        if any(kw in title_lower or kw in content_lower for kw in work_keywords):
            return '200 Areas', 'Work'
        
        # 5. 기본값: Resources/References
        return '300 Resources', 'References'
    
    def move_file(self, file_path, category, subcategory):
        """파일을 PARA 구조로 이동"""
        target_dir = self.para_root / category
        if subcategory:
            target_dir = target_dir / subcategory
        
        target_dir.mkdir(parents=True, exist_ok=True)
        target_path = target_dir / file_path.name
        
        # 동일한 파일이 이미 존재하는지 확인
        if target_path.exists():
            # 파일 내용 비교
            try:
                with open(file_path, 'r', encoding='utf-8') as f1:
                    content1 = f1.read()
                with open(target_path, 'r', encoding='utf-8') as f2:
                    content2 = f2.read()
                
                if content1 == content2:
                    # 동일한 파일이면 원본 삭제하고 건너뛰기
                    file_path.unlink()
                    return True, target_path, 'skipped'
                else:
                    # 내용이 다르면 번호 붙여서 이동
                    base = target_path.stem
                    ext = target_path.suffix
                    counter = 1
                    while target_path.exists():
                        target_path = target_dir / f"{base}_{counter}{ext}"
                        counter += 1
            except:
                # 비교 실패 시 번호 붙이기
                base = target_path.stem
                ext = target_path.suffix
                counter = 1
                while target_path.exists():
                    target_path = target_dir / f"{base}_{counter}{ext}"
                    counter += 1
        
        try:
            shutil.move(str(file_path), str(target_path))
            return True, target_path, 'moved'
        except Exception as e:
            print(f"⚠️ {file_path.name} 이동 실패: {e}")
            return False, None, 'failed'
    
    def organize_vault(self):
        """볼트 전체 정리"""
        # PARA 구조 생성
        self.create_para_structure()
        
        # 파일 스캔
        files = self.scan_vault()
        
        # 분류 및 이동
        print("📊 파일 분류 및 이동 중...")
        
        classification = defaultdict(lambda: defaultdict(int))
        moved_count = 0
        skipped_count = 0
        failed_count = 0
        
        for i, file_path in enumerate(files, 1):
            print(f"\r진행: {i}/{len(files)} ({i/len(files)*100:.1f}%)", end="")
            
            metadata = self.extract_metadata(file_path)
            if not metadata:
                failed_count += 1
                continue
            
            category, subcategory = self.classify_file(metadata)
            classification[category][subcategory] += 1
            
            # 자동 이동 설정 확인
            if self.config['AUTO_MOVE'].lower() == 'true':
                success, new_path, status = self.move_file(file_path, category, subcategory)
                if success:
                    if status == 'skipped':
                        skipped_count += 1
                    else:
                        moved_count += 1
                    metadata['new_path'] = str(new_path)
                    metadata['category'] = category
                    metadata['subcategory'] = subcategory
                    self.files_data.append(metadata)
                else:
                    failed_count += 1
        
        print(f"\n✓ {moved_count}개 파일 이동 완료")
        if skipped_count > 0:
            print(f"⏭️ {skipped_count}개 중복 파일 건너뜀\n")
        else:
            print()
        
        # 분류 결과 출력
        print("📊 분류 결과:")
        for category in sorted(classification.keys()):
            total = sum(classification[category].values())
            print(f"\n  {category}: {total}개")
            for subcat, count in sorted(classification[category].items()):
                if subcat:
                    print(f"    - {subcat}: {count}개")
        
        if failed_count > 0:
            print(f"\n⚠️ 실패: {failed_count}개")
        
        # 스냅샷 저장
        self.save_snapshot()
        
        # MOC 및 Dashboard 생성
        self.create_mocs()
        self.create_dashboard()
    
    def create_mocs(self):
        """MOC (Map of Content) 생성"""
        print("\n📝 MOC 생성 중...")
        
        moc_dir = self.para_root / '000 Meta' / 'MOC'
        moc_dir.mkdir(exist_ok=True)
        
        # 카테고리별 MOC
        by_category = defaultdict(list)
        for file_data in self.files_data:
            category = file_data.get('category', '')
            if category:
                by_category[category].append(file_data)
        
        moc_count = 0
        for category, files in by_category.items():
            moc_path = moc_dir / f"{category.replace(' ', '_')}_MOC.md"
            
            content = [f"# {category} - Map of Content\n\n"]
            content.append(f"> 생성일: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            
            # 하위 카테고리별로 그룹화
            by_subcat = defaultdict(list)
            for f in files:
                subcat = f.get('subcategory', 'Other')
                by_subcat[subcat].append(f)
            
            for subcat in sorted(by_subcat.keys()):
                content.append(f"## {subcat}\n\n")
                for f in sorted(by_subcat[subcat], key=lambda x: x['title']):
                    # 상대 경로로 링크 생성
                    rel_path = Path(f['new_path']).relative_to(self.para_root)
                    content.append(f"- [[{rel_path}|{f['title']}]]\n")
                content.append("\n")
            
            moc_path.write_text(''.join(content), encoding='utf-8')
            moc_count += 1
        
        print(f"✓ {moc_count}개 MOC 생성 완료")
    
    def create_dashboard(self):
        """Dashboard 생성"""
        print("📊 Dashboard 생성 중...")
        
        dashboard_path = self.para_root / '000 Meta' / 'Dashboard.md'
        
        content = []
        content.append("# 📊 PARA Dashboard\n\n")
        content.append(f"> 최종 업데이트: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
        
        # 통계
        content.append("## 📈 통계\n\n")
        content.append(f"- 총 파일: {len(self.files_data)}개\n")
        
        by_category = Counter(f.get('category', '') for f in self.files_data)
        for category, count in sorted(by_category.items()):
            content.append(f"- {category}: {count}개\n")
        
        # Quick Links
        content.append("\n## 🔗 Quick Links\n\n")
        content.append("- [[000 Meta/MOC/|MOC 폴더]]\n")
        content.append("- [[100 Projects/Active/|진행 중인 프로젝트]]\n")
        content.append("- [[300 Resources/Inbox/|Inbox]]\n")
        content.append("- [[400 Archive/|Archive]]\n")
        
        # 최근 파일
        content.append("\n## 📌 최근 수정 (TOP 10)\n\n")
        recent = sorted(self.files_data, key=lambda x: x['modified'], reverse=True)[:10]
        for f in recent:
            rel_path = Path(f['new_path']).relative_to(self.para_root)
            mod_date = f['modified'].strftime('%Y-%m-%d')
            content.append(f"- [[{rel_path}|{f['title']}]] - {mod_date}\n")
        
        dashboard_path.write_text(''.join(content), encoding='utf-8')
        print("✓ Dashboard 생성 완료")
    
    def save_snapshot(self):
        """스냅샷 저장"""
        snapshot_file = self.output_dir / f"snapshot_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
        
        # datetime 객체를 문자열로 변환
        serializable_data = []
        for file_data in self.files_data:
            data_copy = file_data.copy()
            if 'created' in data_copy and isinstance(data_copy['created'], datetime):
                data_copy['created'] = data_copy['created'].isoformat()
            if 'modified' in data_copy and isinstance(data_copy['modified'], datetime):
                data_copy['modified'] = data_copy['modified'].isoformat()
            serializable_data.append(data_copy)
        
        with open(snapshot_file, 'w', encoding='utf-8') as f:
            json.dump({
                'date': datetime.now().isoformat(),
                'total_files': len(serializable_data),
                'files': serializable_data
            }, f, ensure_ascii=False, indent=2)
        
        print(f"\n✓ 스냅샷 저장: {snapshot_file.name}")


def main():
    print("\n" + "="*60)
    print("🗂️ Obsidian PARA Organizer")
    print("="*60 + "\n")
    
    try:
        organizer = PARAOrganizer()
        
        print(f"📂 볼트 경로: {organizer.vault_path}")
        print(f"📁 PARA 루트: {organizer.para_root}\n")
        
        # 백업 생성
        if organizer.config['CREATE_BACKUP'].lower() == 'true':
            print("💾 백업 생성 중...")
            backup_dir = organizer.vault_path / f"_backup_{datetime.now().strftime('%Y%m%d_%H%M')}"
            # 간단한 백업: PARA 폴더만 백업
            if organizer.para_root.exists():
                shutil.copytree(organizer.para_root, backup_dir / organizer.config['PARA_ROOT'])
                print(f"✓ 백업 완료: {backup_dir.name}\n")
        
        start_time = datetime.now()
        
        # 볼트 정리
        organizer.organize_vault()
        
        elapsed = (datetime.now() - start_time).total_seconds()
        
        print("\n" + "="*60)
        print("✅ 완료!")
        print("="*60)
        print(f"처리된 파일: {len(organizer.files_data)}개")
        print(f"소요 시간: {elapsed:.1f}초")
        print(f"PARA 경로: {organizer.para_root}")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n✗ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
    
    input("\n아무 키나 눌러 종료...")


if __name__ == "__main__":
    main()

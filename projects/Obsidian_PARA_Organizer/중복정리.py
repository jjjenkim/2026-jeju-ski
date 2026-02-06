#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PARA 폴더 내 중복 파일 정리
동일한 내용의 파일을 찾아서 하나만 남기고 삭제
"""

import hashlib
from pathlib import Path
from collections import defaultdict

def get_file_hash(file_path):
    """파일 내용의 해시값 계산"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return hashlib.md5(content.encode()).hexdigest()
    except:
        return None

def clean_duplicates():
    """PARA 폴더 내 중복 파일 정리"""
    print("\n" + "="*60)
    print("🧹 PARA 폴더 중복 파일 정리")
    print("="*60 + "\n")
    
    para_path = Path("/Users/jenkim/Library/Mobile Documents/iCloud~md~obsidian/Documents/Mac book 옵시디언/PARA_System")
    
    if not para_path.exists():
        print("⚠️ PARA_System 폴더를 찾을 수 없습니다.")
        return
    
    print(f"📂 경로: {para_path}\n")
    print("🔍 중복 파일 검색 중...\n")
    
    # 파일 해시 계산
    hash_map = defaultdict(list)
    total_files = 0
    
    for file_path in para_path.rglob("*.md"):
        # Dashboard, MOC 등 시스템 파일 제외
        if file_path.parent.name in ['MOC', 'About'] or file_path.name == 'Dashboard.md':
            continue
        
        file_hash = get_file_hash(file_path)
        if file_hash:
            hash_map[file_hash].append(file_path)
            total_files += 1
    
    print(f"✓ {total_files}개 파일 스캔 완료\n")
    
    # 중복 파일 찾기
    duplicates = {h: files for h, files in hash_map.items() if len(files) > 1}
    
    if not duplicates:
        print("✅ 중복 파일이 없습니다!")
        return
    
    print(f"📊 발견된 중복 그룹: {len(duplicates)}개\n")
    
    deleted_count = 0
    for file_hash, files in duplicates.items():
        print(f"\n중복 그룹 ({len(files)}개 파일):")
        
        # 파일 정보 출력
        for i, f in enumerate(files, 1):
            rel_path = f.relative_to(para_path)
            print(f"  {i}. {rel_path}")
        
        # 첫 번째 파일만 유지, 나머지 삭제
        keep = files[0]
        to_delete = files[1:]
        
        print(f"\n  유지: {keep.relative_to(para_path)}")
        print(f"  삭제: {len(to_delete)}개")
        
        for f in to_delete:
            try:
                f.unlink()
                deleted_count += 1
                print(f"    ✓ {f.name} 삭제")
            except Exception as e:
                print(f"    ✗ {f.name} 삭제 실패: {e}")
    
    print("\n" + "="*60)
    print("✅ 정리 완료!")
    print("="*60)
    print(f"삭제된 파일: {deleted_count}개")
    print(f"남은 파일: {total_files - deleted_count}개")
    print("="*60 + "\n")

if __name__ == "__main__":
    try:
        clean_duplicates()
    except Exception as e:
        print(f"\n✗ 오류: {e}")
        import traceback
        traceback.print_exc()
    
    input("\n아무 키나 눌러 종료...")

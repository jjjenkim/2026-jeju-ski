#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PARA 구조 완전 복구
1. PARA 폴더 안의 모든 파일을 볼트 루트로 이동
2. _1, _2 등 번호 제거
3. PARA 폴더 삭제
"""

import shutil
from pathlib import Path
import re

def restore_files():
    """PARA 폴더의 파일들을 볼트 루트로 복구"""
    print("\n" + "="*60)
    print("🔄 PARA 구조 완전 복구")
    print("="*60 + "\n")
    
    vault_path = Path("/Users/jenkim/Library/Mobile Documents/iCloud~md~obsidian/Documents/Mac book 옵시디언")
    para_path = vault_path / "PARA_System"
    
    if not para_path.exists():
        print("⚠️ PARA_System 폴더가 없습니다.")
        return
    
    print(f"📂 볼트 경로: {vault_path}")
    print(f"📁 PARA 경로: {para_path}\n")
    
    # PARA 폴더 안의 모든 .md 파일 찾기
    all_files = list(para_path.rglob("*.md"))
    
    # 시스템 파일 제외 (Dashboard, MOC 등)
    files_to_move = []
    for f in all_files:
        if f.parent.name in ['MOC', 'About'] or f.name == 'Dashboard.md':
            continue
        files_to_move.append(f)
    
    print(f"📊 이동할 파일: {len(files_to_move)}개\n")
    
    if len(files_to_move) == 0:
        print("⚠️ 이동할 파일이 없습니다.")
        return
    
    print("⚠️ 다음 작업을 수행합니다:")
    print("  1. PARA 폴더의 모든 파일을 볼트 루트로 이동")
    print("  2. 파일명의 _1, _2 등 번호 제거")
    print("  3. PARA_System 폴더 삭제\n")
    
    choice = input("계속하시겠습니까? (yes/no): ").strip().lower()
    
    if choice != 'yes':
        print("\n취소되었습니다.")
        return
    
    print("\n🚚 파일 이동 중...\n")
    
    moved_count = 0
    renamed_count = 0
    failed_count = 0
    
    for file_path in files_to_move:
        try:
            # 파일명에서 _1, _2 등 제거
            original_name = file_path.name
            clean_name = re.sub(r'_\d+\.md$', '.md', original_name)
            
            # 목적지 경로
            target_path = vault_path / clean_name
            
            # 이미 존재하면 번호 유지
            if target_path.exists() and clean_name != original_name:
                target_path = vault_path / original_name
            
            # 파일 이동
            shutil.move(str(file_path), str(target_path))
            moved_count += 1
            
            if clean_name != original_name:
                renamed_count += 1
                print(f"✓ {original_name} → {target_path.name}")
            else:
                print(f"✓ {original_name}")
            
        except Exception as e:
            print(f"✗ {file_path.name} 이동 실패: {e}")
            failed_count += 1
    
    print(f"\n✓ {moved_count}개 파일 이동 완료")
    if renamed_count > 0:
        print(f"✓ {renamed_count}개 파일 이름 정리 완료")
    if failed_count > 0:
        print(f"⚠️ {failed_count}개 파일 이동 실패")
    
    # PARA 폴더 삭제
    print("\n🗑️ PARA_System 폴더 삭제 중...")
    try:
        shutil.rmtree(para_path)
        print("✓ PARA_System 폴더 삭제 완료")
    except Exception as e:
        print(f"✗ 폴더 삭제 실패: {e}")
    
    # 백업 폴더 삭제 여부 확인
    backups = list(vault_path.glob("_backup_*"))
    if backups:
        print(f"\n📦 {len(backups)}개의 백업 폴더가 있습니다.")
        choice2 = input("백업 폴더도 삭제하시겠습니까? (yes/no): ").strip().lower()
        
        if choice2 == 'yes':
            for backup in backups:
                try:
                    shutil.rmtree(backup)
                    print(f"✓ {backup.name} 삭제")
                except Exception as e:
                    print(f"✗ {backup.name} 삭제 실패: {e}")
    
    print("\n" + "="*60)
    print("✅ 복구 완료!")
    print("="*60)
    print(f"이동된 파일: {moved_count}개")
    print(f"정리된 파일명: {renamed_count}개")
    print("모든 파일이 볼트 루트로 돌아갔습니다.")
    print("="*60 + "\n")

if __name__ == "__main__":
    try:
        restore_files()
    except Exception as e:
        print(f"\n✗ 오류: {e}")
        import traceback
        traceback.print_exc()
    
    input("\n아무 키나 눌러 종료...")

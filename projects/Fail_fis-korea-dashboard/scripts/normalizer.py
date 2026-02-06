#!/usr/bin/env python3
"""
FIS 데이터 정규화 스크립트 (build-time normalization)
목적: raw JSON 데이터들을 검증하고 단일 CSV 파일로 통합
"""

import json
import pandas as pd
from pathlib import Path
from datetime import datetime
import re
import sys

def load_athlete_master():
    """선수 마스터 정보 로드"""
    master_path = Path("scripts/athletes-master.json")
    if not master_path.exists():
        print("❌ athletes-master.json 파일을 찾을 수 없습니다.")
        return {}
    
    athletes = json.loads(master_path.read_text())
    # FIS Code를 키로 하는 맵 생성
    return {str(a['competitorId']): a for a in athletes}

def validate_data(df):
    """데이터 품질 검증"""
    print("\n🧐 데이터 검증 시작...")
    
    issues = []
    
    # 1. FIS Code 형식 확인 (6자리 숫자)
    if 'fis_code' not in df.columns:
         issues.append("fis_code 컬럼 없음")
    
    # 2. 날짜 형식 확인
    invalid_dates = pd.to_datetime(df['date'], errors='coerce').isna()
    if invalid_dates.sum() > 0:
        issues.append(f"❌ 날짜 파싱 실패: {invalid_dates.sum()}건")
    
    # 3. 미래 데이터 확인
    today = datetime.now()
    dates = pd.to_datetime(df['date'], errors='coerce')
    future_dates = dates > today
    if future_dates.sum() > 0:
        issues.append(f"⚠️ 미래 날짜 데이터 발견: {future_dates.sum()}건")
        
    if not issues:
        print("✅ 데이터 검증 통과!")
    else:
        for issue in issues:
            print(issue)
            
    return df

def normalize_all():
    """전체 로직 실행"""
    
    athlete_map = load_athlete_master()
    
    raw_dir = Path("data/raw")
    if not raw_dir.exists():
        print("❌ data/raw 디렉토리가 없습니다. scraper.py를 먼저 실행하세요.")
        sys.exit(1)
        
    json_files = list(raw_dir.glob("*.json"))
    if not json_files:
        print("❌ 처리할 JSON 파일이 없습니다.")
        sys.exit(1)

    print(f"📊 총 {len(json_files)}개 파일 처리 중...")
    
    all_results = []
    
    for json_file in json_files:
        try:
            data = json.loads(json_file.read_text())
            athlete_name = data.get('athlete')
            
            # 파일명 파싱: raw_{name}_{id}.json
            match = re.search(r'raw_.*_(\d+)\.json', json_file.name)
            if match:
                fis_code = match.group(1)
            else:
                fis_code = "Unknown"
                
            for result in data.get('results', []):
                row = {
                    'athlete': athlete_name,
                    'fis_code': fis_code,
                    'date': result.get('date'),
                    'location': result.get('location'),
                    'nation': result.get('nation'),
                    'category': result.get('category'),
                    'discipline': result.get('discipline'),
                    'rank': result.get('rank'),
                    'fis_points': result.get('fis_points'),
                    'cup_points': result.get('cup_points')
                }
                all_results.append(row)
                
        except Exception as e:
            print(f"⚠️ 파일 처리 실패 {json_file.name}: {e}")

    df = pd.DataFrame(all_results)
    
    # 트림 처리
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = df[col].str.strip()

    # 날짜 정규화 (DD-MM-YYYY -> YYYY-MM-DD)
    df['date_obj'] = pd.to_datetime(df['date'], format='%d-%m-%Y', errors='coerce')
    
    df = df.dropna(subset=['date_obj'])
    df['date'] = df['date_obj'].dt.strftime('%Y-%m-%d')
    
    # 정렬: 날짜 최신순
    df = df.sort_values(by='date', ascending=False)
    
    # 중복 제거
    df = df.drop_duplicates(subset=['fis_code', 'date', 'category', 'discipline'], keep='first')
    
    # 검증
    validate_data(df)
    
    # CSV 저장
    output_dir = Path("public/data")
    output_dir.mkdir(exist_ok=True, parents=True)
    output_path = output_dir / "fis_all_results.csv"
    
    cols = ['athlete', 'fis_code', 'date', 'location', 'nation', 'category', 'discipline', 'rank', 'fis_points', 'cup_points']
    df[cols].to_csv(output_path, index=False, encoding='utf-8-sig')
    
    print(f"\n✅ 저장 완료: {output_path}")
    print(f"   총 데이터: {len(df)}행")
    print(f"   파일 크기: {output_path.stat().st_size / 1024:.1f} KB")

if __name__ == '__main__':
    normalize_all()

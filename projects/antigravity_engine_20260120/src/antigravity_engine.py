#!/usr/bin/env python3
"""
Antigravity Engine
Created: 2026-01-20

A data visualization engine that converts images or CSV files 
into interactive HTML dashboards using Google's Gemini AI.

Pipeline: Ingest → Plan → Build
- Ingest: Auto-detect file type and convert to CSV
- Plan: AI analyzes data and recommends charts
- Build: Generate single-file HTML dashboard
"""

import os
import json
import pandas as pd
import google.generativeai as genai
from PIL import Image
from pathlib import Path
import logging
from datetime import datetime


class AntigravityEngine:
    """Main engine for automated dashboard generation"""
    
    def __init__(self, config_path="config.json", interactive=False):
        """Initialize engine with configuration
        
        Args:
            config_path: Path to configuration JSON file
            interactive: If True, prompt user for target_file and design_style
        """
        self.project_root = Path(__file__).parent.parent
        self.config_path = self.project_root / config_path
        self.interactive = interactive
        
        # Setup logging
        self.logger = self._setup_logger()
        self.logger.info("=" * 60)
        self.logger.info("Antigravity Engine Starting")
        self.logger.info("=" * 60)
        
        # Load configuration
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                self.config = json.load(f)
            self.logger.info(f"✓ Configuration loaded from {config_path}")
        except FileNotFoundError:
            self.logger.error(f"Configuration file not found: {config_path}")
            raise
        except json.JSONDecodeError as e:
            self.logger.error(f"Invalid JSON in configuration: {e}")
            raise
        
        # Validate API key
        api_key = self.config.get('google_api_key', '')
        if not api_key or api_key == "YOUR_API_KEY_HERE":
            self.logger.error("Google API key not configured")
            raise ValueError(
                "Please add your Google Gemini API key to config.json\n"
                "Get your key at: https://makersuite.google.com/app/apikey"
            )
        
        # Configure Gemini AI
        genai.configure(api_key=api_key)
        self.logger.info("✓ Gemini AI configured")

    def _setup_logger(self):
        """Setup logging to file and console"""
        logs_dir = self.project_root / "logs"
        logs_dir.mkdir(exist_ok=True)
        
        logger = logging.getLogger('AntigravityEngine')
        logger.setLevel(logging.INFO)
        
        # File handler
        log_file = logs_dir / f"engine_{datetime.now().strftime('%Y%m%d')}.log"
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(
            logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        )
        logger.addHandler(file_handler)
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(
            logging.Formatter('%(message)s')
        )
        logger.addHandler(console_handler)
        
        return logger

    def _get_interactive_inputs(self):
        """Get target file and design style interactively from user"""
        import tkinter as tk
        from tkinter import filedialog
        
        print("\n" + "=" * 60)
        print("🎨 ANTIGRAVITY ENGINE - 인터랙티브 모드")
        print("=" * 60)
        
        # File selection
        print("\n📂 Step 1: 파일 선택")
        print("   지원 형식: 이미지 (.jpg, .png, .webp) 또는 CSV (.csv)")
        
        # Try GUI file dialog first
        try:
            root = tk.Tk()
            root.withdraw()  # Hide main window
            root.attributes('-topmost', True)  # Bring to front
            
            file_path = filedialog.askopenfilename(
                title="변환할 파일을 선택하세요",
                initialdir=self.project_root / "data" / "raw",
                filetypes=[
                    ("모든 지원 파일", "*.jpg *.jpeg *.png *.webp *.csv"),
                    ("이미지 파일", "*.jpg *.jpeg *.png *.webp"),
                    ("CSV 파일", "*.csv"),
                    ("모든 파일", "*.*")
                ]
            )
            root.destroy()
            
            if not file_path:
                print("   ⚠️  파일이 선택되지 않았습니다.")
                return None, None
                
            print(f"   ✓ 선택된 파일: {Path(file_path).name}")
            
        except Exception as e:
            # Fallback to manual input
            print(f"   ⚠️  GUI 파일 선택 실패: {e}")
            print("   수동으로 파일 경로를 입력하세요:")
            file_path = input("   파일 경로: ").strip()
            
            if not file_path:
                print("   ⚠️  파일 경로가 입력되지 않았습니다.")
                return None, None
        
        # Design style input
        print("\n🎨 Step 2: 디자인 스타일 선택")
        print("\n   추천 스타일:")
        print("   1. Cyberpunk Neon - 사이버펑크 네온 (어두운 배경, 핑크/시안)")
        print("   2. Corporate Professional - 기업용 전문가 (흰색 배경, 네이비 블루)")
        print("   3. Minimalist Modern - 미니멀 모던 (깔끔한 흰색, 회색 강조)")
        print("   4. Nature Organic - 자연 유기적 (어스톤, 녹색/갈색)")
        print("   5. Custom - 직접 입력")
        
        style_choice = input("\n   선택 (1-5) 또는 Enter로 기본값(1): ").strip()
        
        style_presets = {
            "1": "Cyberpunk Neon Style. Dark background (#0a0e27), Glitch font effects, Pink (#ff006e) & Cyan (#00f5ff) accent colors, Neon glow effects, Futuristic grid patterns.",
            "2": "Corporate Professional Style. Clean white background (#ffffff), Navy blue (#1e3a8a) primary color, Light gray (#f3f4f6) accents, Sans-serif fonts (Inter, Roboto), Subtle shadows and rounded corners.",
            "3": "Minimalist Modern Style. Clean white background, Light gray (#e5e7eb) accents, Subtle shadows, Sans-serif fonts, Maximum whitespace, Simple and elegant.",
            "4": "Nature Organic Style. Earth tones, Green (#2d6a4f) and Brown (#8b4513) palette, Soft shadows, Natural textures, Organic shapes and curves.",
        }
        
        if style_choice in style_presets:
            design_style = style_presets[style_choice]
            print(f"   ✓ 선택된 스타일: {design_style.split('.')[0]}")
        elif style_choice == "5":
            print("\n   커스텀 디자인 스타일을 입력하세요:")
            print("   (예: Dark background, Purple colors, Bold fonts)")
            design_style = input("   스타일: ").strip()
            if not design_style:
                design_style = style_presets["1"]
                print("   ⚠️  입력 없음. 기본 스타일 사용.")
        else:
            design_style = style_presets["1"]
            print(f"   ✓ 기본 스타일 사용: Cyberpunk Neon")
        
        print("\n" + "=" * 60)
        return file_path, design_style

    def run(self):
        """Execute the complete pipeline: Ingest → Plan → Build"""
        try:
            # Get inputs (interactive or from config)
            if self.interactive:
                input_path, style_prompt = self._get_interactive_inputs()
                if not input_path or not style_prompt:
                    self.logger.error("❌ Interactive input cancelled or incomplete")
                    return
            else:
                input_path = self.config.get('target_file')
                style_prompt = self.config.get('design_style')
                
                if not input_path or not style_prompt:
                    self.logger.error("❌ Missing target_file or design_style in config.json")
                    return
            
            self.logger.info(f"\n📂 Input File: {input_path}")
            self.logger.info(f"🎨 Design Style: {style_prompt[:80]}...\n")
            
            # Phase 1: Ingest
            self.logger.info("Phase 1: Data Ingestion")
            self.logger.info("-" * 40)
            csv_file = self.ingest_data(input_path)
            if not csv_file:
                self.logger.error("❌ Data ingestion failed")
                return
            
            # Phase 2: Plan
            self.logger.info("\nPhase 2: Dashboard Planning")
            self.logger.info("-" * 40)
            plan = self.plan_dashboard(csv_file)
            
            # Phase 3: Build
            self.logger.info("\nPhase 3: Dashboard Building")
            self.logger.info("-" * 40)
            self.build_dashboard(csv_file, plan, style_prompt)
            
            self.logger.info("\n" + "=" * 60)
            self.logger.info("✨ Pipeline Complete!")
            self.logger.info("=" * 60)
            
        except KeyError as e:
            self.logger.error(f"Missing configuration key: {e}")
            raise
        except Exception as e:
            self.logger.error(f"Pipeline failed: {e}")
            raise

    def ingest_data(self, file_path):
        """Ingest data from file (auto-detect type)
        
        Supports:
        - Images: .jpg, .jpeg, .png, .webp → Vision AI extraction
        - CSV: .csv → Direct passthrough
        
        Args:
            file_path: Path to input file
            
        Returns:
            Path to CSV file (str) or None if failed
        """
        # Resolve path relative to project root
        if not os.path.isabs(file_path):
            file_path = self.project_root / file_path
        else:
            file_path = Path(file_path)
        
        if not file_path.exists():
            self.logger.error(f"File not found: {file_path}")
            return None
        
        ext = file_path.suffix.lower()
        self.logger.info(f"👁️  Processing: {file_path.name}")
        self.logger.info(f"📋 File type: {ext}")

        if ext in ['.jpg', '.jpeg', '.png', '.webp']:
            return self._image_to_csv(file_path)
        elif ext == '.csv':
            self.logger.info("✓ CSV file detected, using directly")
            return str(file_path)
        else:
            self.logger.error(f"Unsupported file type: {ext}")
            self.logger.error("Supported: .jpg, .jpeg, .png, .webp, .csv")
            return None

    def _image_to_csv(self, image_path):
        """Convert image to CSV using Vision AI
        
        Args:
            image_path: Path to image file
            
        Returns:
            Path to generated CSV file (str) or None if failed
        """
        try:
            self.logger.info("🔍 Extracting table data from image...")
            
            # Open image with PIL
            img = Image.open(image_path)
            
            # Vision AI prompt for table extraction
            prompt = (
                "Extract all tabular data from this image into a JSON list of objects. "
                "Each object should represent one row with consistent keys. "
                "Return ONLY the JSON array, no markdown formatting, no explanation."
            )
            
            # Use model with image
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content([prompt, img])
            
            # Clean response
            json_str = response.text.strip()
            json_str = json_str.replace("```json", "").replace("```", "").strip()
            
            # Parse and convert to DataFrame
            data = json.loads(json_str)
            df = pd.DataFrame(data)
            
            self.logger.info(f"✓ Extracted {len(df)} rows, {len(df.columns)} columns")
            self.logger.info(f"  Columns: {', '.join(df.columns)}")
            
            # Save to CSV (preserve original filename)
            base_name = image_path.stem
            output_dir = self.project_root / "output"
            output_dir.mkdir(exist_ok=True)
            out_csv = output_dir / f"{base_name}_data.csv"
            
            df.to_csv(out_csv, index=False, encoding='utf-8-sig')
            self.logger.info(f"✓ Saved to: output/{out_csv.name}")
            
            return str(out_csv)
            
        except json.JSONDecodeError as e:
            self.logger.error(f"Failed to parse AI response as JSON: {e}")
            self.logger.error(f"Response: {response.text[:200]}...")
            return None
        except Exception as e:
            self.logger.error(f"Image conversion failed: {e}")
            return None

    def plan_dashboard(self, csv_path):
        """Plan dashboard charts using AI analysis
        
        Args:
            csv_path: Path to CSV file
            
        Returns:
            List of chart specifications (list of dicts)
        """
        try:
            df = pd.read_csv(csv_path)
            cols = list(df.columns)
            
            self.logger.info(f"📊 Analyzing data structure...")
            self.logger.info(f"  Columns: {', '.join(cols)}")
            
            # AI prompt for chart recommendations
            prompt = f"""
            Analyze these data columns and suggest 4 effective charts for visualization.
            Columns: {cols}
            
            Return a JSON array of chart objects with this structure:
            [
              {{"type": "bar|line|pie|scatter", "title": "Chart Title", "x": "column_name", "y": "column_name"}},
              ...
            ]
            
            Return ONLY the JSON array, no markdown, no explanation.
            """
            
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(prompt)
            
            # Clean and parse response
            json_str = response.text.strip()
            json_str = json_str.replace("```json", "").replace("```", "").strip()
            
            plan = json.loads(json_str)
            
            self.logger.info(f"✓ Generated plan for {len(plan)} charts:")
            for i, chart in enumerate(plan, 1):
                self.logger.info(f"  {i}. {chart.get('type', 'unknown').upper()}: {chart.get('title', 'Untitled')}")
            
            return plan
            
        except Exception as e:
            self.logger.warning(f"Chart planning failed: {e}")
            self.logger.info("Using default chart plan")
            return []

    def build_dashboard(self, csv_path, chart_plan, style_prompt):
        """Build HTML dashboard with embedded data
        
        Args:
            csv_path: Path to CSV file
            chart_plan: List of chart specifications
            style_prompt: Natural language style description
        """
        try:
            # Read CSV data
            with open(csv_path, 'r', encoding='utf-8-sig') as f:
                raw_csv = f.read()
            
            # Escape for JavaScript embedding
            raw_csv = raw_csv.replace('`', '').replace('\\', '\\\\')
            
            self.logger.info("🎨 Generating dashboard HTML...")
            
            # AI prompt for HTML generation
            prompt = f"""
            Create a single-file HTML dashboard with these requirements:
            
            STYLE: {style_prompt}
            
            CHARTS: {json.dumps(chart_plan, indent=2)}
            
            REQUIREMENTS:
            - Use Chart.js for visualizations (CDN)
            - Parse data from embedded CSV in variable: const rawCsvData
            - Fully responsive design
            - Modern, premium aesthetics
            - Include title, charts grid, and data table
            - All CSS and JS must be inline (single file)
            - Use the exact style described above
            
            Return ONLY the complete HTML code, no markdown formatting, no explanation.
            Start with <!DOCTYPE html>
            """
            
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(prompt)
            
            # Clean response
            final_html = response.text.strip()
            final_html = final_html.replace("```html", "").replace("```", "").strip()
            
            # Inject CSV data
            final_html = final_html.replace(
                "const rawCsvData",
                f"const rawCsvData = `{raw_csv}`;\n//"
            )
            
            # Determine output filename
            base_name = Path(csv_path).stem.replace("_data", "")
            output_dir = self.project_root / "output"; output_dir.mkdir(exist_ok=True); output_file = output_dir / f"{base_name}_dashboard.html"
            
            # Write to file
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(final_html)
            
            self.logger.info(f"✓ Dashboard created: output/{output_file.name}")
            self.logger.info(f"  File size: {len(final_html):,} bytes")
            self.logger.info(f"\n🌐 Open in browser: {output_file}")
            
        except Exception as e:
            self.logger.error(f"Dashboard building failed: {e}")
            raise


if __name__ == "__main__":
    import sys
    
    # Check for interactive mode flag
    interactive = "--interactive" in sys.argv or "-i" in sys.argv
    
    if interactive:
        print("\n🚀 Starting Antigravity Engine in Interactive Mode...")
        engine = AntigravityEngine(interactive=True)
    else:
        engine = AntigravityEngine()
    
    engine.run()

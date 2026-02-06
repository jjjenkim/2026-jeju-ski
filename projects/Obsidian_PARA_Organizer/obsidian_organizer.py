#!/usr/bin/env python3
"""
Obsidian_PARA_Organizer v3.1
Local keyword-based file classification (0 token cost)
Archive: YYYY-MM format | MOC: Mind Map + Mermaid
"""

import os
import re
import shutil
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict


class Config:
    """Load configuration from config.txt"""
    def __init__(self, config_path="config.txt"):
        self.config = {}
        self.load(config_path)

    def load(self, path):
        if not os.path.exists(path):
            raise FileNotFoundError(f"Config file not found: {path}")

        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue

                if '=' in line:
                    key, value = line.split('=', 1)
                    # Strip inline comments
                    value = value.split('#')[0].strip()
                    self.config[key.strip()] = value

    def get(self, key, default=None):
        return self.config.get(key, default)

    def get_list(self, key):
        value = self.get(key, "")
        return [v.strip() for v in value.split(',') if v.strip()]

    def get_bool(self, key, default=False):
        value = self.get(key, str(default)).lower()
        return value in ('true', 'yes', '1')

    def get_int(self, key, default=0):
        try:
            return int(self.get(key, default))
        except ValueError:
            return default


class ObsidianOrganizer:
    def __init__(self, config_path="config.txt"):
        self.config = Config(config_path)
        self.input_folder = Path(self.config.get("INPUT_FOLDER"))
        self.output_folder = Path(self.config.get("OUTPUT_FOLDER"))

        # Keywords
        self.keywords = {
            "Projects": self.config.get_list("KEYWORDS_PROJECTS"),
            "Work": self.config.get_list("KEYWORDS_WORK"),
            "Personal": self.config.get_list("KEYWORDS_PERSONAL"),
            "Knowledge": self.config.get_list("KEYWORDS_KNOWLEDGE")
        }

        # Settings
        self.fallback_days = self.config.get_int("FALLBACK_DAYS", 7)
        self.fallback_link_count = self.config.get_int("FALLBACK_LINK_COUNT", 5)
        self.archive_threshold = self.config.get_int("ARCHIVE_THRESHOLD_YEARS", 2)
        self.moc_min_links = self.config.get_int("MOC_MIN_LINKS", 3)

        # Options
        self.auto_move = self.config.get_bool("AUTO_MOVE", False)
        self.create_moc = self.config.get_bool("CREATE_MOC", True)
        self.create_dashboard = self.config.get_bool("CREATE_DASHBOARD", True)
        self.dry_run = self.config.get_bool("DRY_RUN", False)
        self.verbose = self.config.get_bool("VERBOSE", True)

        # Statistics
        self.stats = defaultdict(int)
        self.all_files_data = []  # Store all file metadata for MOC

    def log(self, message):
        if self.verbose:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

    def read_file(self, filepath):
        """Read file content with UTF-8 encoding"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            self.log(f"Error reading {filepath}: {e}")
            return ""

    def count_keywords(self, content, keywords):
        """Count keyword occurrences (case-insensitive)"""
        content_lower = content.lower()
        count = 0
        for keyword in keywords:
            count += content_lower.count(keyword.lower())
        return count

    def extract_links(self, content):
        """Extract [[wikilinks]] from content"""
        pattern = r'\[\[([^\]]+)\]\]'
        return re.findall(pattern, content)

    def get_file_age_days(self, filepath):
        """Get file age in days based on creation time"""
        try:
            stat = os.stat(filepath)
            created = datetime.fromtimestamp(stat.st_ctime)
            return (datetime.now() - created).days
        except:
            return 0

    def get_file_year_month(self, filepath):
        """Get file creation year-month in YYYY-MM format"""
        try:
            stat = os.stat(filepath)
            created = datetime.fromtimestamp(stat.st_ctime)
            return created.strftime("%Y-%m")
        except:
            return datetime.now().strftime("%Y-%m")

    def classify_file(self, filepath):
        """Classify file based on keyword scoring"""
        content = self.read_file(filepath)

        # Calculate scores
        scores = {}
        for category, keywords in self.keywords.items():
            scores[category] = self.count_keywords(content, keywords)

        max_score = max(scores.values())

        if max_score > 0:
            # Return category with highest score
            # Priority: Projects > Work > Personal > Knowledge
            priority = ["Projects", "Work", "Personal", "Knowledge"]
            for cat in priority:
                if scores[cat] == max_score:
                    return cat

        # Fallback
        return self.fallback_classify(filepath, content)

    def fallback_classify(self, filepath, content):
        """Fallback classification for zero-score files"""
        age_days = self.get_file_age_days(filepath)
        links = self.extract_links(content)
        link_count = len(links)

        # Recent files (< fallback_days) → Knowledge
        if age_days <= self.fallback_days:
            return "Knowledge"

        # High link density (fallback_link_count+ links) → Knowledge
        if link_count >= self.fallback_link_count:
            return "Knowledge"

        # Default → Knowledge
        return "Knowledge"

    def check_archive(self, filepath):
        """Check if file should be archived (YYYY-MM format)"""
        year_month = self.get_file_year_month(filepath)
        year = int(year_month.split('-')[0])
        current_year = datetime.now().year

        if current_year - year >= self.archive_threshold:
            return f"Archive/{year_month}"
        return None

    def organize_files(self):
        """Main organization logic"""
        self.log(f"Starting organization...")
        self.log(f"Input: {self.input_folder}")
        self.log(f"Output: {self.output_folder}")

        if self.dry_run:
            self.log("DRY RUN MODE - No files will be moved")

        # Create output folder structure
        self.create_folder_structure()

        # Process all .md files
        md_files = list(self.input_folder.rglob("*.md"))
        self.log(f"Found {len(md_files)} markdown files")

        for filepath in md_files:
            self.process_file(filepath)

        # Generate MOC
        if self.create_moc:
            self.generate_moc()

        # Generate Dashboard
        if self.create_dashboard:
            self.generate_dashboard()

        self.print_summary()

    def create_folder_structure(self):
        """Create output folder structure"""
        folders = [
            "Projects",
            "Work",
            "Personal",
            "Knowledge",
            "Archive",
            "_MOC"
        ]

        for folder in folders:
            path = self.output_folder / folder
            if not self.dry_run:
                path.mkdir(parents=True, exist_ok=True)
            self.log(f"Created: {path}")

    def process_file(self, filepath):
        """Process single file"""
        try:
            # Check archive first
            archive_path = self.check_archive(filepath)
            if archive_path:
                category = archive_path
            else:
                category = self.classify_file(filepath)

            # Build destination path
            dest_folder = self.output_folder / category
            dest_file = dest_folder / filepath.name

            # Handle duplicates
            counter = 1
            while dest_file.exists():
                stem = filepath.stem
                suffix = filepath.suffix
                dest_file = dest_folder / f"{stem}_{counter}{suffix}"
                counter += 1

            # Copy or move file
            if not self.dry_run:
                dest_folder.mkdir(parents=True, exist_ok=True)
                if self.auto_move:
                    shutil.move(str(filepath), str(dest_file))
                else:
                    shutil.copy2(str(filepath), str(dest_file))

            self.stats[category] += 1

            # Store file data for MOC
            content = self.read_file(filepath)
            links = self.extract_links(content)
            
            file_data = {
                'name': filepath.stem,
                'filename': filepath.name,
                'category': category,
                'links': links,
                'link_count': len(links)
            }
            self.all_files_data.append(file_data)

            self.log(f"[{category}] {filepath.name}")

        except Exception as e:
            self.log(f"Error processing {filepath}: {e}")

    def generate_moc(self):
        """Generate enhanced Map of Content with bidirectional links, mind maps, and Mermaid graphs"""
        self.log("Generating enhanced MOC v3.1...")

        # Build bidirectional link graph
        forward_links = {}  # A -> [B, C, D]
        backward_links = defaultdict(list)  # B <- [A]
        
        for file_data in self.all_files_data:
            name = file_data['name']
            links = file_data['links']
            forward_links[name] = links
            
            # Build reverse links
            for link in links:
                # Clean link (remove aliases)
                clean_link = link.split('|')[0].strip()
                backward_links[clean_link].append(name)
        
        # Calculate connectivity scores
        connectivity = {}
        for file_data in self.all_files_data:
            name = file_data['name']
            outgoing = len(forward_links.get(name, []))
            incoming = len(backward_links.get(name, []))
            connectivity[name] = {
                'outgoing': outgoing,
                'incoming': incoming,
                'total': outgoing + incoming,
                'category': file_data['category']
            }
        
        # Find hub notes (top 10 by total connectivity)
        hubs = sorted(connectivity.items(), key=lambda x: x[1]['total'], reverse=True)[:10]
        
        # Find isolated notes (0 connections)
        isolated = [name for name, conn in connectivity.items() if conn['total'] == 0]
        
        # Category clusters (top 3 per category)
        category_hubs = defaultdict(list)
        for name, conn in sorted(connectivity.items(), key=lambda x: x[1]['total'], reverse=True):
            cat = conn['category']
            if len(category_hubs[cat]) < 3 and conn['total'] > 0:
                category_hubs[cat].append((name, conn['total']))
        
        # Build MOC content
        total_notes = len(self.all_files_data)
        total_connections = sum(conn['total'] for conn in connectivity.values()) // 2  # Divide by 2 to avoid double counting
        
        moc_content = f"""# 🗺️ Knowledge Map
Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M')}

## 📊 Network Overview

- **Total Notes**: {total_notes}
- **Total Connections**: {total_connections}
- **Hub Notes** (Top 10): {len(hubs)}
- **Isolated Notes**: {len(isolated)} ({len(isolated)/max(total_notes,1)*100:.1f}%)

---

## 🌳 Connection Tree (Mind Map)

"""
        
        # Mind map for each hub
        for i, (hub_name, hub_conn) in enumerate(hubs, 1):
            outgoing_links = forward_links.get(hub_name, [])
            incoming_links = backward_links.get(hub_name, [])
            
            moc_content += f"### {i}. [[{hub_name}]] ({hub_conn['total']} connections)\n\n"
            
            if outgoing_links:
                moc_content += "**Links to:**\n"
                for link in outgoing_links[:5]:  # Show top 5
                    clean_link = link.split('|')[0].strip()
                    link_conn = connectivity.get(clean_link, {}).get('total', 0)
                    if link_conn > 0:
                        moc_content += f"  - [[{clean_link}]] → ({link_conn} connections)\n"
                    else:
                        moc_content += f"  - [[{clean_link}]]\n"
                if len(outgoing_links) > 5:
                    moc_content += f"  - ... and {len(outgoing_links) - 5} more\n"
                moc_content += "\n"
            
            if incoming_links:
                moc_content += "**Linked from:**\n"
                for link in incoming_links[:5]:  # Show top 5
                    moc_content += f"  - [[{link}]]\n"
                if len(incoming_links) > 5:
                    moc_content += f"  - ... and {len(incoming_links) - 5} more\n"
                moc_content += "\n"
            
            moc_content += "---\n\n"
        
        # Mermaid graph (top 5 hubs)
        moc_content += "## 🎨 Visual Graph (Mermaid)\n\n```mermaid\ngraph TD\n"
        
        top_5_hubs = [name for name, _ in hubs[:5]]
        node_map = {name: f"N{i}" for i, name in enumerate(top_5_hubs)}
        
        for hub_name in top_5_hubs:
            node_id = node_map[hub_name]
            # Escape special characters for Mermaid
            safe_name = hub_name.replace('"', "'").replace('[', '').replace(']', '')
            moc_content += f'    {node_id}["{safe_name}"]\n'
        
        # Add edges between top hubs
        for hub_name in top_5_hubs:
            outgoing = forward_links.get(hub_name, [])
            for link in outgoing:
                clean_link = link.split('|')[0].strip()
                if clean_link in node_map:
                    moc_content += f"    {node_map[hub_name]} --> {node_map[clean_link]}\n"
        
        moc_content += "```\n\n---\n\n"
        
        # Category clusters
        moc_content += "## 📁 Category Clusters\n\n"
        
        for category in ["Projects", "Work", "Personal", "Knowledge"]:
            if category in category_hubs and category_hubs[category]:
                moc_content += f"### {category}\n"
                for name, conn_count in category_hubs[category]:
                    moc_content += f"- [[{name}]] ({conn_count} connections)\n"
                moc_content += "\n"
        
        moc_content += "---\n\n"
        
        # Isolated notes warning
        if isolated:
            moc_content += f"## ⚠️ Isolated Notes ({len(isolated)})\n\n"
            moc_content += "These notes have no connections:\n\n"
            for name in isolated[:20]:  # Show first 20
                moc_content += f"- [[{name}]]\n"
            if len(isolated) > 20:
                moc_content += f"\n... and {len(isolated) - 20} more\n"
        
        # Save MOC
        moc_path = self.output_folder / "_MOC" / "Knowledge_Map.md"
        if not self.dry_run:
            moc_path.parent.mkdir(parents=True, exist_ok=True)
            moc_path.write_text(moc_content, encoding='utf-8')

        self.log(f"MOC saved: {moc_path}")

    def generate_dashboard(self):
        """Generate dashboard"""
        self.log("Generating Dashboard...")

        total_files = sum(self.stats.values())

        dashboard_content = f"""# Dashboard
Last Update: {datetime.now().strftime('%Y-%m-%d %H:%M')}

## 📈 Statistics

| 항목 | 개수 |
|------|------|
| 총 파일 | {total_files} |
| 분류 완료 | {total_files} (100%) |
| 미분류 | 0 |

## 📂 폴더별 분포

"""

        for category, count in sorted(self.stats.items()):
            dashboard_content += f"- **{category}**: {count} files\n"

        dashboard_content += f"""

## 🔗 연결성 높은 노트 (Top 5)

"""

        # Get top 5 by connectivity
        connectivity = {}
        for file_data in self.all_files_data:
            connectivity[file_data['name']] = file_data['link_count']
        
        sorted_files = sorted(connectivity.items(), key=lambda x: x[1], reverse=True)[:5]

        for i, (filename, link_count) in enumerate(sorted_files, 1):
            dashboard_content += f"{i}. [[{filename}]] ({link_count} links)\n"

        dashboard_path = self.output_folder / "Dashboard.md"
        if not self.dry_run:
            dashboard_path.write_text(dashboard_content, encoding='utf-8')

        self.log(f"Dashboard saved: {dashboard_path}")

    def print_summary(self):
        """Print summary"""
        print("\n" + "="*60)
        print("✅ Organization Complete!")
        print("="*60)
        print(f"Total files processed: {sum(self.stats.values())}")
        print("\nDistribution:")
        for category, count in sorted(self.stats.items()):
            print(f"  {category:15s}: {count:3d} files")
        print("="*60)


def main():
    try:
        organizer = ObsidianOrganizer("config.txt")
        organizer.organize_files()
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Please create config.txt with INPUT_FOLDER and OUTPUT_FOLDER")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Antigravity Project Generator
Automated project creation with standard structure
"""

import json
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, Any


class ProjectGenerator:
    """Generate new projects in 2026_Antigravity workspace"""
    
    def __init__(self, workspace: str = "/Users/jenkim/Downloads/2026_Antigravity"):
        """
        Initialize project generator
        
        Args:
            workspace: Root directory of the workspace
        """
        self.workspace = Path(workspace)
        self.projects_dir = self.workspace / "projects"
        self.projects_dir.mkdir(exist_ok=True)

    def create_project(
        self, 
        name: str, 
        project_type: str = "python",
        description: Optional[str] = None
    ) -> Path:
        """
        Create a new project with standard structure
        
        Args:
            name: Project name
            project_type: Type of project (python, typescript, obsidian)
            description: Optional project description
            
        Returns:
            Path to created project directory
            
        Raises:
            ValueError: If project already exists
        """
        date = datetime.now().strftime("%Y%m%d")
        project_dir = self.projects_dir / f"{name}_{date}"
        
        if project_dir.exists():
            raise ValueError(f"Project already exists: {project_dir}")
        
        print(f"Creating project: {project_dir}")
        
        # Create directory structure
        self._create_directories(project_dir)
        
        # Generate files based on project type
        if project_type == "python":
            self._create_python_project(project_dir, name, description)
        elif project_type == "typescript":
            self._create_typescript_project(project_dir, name, description)
        elif project_type == "obsidian":
            self._create_obsidian_project(project_dir, name, description)
        else:
            raise ValueError(f"Unknown project type: {project_type}")
        
        print(f"✓ Project created successfully: {project_dir}")
        return project_dir

    def _create_directories(self, project_dir: Path) -> None:
        """Create standard directory structure"""
        dirs = [
            'src',
            'data/raw',
            'data/processed',
            'data/cache',
            'logs',
            'archive',
            'tests'
        ]
        
        for d in dirs:
            (project_dir / d).mkdir(parents=True, exist_ok=True)

    def _create_python_project(
        self, 
        project_dir: Path, 
        name: str,
        description: Optional[str]
    ) -> None:
        """Create Python project files"""
        
        # requirements.txt
        requirements = """# Python dependencies
asyncio
pathlib
"""
        (project_dir / "requirements.txt").write_text(requirements)
        
        # config.json
        config = {
            "project_name": name,
            "version": "1.0.0",
            "description": description or f"{name} project",
            "created": datetime.now().isoformat(),
            "max_concurrent": 5,
            "max_retries": 5,
            "cache_ttl": 3600,
            "cache_max_size": 1000
        }
        (project_dir / "config.json").write_text(
            json.dumps(config, indent=2, ensure_ascii=False)
        )
        
        # run.command
        run_script = f"""#!/bin/bash
# {name} - Run Script
cd "$(dirname "$0")"

echo "Setting up {name}..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run main script
echo "Running {name}..."
python src/main.py

# Keep terminal open
read -p "Press Enter to exit..."
"""
        run_file = project_dir / "run.command"
        run_file.write_text(run_script)
        run_file.chmod(0o755)
        
        # README.md
        readme = f"""# {name}

{description or f"Project created on {datetime.now().strftime('%Y-%m-%d')}"}

## Setup

Double-click `run.command` or run in terminal:

```bash
./run.command
```

## Structure

```
{name}/
├── src/              # Source code
├── data/             # Data files
│   ├── raw/          # Original data
│   ├── processed/    # Cleaned data
│   └── cache/        # Cached results
├── logs/             # Application logs
├── archive/          # Versioned backups
├── tests/            # Test files
├── run.command       # Executable launcher
├── README.md         # This file
├── requirements.txt  # Python dependencies
└── config.json       # Configuration
```

## Configuration

Edit `config.json` to customize settings:

- `max_concurrent`: Maximum parallel tasks (default: 5)
- `max_retries`: Maximum retry attempts (default: 5)
- `cache_ttl`: Cache time-to-live in seconds (default: 3600)
- `cache_max_size`: Maximum cache entries (default: 1000)

## Development

```bash
# Activate virtual environment
source venv/bin/activate

# Run main script
python src/main.py

# Run tests
python -m pytest tests/
```

## Logs

Application logs are stored in `logs/`:
- `app_YYYYMMDD.log` - Application logs
- `error_YYYYMMDD.log` - Error logs

## Archive

Previous versions are automatically backed up to `archive/` with timestamps.
"""
        (project_dir / "README.md").write_text(readme)
        
        # main.py
        main_py = f"""#!/usr/bin/env python3
\"\"\"
{name}
{description or ''}

Created: {datetime.now().strftime('%Y-%m-%d')}
\"\"\"

import json
import sys
from pathlib import Path

# Add shared utilities to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "shared"))

from orchestrator import AntigravityOrchestrator
from corrector import AntigravityCorrector
from cache import AntigravityCache


def load_config():
    \"\"\"Load project configuration\"\"\"
    config_path = Path(__file__).parent.parent / "config.json"
    return json.loads(config_path.read_text())


def main():
    \"\"\"Main entry point\"\"\"
    config = load_config()
    print(f"Starting {{config['project_name']}}...")
    print(f"Version: {{config['version']}}")
    
    # Initialize utilities
    cache = AntigravityCache()
    corrector = AntigravityCorrector()
    
    # Your code here
    print("\\nProject is ready!")
    print(f"Cache stats: {{cache.stats()}}")


if __name__ == "__main__":
    main()
"""
        (project_dir / "src" / "main.py").write_text(main_py)
        
        # .gitignore
        gitignore = """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/

# Data
data/raw/*
data/processed/*
data/cache/*
!data/raw/.gitkeep
!data/processed/.gitkeep
!data/cache/.gitkeep

# Logs
logs/*
!logs/.gitkeep

# Archive
archive/*
!archive/.gitkeep

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store
"""
        (project_dir / ".gitignore").write_text(gitignore)
        
        # Create .gitkeep files
        for d in ['data/raw', 'data/processed', 'data/cache', 'logs', 'archive']:
            (project_dir / d / '.gitkeep').touch()

    def _create_typescript_project(
        self, 
        project_dir: Path, 
        name: str,
        description: Optional[str]
    ) -> None:
        """Create TypeScript project files"""
        # TODO: Implement TypeScript project template
        print("TypeScript project template not yet implemented")

    def _create_obsidian_project(
        self, 
        project_dir: Path, 
        name: str,
        description: Optional[str]
    ) -> None:
        """Create Obsidian plugin project files"""
        # TODO: Implement Obsidian project template
        print("Obsidian project template not yet implemented")


# Example usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python project_generator.py <project_name> [project_type]")
        print("Project types: python, typescript, obsidian")
        sys.exit(1)
    
    name = sys.argv[1]
    project_type = sys.argv[2] if len(sys.argv) > 2 else "python"
    
    gen = ProjectGenerator()
    
    try:
        project_path = gen.create_project(name, project_type)
        print(f"\n✓ Project created: {project_path}")
        print(f"\nNext steps:")
        print(f"  cd {project_path}")
        print(f"  ./run.command")
    except ValueError as e:
        print(f"Error: {e}")
        sys.exit(1)

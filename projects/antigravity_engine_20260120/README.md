# Antigravity Engine

> 🇰🇷 **한국어 버전**: [README_KR.md](README_KR.md)를 참조하세요

**Created:** 2026-01-20  
**Version:** 1.0.0

An intelligent data visualization engine that automatically converts images or CSV files into beautiful, interactive HTML dashboards using Google's Gemini AI.

## ✨ Features

- 🖼️ **Image-to-Dashboard**: Extract tables from images (screenshots, photos) and visualize them
- 📊 **CSV-to-Dashboard**: Transform CSV data into interactive charts
- 🤖 **AI-Powered**: Gemini AI analyzes your data and recommends optimal visualizations
- 🎨 **Customizable Design**: Natural language style descriptions (e.g., "Cyberpunk Neon", "Minimalist Corporate")
- 📦 **Single-File Output**: Self-contained HTML dashboards (no external dependencies)
- ⚡ **Zero Configuration**: Just add your API key and run

## 🚀 Quick Start

### 1. Get Your API Key

Get a free Google Gemini API key at: https://makersuite.google.com/app/apikey

### 2. Configure

Edit `config.json` and add your API key:

```json
{
  "google_api_key": "YOUR_ACTUAL_API_KEY",
  "target_file": "data/raw/your_file.csv",
  "design_style": "Modern Minimalist Style"
}
```

### 3. Run

Double-click `run.command` or run in terminal:

```bash
./run.command
```

## 📁 Project Structure

```
antigravity_engine_20260120/
├── src/
│   └── antigravity_engine.py    # Main engine
├── data/
│   ├── raw/                      # Input files (images, CSV)
│   ├── processed/                # Intermediate CSV files
│   └── cache/                    # Cached results
├── logs/                         # Application logs
├── archive/                      # Versioned backups
├── config.json                   # Configuration
├── requirements.txt              # Python dependencies
├── run.command                   # Executable launcher
└── README.md                     # This file
```

## 🎯 Usage Examples

### Example 1: Process a CSV File

```json
{
  "google_api_key": "your-key-here",
  "target_file": "data/raw/sales_data.csv",
  "design_style": "Corporate Professional Style. Clean white background, Blue accent colors, Sans-serif fonts."
}
```

**Output:** `sales_data_dashboard.html`

### Example 2: Process an Image

```json
{
  "google_api_key": "your-key-here",
  "target_file": "data/raw/table_screenshot.png",
  "design_style": "Cyberpunk Neon Style. Dark background, Pink & Cyan colors, Glitch effects."
}
```

**Output:** 
- `table_screenshot_data.csv` (extracted data)
- `table_screenshot_dashboard.html` (final dashboard)

### Example 3: Custom Style

```json
{
  "google_api_key": "your-key-here",
  "target_file": "data/raw/metrics.csv",
  "design_style": "Nature-Inspired Style. Earth tones, Organic shapes, Green (#2d6a4f) and Brown (#8b4513) palette, Soft shadows."
}
```

## 🎨 Design Style Examples

The `design_style` parameter accepts natural language descriptions. Here are some examples:

- **Cyberpunk Neon**: Dark background, Pink & Cyan colors, Glitch effects, Futuristic grid
- **Minimalist Corporate**: Clean white, Blue accents, Sans-serif fonts, Subtle shadows
- **Retro 80s**: Gradient backgrounds, Purple & Orange, Geometric patterns, Bold typography
- **Nature Organic**: Earth tones, Green & Brown, Soft curves, Natural textures
- **High Contrast**: Black & White, Bold typography, Sharp edges, Maximum readability

## 🔧 Configuration Options

### `google_api_key` (required)
Your Google Gemini API key. Get one at: https://makersuite.google.com/app/apikey

### `target_file` (required)
Path to input file. Supports:
- **Images**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **CSV**: `.csv`

Can be absolute path or relative to project root.

### `design_style` (required)
Natural language description of desired dashboard aesthetic. Be specific about:
- Color palette (hex codes or color names)
- Typography preferences
- Visual effects (shadows, gradients, animations)
- Overall mood/theme

## 🔍 How It Works

### Phase 1: Ingest
- **Auto-detect** file type from extension
- **Images**: Use Gemini Vision AI to extract table data → JSON → CSV
- **CSV**: Use directly

### Phase 2: Plan
- **Analyze** CSV column structure
- **AI recommends** optimal chart types (bar, line, pie, scatter)
- **Generate** chart specifications

### Phase 3: Build
- **Generate** single-file HTML dashboard
- **Embed** CSV data directly in HTML
- **Apply** custom styling from `design_style`
- **Include** Chart.js for interactive visualizations

## 📊 Output

The engine generates:

1. **Intermediate CSV** (for image inputs): `{filename}_data.csv`
2. **Final Dashboard**: `{filename}_dashboard.html`
   - Self-contained (no external files needed)
   - Interactive charts with Chart.js
   - Responsive design
   - Custom styling applied

## 🐛 Troubleshooting

### "API key not configured"
- Make sure you've replaced `YOUR_API_KEY_HERE` with your actual API key in `config.json`

### "File not found"
- Check that `target_file` path is correct
- Use relative path from project root or absolute path

### "Unsupported file type"
- Only `.jpg`, `.jpeg`, `.png`, `.webp`, `.csv` are supported
- Check file extension is lowercase

### "Failed to parse AI response"
- The AI response might be malformed
- Try running again (AI responses can vary)
- Check logs in `logs/` directory for details

### Image extraction not working
- Ensure image contains a clear, readable table
- Try with higher resolution image
- Check that table has clear borders/structure

## 📝 Logs

All operations are logged to `logs/engine_{YYYYMMDD}.log`

Log levels:
- **INFO**: Normal operations
- **WARNING**: Non-critical issues
- **ERROR**: Failed operations

## 🔄 Advanced Usage

### Batch Processing

Create multiple config files and run them sequentially:

```bash
# config_sales.json
python src/antigravity_engine.py config_sales.json

# config_metrics.json
python src/antigravity_engine.py config_metrics.json
```

### Custom Processing

Import the engine in your own scripts:

```python
from src.antigravity_engine import AntigravityEngine

engine = AntigravityEngine("my_config.json")
engine.run()
```

## 🛡️ Best Practices

1. **API Key Security**: Never commit your API key to version control
2. **Image Quality**: Use high-resolution images for better extraction
3. **CSV Format**: Ensure CSV has clear column headers
4. **Style Descriptions**: Be specific about colors, fonts, and effects
5. **Testing**: Test with small datasets first

## 📚 Dependencies

- **google-generativeai**: Gemini AI SDK
- **pandas**: Data manipulation
- **Pillow**: Image processing

All dependencies are installed automatically by `run.command`.

## 🤝 Integration with 2026_Antigravity Workspace

This project follows the ANTIGRAVITY_RULEBOOK standards:

- ✅ Standard directory structure
- ✅ Comprehensive logging
- ✅ Error handling and validation
- ✅ Self-contained execution
- ✅ Configuration-driven design

## 📄 License

Part of the 2026_Antigravity workspace.

## 🆘 Support

For issues or questions:
1. Check the logs in `logs/` directory
2. Review this README
3. Verify your API key is valid
4. Ensure input files are in supported formats

---

**Happy Visualizing! ✨**

# Design Guide (V7 Urban Dimension)

> **Restored Version**: Based on V7 "Cinematic Urban" Implementation.

## 🎨 Color Palette (Urban Neon)

### Primary Colors
- **Empire Blue (Deep)**: `#050A14` (Main Background)
- **Neon Blue (Cyan)**: `#00F0FF` (Highlights, Tech Accents)
- **Neon Red (Hot)**: `#FF0055` (Action, Alerts)
- **Korea Red (Legacy)**: `#C60C30` (Official Badge)
- **Korea Blue (Legacy)**: `#003478` (Official Badge)

### Glassmorphism System
- **Glass Surface**: `rgba(20, 20, 30, 0.65)`
- **Glass Border**: `1px solid rgba(255, 255, 255, 0.1)`
- **Gloss Highlight**: `linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)`
- **Shadow**: `0 25px 50px -12px rgba(0, 0, 0, 0.5)`

## 🖋 Typography
- **Font**: `Inter` (Google Fonts) or `Pretendard`
- **Headings**: Uppercase, Tracking `0.2em` to `0.5em` (Cinematic)
- **Body**: Clean Sans-serif

## 🧩 UI Components

### 1. Urban Glass Card
```css
.card-urban {
  background: var(--glass-surface);
  backdrop-filter: blur(20px);
  border: var(--glass-border);
  box-shadow: var(--shadow);
}
```

### 2. Neon Badge
- **Background**: Black (90% Opacity)
- **Border**: 1px solid Neon Blue (`#00F0FF`)
- **Text**: Neon Blue (`#00F0FF`) with Glow

### 3. Gradient Text
- **Effect**: `linear-gradient(to right, #fff, #aaa)`
- **Blend**: `background-clip: text`

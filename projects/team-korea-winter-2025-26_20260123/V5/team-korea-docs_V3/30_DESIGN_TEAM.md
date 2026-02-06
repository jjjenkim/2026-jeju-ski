# 30_DESIGN_TEAM.md
**Team Korea Winter Dashboard 2025-26 (V3)**
**Visual Identity & User Experience**

---

## 1. Design Concept: "Noir Luxury"

We are abandoning the "Friendly Tech" look for a **"High-Performance Editorial"** aesthetic. Think luxury sports car dashboards, high-end timepieces, and cinematic sci-fi interfaces.

**Keywords**:
-   **Sharp**: High contrast, thin lines (1px), precise geometry.
-   **Deep**: Dark, atmospheric backgrounds. Not just black, but "Void Navy".
-   **Kinetic**: Everything should feel like it has weight and momentum.

---

## 2. The Design System (V3)

### Color Palette (Strict Mode)

| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Dye Black** | `#050505` | Main Background |
| **Void Navy** | `#0B1221` | Card Backgrounds (Secondary) |
| **KOR Red** | `#E61B3F` | **ACCENT ONLY**. Tiny UI elements, active states. |
| **KOR Blue** | `#004A9F` | **ACCENT ONLY**. Secondary indicators. |
| **Steel** | `#94A3B8` | Body Text, borders (inactive). |
| **Chrome** | `#F8FAFC` | Headings, Primary Data. |
| **Ember** | `#FF4D4D` | Critical Alerts / "Hot" Data. |

**Gradient Strategy**:
-   **"Night Ice"**: `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)`
-   **"Red Shift"**: `linear-gradient(90deg, #E61B3F 0%, transparent 100%)` (Used for progress bars)

### Typography

**Headings (Data & Impact)**
-   **Font**: `Teko` or `Oswald` (Google Fonts)
-   **Style**: Uppercase, tight tracking (-0.02em).
-   **Usage**: Scores, Ranks, Section Titles.

**Body (Readability)**
-   **Font**: `Pretendard` (Variable)
-   **Style**: Clean, airy, good line-height (1.6).

### Iconography
-   **Style**: Thin Stroke (1.5px), Sharp corners.
-   **Source**: Lucide React (configured to look sharp) or Custom SVG.
-   **Rule**: **ABSOLUTELY NO EMOJIS**.

---

## 3. Component Architecture

### The "Bento" Grid
The layout rests on a robust CSS Grid wrapper that creates a bento-box feel.
-   **Gap**: 16px (tight).
-   **Cards**: "Glass-over-Metal". Dark semi-transparent background with a very subtle 1px border gradient (Zinc-800 to Zinc-900).

### The "Hero" Card (Athlete)
-   **Image**: Grayscale with "reveal color on hover" effect.
-   **Typography**: Name is massive, spanning the full width.
-   **Stats**: Micro-charts embedded directly into the card (Sparklines).

### The 3D Tilt
Using `framer-motion` or `react-tilt`, cards should subtly lean towards the cursor to create depth. This is a subtle "premium" interaction, not a gimmick.

---

## 4. Motion Guidelines (Framer Motion)

**1. Entrance**
Staggered reveal. Elements slice in from the bottom with a steep ease curve (`easeOutQuart`).

```javascript
/* Motion config reference */
const variants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}
```

**2. Interaction**
-   **Hover**: Immediate response (scale 1.01), brighten border.
-   **Click**: Satisfying "press" (scale 0.98).

---

## 5. Viewport Strategy
-   **Desktop**: Panoramic. Use the width. 3-column layouts.
-   **Mobile**: "Stack & Snap". Vertical feed, highly touch-optimized. Bottom sheet navigation for deep dives.

---

**Design Lead**: Team Korea Creative
**Status**: Tokens Defined. Ready for CSS Implementation.

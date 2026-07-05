---
name: Kinetic Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3b494b'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6a7a7b'
  outline-variant: '#b9cacb'
  surface-tint: '#006970'
  primary: '#006970'
  on-primary: '#ffffff'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#00dbe9'
  secondary: '#5d5e63'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e8'
  on-secondary-container: '#636469'
  tertiary: '#505f76'
  on-tertiary: '#ffffff'
  tertiary-container: '#cadbf5'
  on-tertiary-container: '#506076'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#e2e2e8'
  secondary-fixed-dim: '#c6c6cc'
  on-secondary-fixed: '#1a1c20'
  on-secondary-fixed-variant: '#45474b'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  mono-data:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 16px
  container-max: 1440px
---

## Brand & Style
The design system is engineered for a high-performance B2C ecommerce experience that prioritizes technical clarity and product-led storytelling. The brand personality is clinical yet energetic, balancing a professional corporate foundation with high-octane "electric" accents. 

The aesthetic follows a **Modern Corporate** style with a heavy emphasis on **Modular Grids**. It utilizes a "Hardware UI" approach: clean lines, precise measurements, and a distinct lack of fluff. The goal is to evoke the feeling of a premium technical instrument—reliable, fast, and sophisticated. Visual interest is generated through the tension between expansive whitespace and razor-sharp structural elements.

## Colors
The palette is rooted in a spectrum of "Tech Grays" and "Architectural Whites."

- **Primary (Electric Cyan):** Reserved strictly for interactive triggers, progress indicators, and critical calls to action. It should feel like a light source against the darker grays.
- **Secondary (Deep Obsidian):** Used for typography and structural framing to provide a heavy, grounded contrast.
- **Neutral Surface:** A series of cool-toned grays that define the modular grid and provide a "blueprint" feel to the background.
- **Functional Accents:** Success and error states should maintain the neon-adjacent vibrancy of the primary cyan to ensure visual consistency.

## Typography
The typography system uses **Inter** for its incredible legibility and systematic feel, paired with **Geist** for technical labels and monospaced data points.

- **Headlines:** Use tight letter-spacing and bold weights to create a sense of impact and authority.
- **Body:** Generous line-heights are required to maintain readability amidst technical specifications.
- **Technical Labels:** Small, uppercase Geist labels should be used for categories, SKU numbers, and technical specs to reinforce the "engineered" aesthetic.
- **Alignment:** Stick to a rigid left-alignment for all text blocks to maintain the grid's structural integrity.

## Layout & Spacing
The layout is a **12-column fluid grid** built on a strict 4px baseline.

- **Modular Breaks:** Use subtle 1px borders (in light gray) instead of wide gutters to separate content sections, creating a blueprint or "schematic" look.
- **Product Focal Point:** Product images should span multiple columns (typically 6 or 8 on desktop) to allow for high-resolution technical detail visibility.
- **Desktop:** 64px outer margins to give the content "air" and focus.
- **Mobile:** Reflow to a single column with 16px margins, maintaining the 1px divider lines between vertical modules.

## Elevation & Depth
This design system avoids traditional shadows in favor of **Tonal Layers and Sharp Outlines**.

- **Depth through Borders:** Use 1px solid borders in `#E2E8F0` for containers. When an item is hovered or active, the border shifts to the Primary Cyan or a darker gray.
- **Layering:** High-priority modals or menus use a crisp "pop" effect with a 1px border and a very subtle, 0-blur offset shadow (e.g., 4px 4px 0px black) to maintain the technical, brutalist-lite feel.
- **Backdrop:** Use a slight "faint grid" background pattern (dots or lines) on the lowest neutral layer to reinforce the engineering theme.

## Shapes
The shape language is "Soft-Technical." We use a very subtle **0.25rem (4px)** radius for most components. This is just enough to feel modern and premium without losing the "sharpness" of the technical grid. 

- **Containers:** 4px radius.
- **Buttons:** 4px radius (never pill-shaped).
- **Product Badges:** 2px radius (near-sharp).

## Components
- **Buttons:** Primary buttons are solid Deep Obsidian with White text; on hover, they trigger a Primary Cyan "glow" or border. Secondary buttons are ghost-style with 1px borders.
- **Inputs:** Square-ish fields with Geist-font labels. Active states should use a Primary Cyan bottom-border or focus ring.
- **Cards:** Product cards should be "frameless" until hover. Upon hover, show a 1px border and technical metadata (weight, dimensions, SKU) in the `mono-data` type style.
- **Chips/Badges:** Small, rectangular labels using `label-caps`. Use high-contrast backgrounds (Black on Cyan or White on Black).
- **Technical Specs Table:** A alternating zebra-stripe list with 1px horizontal dividers and Geist-font values for precision.
- **Progress Bars:** Thin, 2px Primary Cyan lines with no rounded ends, emphasizing linear movement.
# S&I Atelier — Design System Tokens

Official brand token specifications for **S&I Atelier** (Luxury Bespoke Furniture & Architectural Interiors).

---

## 1. Brand Essence & Visual Language

- **Tone**: Quiet architectural luxury, understated opulence, gallery-grade craftsmanship.
- **Surface Philosophy**: Deep near-black obsidian & charcoal canvases punctuated by subtle brass metallic borders, warm gold gradients, and generous negative space.
- **RTL-First**: Native right-to-left layout where forward navigation advances leftward (`FaArrowLeft`), and back-navigation points rightward (`FaArrowRight`).

---

## 2. Color System

### 2.1 The Signature Gold Palette (Canonical: `#C4A070`)
*Consolidation Note: Retired legacy `#C5A880` and `#B59362`. Consolidated onto `#C4A070` as the singular brand gold anchor across all storefront and administrative modules.*

| Token Name | Hex Value | Role & Usage Guidance |
| :--- | :--- | :--- |
| `gold-50` | `#FDFAF5` | Ultra-subtle gold tinted background / wash |
| `gold-100` | `#F9F1E7` | Light highlight tint |
| `gold-200` | `#F0DEC8` | Shimmer gradient endpoint, bright metallic edge |
| `gold-300` | `#E3CAA9` | Pricing figures, highlighted metrics, subheadings |
| `gold-400` | `#D4B58C` | Hover state for gold buttons, active link text |
| **`brand-gold` / `gold-500`** | **`#C4A070`** | **Official Brand Accent. Primary CTA background, active borders, brand monogram, key icons** |
| `gold-600` | `#B88F48` | Primary button gradient lower stop, pressed state |
| `gold-700` | `#9E7939` | Deep bronze accent, high-contrast borders on dark |
| `gold-800` | `#7A5D2B` | Deep antique brass gradient stop, dark banner backgrounds |
| `gold-900` | `#59431F` | Dark bronze shadow tone |
| `gold-950` | `#3D2D14` | Deepest brass cavity shadow |
| `gold-muted` | `rgba(196, 160, 112, 0.15)` | Subtle tag backgrounds, inactive chip borders |
| `gold-glow` | `rgba(196, 160, 112, 0.35)` | Ambient radial glow, button drop-shadow |

### 2.2 Onyx & Charcoal Dark Surfaces
*Consolidation Note: Retired `#14110F` and `#2B2623`. Consolidated onto `#141110` for main canvas and `#1C1816` for elevated surfaces.*

| Token Name | Hex Value | Role & Usage Guidance |
| :--- | :--- | :--- |
| `onyx-950` | `#0F0D0C` | Deepest black, modal scrims, letterboxing |
| **`onyx-900` / `brand-black`** | **`#141110`** | **Base page background canvas, footer background, sidebar background** |
| **`onyx-800` / `brand-charcoal`**| **`#1C1816`** | **Elevated cards, glass header bar, modal surfaces, image frame mats** |
| `onyx-700` | `#26211F` | Interactive dark surfaces, hovered cards, input backgrounds |
| `onyx-600` | `#332D2A` | Scrollbar thumb, secondary dividers |
| `onyx-500` | `#423B37` | Subtle border separators |
| `onyx-400` | `#5C534E` | Form label text in on-light / admin environments |
| `onyx-300` | `#827771` | Muted captions, metadata, timestamps, input placeholders |
| `onyx-200` | `#B3A9A3` | Secondary body text, descriptions, inactive nav links |
| `onyx-100` | `#DEDAD6` | High-legibility long-form body text on dark |
| **`onyx-50` / `brand-cream`** | **`#F2EFE8`** | **Primary typography color on dark, headings, brand wordmark** |

### 2.3 Administrative & On-Light Palette
Used exclusively within the `.admin-scope` control panel to guarantee high-contrast data entry:

| Token Name | Hex Value | Role & Usage Guidance |
| :--- | :--- | :--- |
| `admin-bg` | `#FAF8F5` | Admin workspace page background |
| `admin-surface` | `#FFFFFF` | Form card background, input field background |
| `admin-border` | `#E6E1DC` | Clean neutral input border, card boundary |
| `admin-text-main` | `#141110` | Primary admin data text (high-contrast black) |
| `admin-text-muted`| `#8C7F75` | Admin placeholders and descriptive captions |

---

## 3. Typography Hierarchy

### 3.1 Font Families
- **Display & Monogram**: `Cinzel`, Georgia, serif — Used for Latin wordmarks (`S&I ATELIER`), Roman numerals, and luxury hallmarks.
- **Headings & Editorial**: `Cormorant Garamond`, `El Messiri`, serif (`var(--font-serif)`) — Used for Arabic H1–H4, section titles, and pull quotes.
- **Body & Sans**: `Alexandria`, `Plus Jakarta Sans`, sans-serif (`var(--font-sans)`) — Clean architectural Arabic sans for paragraphs, technical specs, and interface labels.

### 3.2 Heading Scale

| Level | Desktop Size | Mobile Size | Weight | Line Height | Font Family |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 (Hero)** | 4.5rem (72px) | 2.25rem (36px) | 800 (Bold) | 1.15 | `var(--font-serif)` |
| **H2 (Section)**| 2.5rem (40px) | 1.75rem (28px) | 700 (Bold) | 1.25 | `var(--font-serif)` |
| **H3 (Card Title)**| 1.5rem (24px) | 1.25rem (20px) | 700 (Bold) | 1.35 | `var(--font-serif)` |
| **H4 (Subheader)**| 1.125rem (18px)| 1.0rem (16px) | 600 (Semi) | 1.4 | `var(--font-serif)` |
| **Body Lead** | 1.125rem (18px)| 0.95rem (15px) | 300 (Light) | 1.8 | `var(--font-sans)` |
| **Body Regular**| 0.875rem (14px)| 0.8125rem (13px)| 400 (Regular)| 1.6 | `var(--font-sans)` |
| **Caption / Meta**| 0.75rem (12px)| 0.6875rem (11px)| 500 (Medium) | 1.5 | `var(--font-sans)` |
| **Overline Tag**| 0.6875rem (11px)| 0.625rem (10px)| 800 (Extrabold)| 1.2 | `var(--font-serif)` / uppercase |

---

## 4. Spacing Scale

Rhythm follows an 8px grid hierarchy:

| Token | Size | Typical Role |
| :--- | :--- | :--- |
| `space-1` | 4px | Micro padding, indicator gaps |
| `space-2` | 8px | Button inner gap, tag padding |
| `space-3` | 12px | Input inner padding, small component margins |
| `space-4` | 16px | Standard card inner padding, grid gap (compact) |
| `space-6` | 24px | Standard section grid gap, modal padding |
| `space-8` | 32px | Sub-section spacing, card internal separation |
| `space-12` | 48px | Section divider spacing |
| `space-16` | 64px | Major section vertical rhythm |
| `space-24` | 96px | Hero and page-to-page transition padding |

---

## 5. Border Radii

| Token | Value | Applied To |
| :--- | :--- | :--- |
| **`radius-pill`** | **`9999px` (`rounded-full`)** | **All Primary & Secondary CTA Buttons, Overline Tags, Badges** |
| `radius-card` | `1.5rem` (24px / `rounded-3xl`) | Product, Offer, Portfolio, and Bespoke Feature Cards |
| `radius-panel` | `1rem` (16px / `rounded-2xl`) | Sub-panels, stat cards, media thumbnail frames |
| `radius-input` | `0.75rem` (12px / `rounded-xl`) | Form text inputs, selects, filter chips, action toggles |

---

## 6. Shadows & Elevations

- **Gold Glow**: `0 4px 25px -2px rgba(196, 160, 112, 0.4)` (Primary CTA button hover & active state)
- **Luxury Card Resting**: `0 10px 30px -10px rgba(0, 0, 0, 0.6)`
- **Luxury Card Hover**: `0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 25px 0 rgba(196, 160, 112, 0.14)`
- **Glass Panel**: `backdrop-blur-md bg-[#1C1816]/90 border border-[#C4A070]/20`

---

## 7. RTL Iconography & Motion Conventions

- **Forward CTAs** ("استكشف", "التفاصيل", "طلب استشارة"):
  - Arrow Icon: `FaArrowLeft` (points left, advancing in Arabic RTL).
  - Hover Micro-motion: `translate-x-[-4px]` (moves leftward toward the forward reading flow).
- **Backward Links** ("العودة إلى المعرض", "العودة للمدونة"):
  - Arrow Icon: `FaArrowRight` (points right, returning to the origin in Arabic RTL).
  - Hover Micro-motion: `translate-x-[4px]` (moves rightward toward the start).
- **Horizontal Carousels & Pagination**:
  - Next Page ("الصفحة التالية"): `FaChevronLeft` (pointing left, positioned on the left side).
  - Previous Page ("الصفحة السابقة"): `FaChevronRight` (pointing right, positioned on the right side).

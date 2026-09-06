# S&I Atelier — Canonical Component Specifications

Official implementation patterns and usage rules for reusable UI components.

---

## 1. Button System (`<Button />`)

The brand standard dictates **pill-shaped CTA buttons** (`rounded-full`) for all primary and secondary actions, equipped with directional icons conforming to Arabic RTL.

### 1.1 Canonical Variants

| Variant | Visual Appearance | States Handled | When to Use |
| :--- | :--- | :--- | :--- |
| **`primary`** | Solid warm gold gradient (`from-[#c4a070] to-[#a68252]`), dark onyx text (`#1c1816`), `rounded-full`, gold drop glow | **Default**: elevated glow<br>**Hover**: lighter gold gradient (`#d4b58c` to `#b88f48`), translateY(-2px), amplified glow<br>**Active**: scale(0.98)<br>**Disabled**: opacity-50, cursor-not-allowed | The single most prominent call-to-action per section (e.g. "استكشف قطع الإصدار المحدود", "حجز موعد استشارة", "إرسال الطلب"). Never place two primary buttons next to each other. |
| **`secondary`** | Dark charcoal glass background (`rgba(28, 24, 22, 0.6)`), 1px gold border (`rgba(196, 160, 112, 0.35)`), cream text (`#f2efe8`), `rounded-full` | **Default**: glassmorphism backdrop blur<br>**Hover**: subtle gold wash (`rgba(196, 160, 112, 0.15)`), border gold (`#c4a070`), white text, translateY(-2px)<br>**Active**: scale(0.98)<br>**Disabled**: opacity-50 | Alternative / supporting action beside a primary button (e.g. "خدمة التنفيذ حسب الطلب", "معاينة الخامات", "اتصال هاتفي"). |
| **`ghost`** | Transparent background, gold text (`#c4a070`), no border, `rounded-full` | **Hover**: subtle white/5 background, cream text (`#f2efe8`)<br>**Active**: scale(0.98) | Tertiary links, "عرض الكل" buttons, table inline actions, or icon-only buttons. |
| **`admin-primary`**| Solid `#141110` background (or `#c4a070`), high-contrast text, `rounded-xl` | **Hover**: `#26211f` with subtle elevation<br>**Disabled**: opacity-50 | Submit and create actions within the administrative dashboard. |
| **`admin-outline`**| White background, `#e6e1dc` border, `#5c544e` text, `rounded-xl` | **Hover**: border `#c4a070`, text `#141110` | Cancel, filter, or secondary actions in the admin panel. |

### 1.2 Icon Placement & RTL Rules
- **Forward Actions** (e.g. "التفاصيل", "استكشف", "قراءة المزيد"):
  - Icon: `<FaArrowLeft className="w-3 h-3" />` placed at the **end** (left side in RTL).
  - Micro-animation: `group-hover:translate-x-[-4px]`.
- **Back Actions** (e.g. "العودة للمتجر", "رجوع"):
  - Icon: `<FaArrowRight className="w-3.5 h-3.5" />` placed at the **start** (right side in RTL).
  - Micro-animation: `group-hover:translate-x-[4px]`.

---

## 2. Card Architecture

### 2.1 Storefront Luxury Card (`.luxury-card`)
- **Container**:
  - Background: Gradient from `#181514` to `#13100f` (or flat `#141110`).
  - Border: 1px subtle brass `rgba(196, 160, 112, 0.2)`.
  - Radius: `rounded-3xl` (24px) for outer container.
  - Media Ratio: `aspect-[4/3]` for furniture products, `aspect-[16/10]` for articles, `aspect-square` or `aspect-[4/5]` for gallery portraits.
- **Hover Interaction**:
  - Border transitions to `rgba(196, 160, 112, 0.6)`.
  - Image scales up subtly (`scale-105` over 500ms).
  - Box shadow elevates with ambient gold halo: `0 12px 35px -8px rgba(0, 0, 0, 0.7), 0 0 20px 0 rgba(196, 160, 112, 0.12)`.
- **Overline / Badge**:
  - Position: Floating in upper corner (`top-4 right-4` or `top-4 left-4`).
  - Style: `rounded-full bg-[#c4a070] text-[#1c1816] text-[11px] font-bold px-3 py-1 shadow-md`.

### 2.2 Administrative Data Card (`.admin-card`)
- Background: `#ffffff`
- Border: 1px solid `#e6e1dc`
- Radius: `rounded-2xl` (16px)
- Shadow: `shadow-sm`

---

## 3. Form Controls & Inputs

### 3.1 Storefront Dark Inputs (`.luxury-input`)
- **Background**: `#141110` (pure dark obsidian canvas).
- **Border**: 1px solid `rgba(196, 160, 112, 0.35)`.
- **Text**: Brand cream `#f2efe8`, font-sans, text-xs/sm.
- **Placeholder**: Warm muted onyx `#827771`.
- **Focus State**: `border-[#c4a070] ring-1 ring-[#c4a070]/40 outline-none`.
- **Radius**: `rounded-xl` (12px).

### 3.2 Admin Form Controls
- **Background**: `#ffffff`.
- **Border**: 1px solid `#e6e1dc`.
- **Text**: High-contrast black `#141110`.
- **Placeholder**: Muted `#8c7f75`.
- **Focus State**: `border-[#c4a070] ring-1 ring-[#c4a070] outline-none`.
- **Radius**: `rounded-xl` (12px).

---

## 4. Modals & Lightbox Dialogs

- **Scrim Backdrop**: Fixed full-bleed overlay in `rgba(15, 13, 12, 0.88)` (`onyx-950` with 88% opacity) + `backdrop-blur-md`.
- **Surface**: Floating card in `#1c1816` (`onyx-800`), bordered with `1px solid rgba(196, 160, 112, 0.3)`.
- **Radius**: `rounded-3xl` (24px).
- **Close Button**: Positioned at upper edge, `w-10 h-10 rounded-full bg-white/10 hover:bg-[#c4a070] text-[#c4a070] hover:text-[#1c1816]`, fully keyboard-accessible with `Escape` handler and body-scroll locking.

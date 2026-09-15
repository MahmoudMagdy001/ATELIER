# S&I Atelier Transformation Task Checklist

## Phase 1: QR Code Generation
- [x] Download 1000x1000 scannable QR code PNG and SVG for `https://www.si-atelier.com`
- [x] Copy QR assets to artifacts directory for user
- [x] Generate luxury editorial card mockup with QR code

## Phase 2: Remove Marketing & Storytelling Components
- [x] Remove unused components from `Home.tsx` and delete:
  - [x] `src/features/home/components/AboutPhilosophySection.tsx`
  - [x] `src/features/home/components/VisionStorySection.tsx`
  - [x] `src/features/home/components/BrandValuesRibbon.tsx`
  - [x] `src/features/home/components/CraftsmanshipSection.tsx`
  - [x] `src/features/home/components/LuxuryStatsSection.tsx`
  - [x] `src/components/ui/VipBespokeCta.tsx` (and remove from `src/components/ui/index.ts`)
  - [x] `src/features/home/components/VipBespokeForm.tsx`
  - [x] `src/features/home/components/ShowroomInfo.tsx`
- [x] Simplify `Home.tsx` to showcase only: Hero, ServicesDualCards, ProductCategoriesSection, PortfolioGallery

## Phase 3: Simplify Showroom & Footer in Layout
- [x] Simplify `ContactShowroomSection.tsx` to a clean, minimal showroom & contact presentation without aggressive sales CTAs or large forms
- [x] Remove marketing ribbon (`LUXURY • MINIMAL • TIMELESS • BESPOKE`) from footer in `Layout.tsx`

## Phase 4: App-Like Mobile Navigation & UX
- [x] Create `src/components/layout/MobileBottomNav.tsx` (fixed bottom navigation bar for mobile, inspired by Sight Paints)
- [x] Integrate `MobileBottomNav` in `Layout.tsx` with proper padding (`pb-20` on mobile `<main>`)
- [x] Adjust `ScrollToTop` and `FloatingWhatsApp` bottom offsets (`bottom-20` on mobile) so they don't block bottom navigation
- [x] Enhance mobile header in `Layout.tsx` for a sleeker app bar look with compact language switcher
- [x] Simplify `HeroSection.tsx` on mobile (compact splash hero, remove marketing text)
- [x] Simplify `ServicesDualCards.tsx` (remove lengthy marketing paragraphs, focus on clean service showcase)
- [x] Optimize `ProductCategoriesSection.tsx` for mobile (2-column app catalog grid, remove promotional text)

## Phase 5: Floating WhatsApp Button Cleanup
- [x] Remove `animate-ping` ripple animation from `FloatingWhatsApp.tsx`
- [x] Remove outer blur glow ring for an elegant, calm luxury presence

## Phase 6: Direction (RTL / LTR) Polish & Typography
- [x] Audit `Layout.tsx` and components for proper start/end logical properties and smooth Arabic/English switching
- [x] Keep Arabic as primary/fallback language (`ar` / `rtl`) per user instruction
- [x] Add `safe-area-inset` support in `src/index.css` for bottom navigation bar on modern phones

## Phase 7: Verification & Build
- [x] Run `npm run typecheck` (passed with 0 errors)
- [x] Run `npm run build` (built cleanly in 871ms)
- [x] Dev server verified running on port 5173
- [x] Create walkthrough artifact

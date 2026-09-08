You have already completed the project discovery and produced the following
Comprehensive Engineering & Product Improvement Plan for S&I Atelier.

IMPORTANT:

DO NOT create another audit.
DO NOT regenerate the plan.
DO NOT just explain what should be done.

START IMPLEMENTING THE PLAN NOW.

You must execute the phases sequentially and autonomously.

============================================================
PROJECT
============================================================

Project: S&I Atelier

Stack:
- React 19
- Vite 8
- TypeScript 7
- TailwindCSS v4
- React Router v7
- Supabase
- Framer Motion 13
- react-i18next
- oxlint
- Vercel

Available skills:

.agents/skills/

Relevant skills already identified:
- ui-ux-pro-max
- design-system
- ui-styling
- brand
- React-related skills
- React Hooks
- GSAP/animation skills
- Vercel best practices

You MUST use the relevant skills during implementation.

Before modifying a specific area, read the relevant skill instructions and follow
their recommendations.

============================================================
EXECUTION RULES
============================================================

Follow these rules throughout the entire implementation:

1. Work directly on the existing project.

2. Preserve existing functionality.

3. Do not rewrite the application from scratch.

4. Do not change business logic unless fixing a real bug.

5. Do not introduce unnecessary dependencies.

6. Reuse existing components whenever possible.

7. Do not create duplicate components.

8. Keep the existing brand identity.

9. Do not randomly redesign the application.

10. Do not replace libraries without a strong technical reason.

11. Do not use placeholder content.

12. Do not remove functionality simply to make the code smaller.

13. Do not disable TypeScript strictness.

14. Do not use `any` unless absolutely unavoidable.

15. Never expose secrets or Supabase service-role credentials.

16. Preserve both Arabic RTL and English LTR.

17. Test mobile behavior at approximately 375px.

18. Test desktop behavior.

19. Keep animations performant.

20. Respect prefers-reduced-motion.

21. Do not blindly optimize things without understanding their purpose.

22. After every phase, run the appropriate validation.

23. If a change causes a regression, fix it before continuing.

24. Do not stop after reporting a problem.
   FIND → ANALYZE → FIX → VERIFY.

25. Continue automatically to the next phase.

============================================================
PHASE 1 — FIX TYPESCRIPT CONFIGURATION
============================================================

File:

tsconfig.node.json

Problem:

Missing:

"noEmit": true

Task:

Add the correct configuration needed to prevent the TypeScript project-reference
TS6310 issue.

Then verify:

npm run typecheck

If the project does not currently have a typecheck script, inspect package.json
and use the appropriate TypeScript command.

Do not change unrelated TypeScript configuration.

============================================================
PHASE 2 — VITE BUNDLE OPTIMIZATION
============================================================

File:

vite.config.ts

Current problems:

Large chunks:
- AdminPosts ≈ 502 kB
- index ≈ 453 kB
- supabase ≈ 217 kB

Implement a sensible manual chunking strategy.

Potential groups:

- framer-motion
- @supabase/supabase-js
- Tiptap
- react-icons
- i18next / react-i18next

IMPORTANT:

Do not blindly create dozens of tiny chunks.

Use a balanced chunking strategy that improves caching and initial load.

Verify the production build afterward.

Inspect the resulting dist/assets sizes.

Goal:

Reduce the size of the main application chunk and avoid unnecessarily large
initial JavaScript.

============================================================
PHASE 3 — INDEX.HTML PERFORMANCE + SEO
============================================================

File:

index.html

Implement:

1. Static fallback meta description.

2. Appropriate title handling.

3. Hero image preload if the hero image is genuinely the LCP image.

4. Preconnect only to origins that are actually required for the initial page.

5. Correct document language strategy.

The project supports:

Arabic RTL
English LTR

Do not create an incorrect static language declaration that conflicts with the
actual application behavior.

Do not add unnecessary preload hints.

Verify that preload paths are correct.

============================================================
PHASE 4 — HOME PAGE DECOMPOSITION
============================================================

File:

src/features/home/pages/Home.tsx

Current size:
≈ 776 lines

Do NOT simply split the file into arbitrary files.

Create meaningful components based on actual responsibilities.

Expected structure where appropriate:

- HeroSection
- BrandValuesRibbon
- AboutPhilosophySection
- VisionStorySection
- ServicesDualCards
- ProductCategoriesSection
- PortfolioGallery
- PortfolioLightbox
- CraftsmanshipSection

Before extracting a component:

Understand its:
- props
- state
- effects
- dependencies
- animations
- translation usage
- responsive behavior

Preserve all functionality exactly.

Do not create unnecessary prop drilling.

If a component has state that belongs locally, keep it local.

If multiple sections share data, use the cleanest existing architecture.

After refactoring:

- TypeScript check
- lint
- build

============================================================
PHASE 5 — CONTACT SHOWROOM DECOMPOSITION
============================================================

File:

src/features/home/components/ContactShowroomSection.tsx

Current size:
≈ 33 kB

Extract meaningful responsibilities.

Expected:

- VipBespokeForm
- ShowroomInfo

Potentially extract smaller reusable form primitives only if justified.

Do not over-componentize.

Preserve:
- validation
- submission
- translations
- loading states
- error states
- success states
- animations
- responsive layout

Verify functionality after refactoring.

============================================================
PHASE 6 — ACCESSIBILITY
============================================================

Perform a complete accessibility pass using the relevant UI/UX skill.

Fix:

1. Navigation focus states.

2. Portfolio button focus states.

3. Lightbox:
   - role="dialog"
   - aria-modal="true"
   - accessible label
   - keyboard navigation
   - Escape to close
   - focus management / focus trap where appropriate

4. Mobile menu:
   - aria-expanded
   - aria-controls where appropriate
   - accessible label

5. Portfolio clickable elements:
   Do not leave clickable divs inaccessible.

Prefer real buttons when the interaction is button-like.

If a div genuinely must remain interactive:
- role
- tabIndex
- keyboard handlers
- focus styles

But prefer semantic HTML.

6. Images:
   - meaningful alt text
   - empty alt for decorative images

7. Form controls:
   - labels
   - error messaging
   - keyboard usability

8. Focus-visible states.

Use the existing brand/design system.

Do not use ugly default accessibility styling that breaks the design.

============================================================
PHASE 7 — CSS SPECIFICITY CLEANUP
============================================================

File:

src/index.css

Find brittle selectors such as:

.fixed .bg-white
.fixed .bg-white input:not([class*="text-"])

These selectors depend on Tailwind utility class names.

Replace them with a semantic/scoped strategy.

For example:

- modal/dialog class
- data attributes
- semantic component classes

Do NOT globally change styles that could affect unrelated components.

After the change:

- inspect modals
- inspect forms
- inspect dropdowns
- inspect mobile layouts

Ensure no visual regressions.

============================================================
PHASE 8 — RTL / LTR CONSISTENCY
============================================================

Perform a full RTL/LTR audit.

The application supports:

Arabic RTL
English LTR

Inspect all directional icons, especially:

FaArrowLeft
FaArrowRight
chevrons
navigation arrows
carousel controls
back buttons
forward buttons

Standardize direction handling.

Use the existing project's RTL/LTR strategy.

Do not simply rotate every arrow globally.

Verify:

Arabic:
- text direction
- icon direction
- spacing
- navigation
- forms
- buttons

English:
- text direction
- icon direction
- spacing
- navigation
- forms
- buttons

============================================================
PHASE 9 — HERO IMAGE + IMAGE PERFORMANCE
============================================================

Current hero:

hero-banner.jpg

Size:
≈ 766 kB

This is a major LCP concern.

First inspect how the image is currently loaded.

Implement:

- correct loading priority
- fetchpriority="high" where appropriate
- width
- height
- decoding strategy
- responsive behavior

If the hero image is the actual LCP image, make it high priority.

Do NOT add preload and fetchpriority blindly if the hero isn't actually rendered
on the initial route.

For non-critical portfolio images:

- loading="lazy"
- decoding="async"
- width
- height where practical

Prevent CLS.

Do not visually degrade the hero.

If image conversion is possible within the current project setup, evaluate whether
WebP/AVIF would materially improve performance before implementing it.

============================================================
PHASE 10 — DESIGN SYSTEM CONSOLIDATION
============================================================

Use:

- design-system skill
- ui-styling skill
- brand skill

Audit:

design-system/tokens.css

and:

Tailwind v4 @theme

Find duplicated hardcoded design values.

Examples:

#C4A070
#141110
#F2EFE8

Where appropriate, replace hardcoded values with centralized design tokens.

Do NOT blindly replace every hex value.

Some values may intentionally be local.

Create consistent tokens for:

- brand colors
- typography
- spacing
- radius
- shadows
- transitions

Then improve component consistency.

Buttons:

Audit all CTA/button implementations.

If a Button component already exists, standardize sizing through it.

Avoid inconsistent combinations such as:

px-5 py-2.5
px-6 py-3
px-8 py-3.5

unless there is a legitimate design reason.

Preserve the luxury visual identity.

The result should feel premium, minimal, elegant and intentional.

============================================================
PHASE 11 — ADMIN MOBILE SIDEBAR
============================================================

Inspect the current admin navigation.

Current behavior:

w-full md:w-64

On mobile this stacks vertically.

Improve it into a proper mobile navigation pattern.

Requirements:

- mobile menu button
- accessible toggle
- sidebar/drawer behavior
- overlay where appropriate
- keyboard accessibility
- Escape handling where appropriate
- body scroll handling if needed
- desktop sidebar remains stable

Do not break admin routes.

Do not alter permissions/authentication.

============================================================
PHASE 12 — SEO + STRUCTURED DATA
============================================================

Inspect:

src/components/ui/SEO.tsx

and all pages using it.

Reduce unnecessary duplicated settings fetching.

Do not break existing SEO behavior.

Improve where appropriate:

- title
- description
- canonical
- Open Graph
- Twitter metadata
- language
- structured data

For the showroom/business, evaluate appropriate:

LocalBusiness

or the most accurate schema type.

Do not invent information.

Only use actual project/business data already available.

Ensure Arabic and English metadata are handled appropriately.

============================================================
PHASE 13 — SUPABASE / DATA LAYER REVIEW
============================================================

Inspect the Supabase integration.

Do not change database schema unless absolutely necessary.

Audit:

- duplicate requests
- unnecessary requests
- caching
- error handling
- loading states
- RLS
- authentication
- public vs private data
- admin operations
- query sizes
- pagination
- realtime subscriptions

Pay special attention to:

adminService.fetchSettings()

and the existing settingsPromise/request deduplication.

Remove architectural redundancy where safe.

Do not break the demoStore fallback.

Important:

The demoStore localStorage authentication must never be treated as equivalent
to real secure authentication.

Do not weaken Supabase RLS.

Do not expose private credentials.

============================================================
PHASE 14 — PDF / STATIC ASSET OPTIMIZATION
============================================================

Inspect:

CR Certificate PDF ≈ 985 kB

Ensure it is not imported into the JavaScript bundle unnecessarily.

If it is only linked from the UI:

use a normal URL/static asset link.

Do not eagerly load the PDF.

Verify that clicking the certificate still works.

============================================================
PHASE 15 — PERFORMANCE FINAL PASS
============================================================

Perform a final performance audit.

Check:

- initial JS
- lazy routes
- dynamic imports
- images
- fonts
- animations
- Supabase requests
- unnecessary React renders
- expensive effects
- duplicate API requests

Pay particular attention to:

- Home
- AdminPosts
- AdminSettings
- Layout
- SEO
- ContactShowroomSection

Do not use premature optimization.

Only implement improvements that have a clear benefit.

============================================================
PHASE 16 — FINAL QUALITY ASSURANCE
============================================================

Run all available validation commands.

At minimum:

npm run build
npm run lint
npm run typecheck

If tests exist:

run them.

Fix all errors caused by your changes.

Then inspect:

- console errors
- console warnings
- broken routes
- broken imports
- broken images
- broken translations
- RTL/LTR issues
- responsive issues

============================================================
RESPONSIVE QA
============================================================

Explicitly verify the application at:

375px
768px
1024px
1440px+

Pay special attention to:

- navigation
- hero
- portfolio
- forms
- footer
- admin sidebar
- dialogs
- cards
- typography
- horizontal overflow

There must be no accidental horizontal scrolling.

============================================================
FINAL PERFORMANCE TARGETS
============================================================

Aim for:

- No build errors
- No TypeScript errors
- No lint errors
- No obvious runtime errors
- No obvious accessibility violations
- No horizontal overflow at 375px
- Main JS significantly reduced
- Hero image optimized
- Better LCP
- Reduced CLS
- Better caching/chunking

Do NOT artificially force every chunk below a specific number if that makes
the architecture worse.

Use engineering judgment.

============================================================
PHASE REPORT FORMAT
============================================================

After EVERY phase, report:

PHASE X — COMPLETE

Implemented:
- ...

Files changed:
- ...

Problems fixed:
- ...

Validation:
- ...

Remaining concerns:
- ...

Then immediately continue to the next phase.

Do not wait for user confirmation.

============================================================
FINAL REPORT
============================================================

At the very end provide:

1. Executive Summary

2. All phases completed

3. Files created

4. Files modified

5. Major performance improvements

6. Major UI/UX improvements

7. Accessibility improvements

8. SEO improvements

9. Architecture improvements

10. Supabase/data improvements

11. Validation results

12. Any remaining issues

13. Recommended future improvements

IMPORTANT:

Do not claim something was tested if it was not actually tested.

Do not claim a performance metric improved unless you actually measured it.

Be precise and honest.

============================================================

START NOW.

Begin with Phase 1.

Do not stop until all applicable phases are implemented and verified.
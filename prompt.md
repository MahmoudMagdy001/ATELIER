You are the lead senior frontend engineer, UI/UX designer, design-system architect, and performance engineer for this project.

Your mission is to comprehensively improve the existing project using the available skills inside:

.agents/skills/

IMPORTANT:
You MUST actively use the available skills in `.agents/skills/` whenever they are relevant to the task.

Do NOT ignore the skills.
Do NOT reinvent processes that are already covered by an available skill.
Before making changes, inspect the available skills and determine which ones are relevant.

==================================================
PHASE 0 — PROJECT & SKILLS DISCOVERY
==================================================

First, inspect the entire project structure.

Understand:
- Framework
- Language
- Build system
- Package manager
- Routing
- State management
- API layer
- Supabase integration
- Authentication
- Database structure
- Components
- Pages
- Assets
- Design system
- Existing styling architecture
- Responsive behavior
- Current UX patterns
- Current performance characteristics

Then inspect:

.agents/skills/

Read the relevant SKILL.md / skill instructions for:
- design
- design-system
- ui-styling
- ui-ux-pro-max
- brand
- banner-design
- slides
- React / React hooks / React patterns
- GSAP / animations
- Next.js
- Vercel best practices
- Any other skill that is relevant to the project

Do NOT blindly use every skill.

Create a mapping:

SKILL → WHY IT IS RELEVANT → WHERE IT WILL BE USED

Then create an improvement roadmap.

IMPORTANT:
Do not modify the project yet during this phase.

==================================================
PHASE 1 — FULL PROJECT AUDIT
==================================================

Perform a deep audit of the entire project.

Inspect the actual source code instead of making assumptions.

Audit:

1. Architecture
2. Component structure
3. Code quality
4. TypeScript quality
5. React patterns
6. Hooks
7. State management
8. Routing
9. API calls
10. Supabase usage
11. Authentication
12. Error handling
13. Loading states
14. Empty states
15. Responsive design
16. Accessibility
17. SEO
18. Performance
19. Bundle size
20. Images
21. Fonts
22. Animations
23. CSS
24. Tailwind usage if present
25. Design consistency
26. Design tokens
27. Reusable components
28. Mobile UX
29. Desktop UX
30. Security issues
31. Dead code
32. Duplicate code
33. Unused dependencies
34. Console errors/warnings
35. Build issues
36. Deployment configuration
37. Vercel configuration
38. Environment variables
39. Supabase queries
40. Database/API efficiency

Do not change functionality unnecessarily.

Preserve all existing business logic unless there is a clear bug or architectural problem.

==================================================
PHASE 2 — UI/UX AUDIT
==================================================

Use the relevant design and UI/UX skills.

Evaluate the project as if it were being reviewed by a senior product designer.

Check:

- Visual hierarchy
- Typography
- Spacing
- Alignment
- Color system
- Contrast
- Buttons
- Forms
- Cards
- Navigation
- Headers
- Footers
- Modals
- Dropdowns
- Tables
- Empty states
- Error states
- Loading states
- Micro-interactions
- Hover states
- Focus states
- Mobile navigation
- Responsive layouts
- Accessibility

Identify anything that makes the product look:
- generic
- inconsistent
- outdated
- template-like
- unnecessarily complicated
- visually weak

Improve the design while preserving the project's identity and purpose.

Do NOT randomly redesign the entire product.

Every design change must have a reason.

==================================================
PHASE 3 — DESIGN SYSTEM
==================================================

Use the design-system and UI styling skills.

Create or improve a centralized design system.

Establish consistent:

- Colors
- Typography
- Font sizes
- Font weights
- Spacing
- Border radius
- Shadows
- Elevation
- Buttons
- Inputs
- Cards
- Badges
- Modals
- Navigation
- Containers
- Grid system
- Breakpoints
- Animations
- Transitions

Avoid hardcoded values when they should be design tokens.

Create reusable primitives instead of duplicating styling.

Do not introduce a huge design system unnecessarily.

Keep it practical and maintainable.

==================================================
PHASE 4 — COMPONENT ARCHITECTURE
==================================================

Use the relevant React / React Hooks / architecture skills.

Refactor the component architecture where necessary.

Goals:

- Small focused components
- Reusable components
- Clear responsibilities
- Minimal duplication
- Predictable state flow
- Proper hooks
- Avoid unnecessary re-renders
- Avoid prop drilling where inappropriate
- Avoid giant components
- Avoid unnecessary abstractions

Do NOT over-engineer.

Prefer simple, maintainable solutions.

==================================================
PHASE 5 — PERFORMANCE OPTIMIZATION
==================================================

Use the relevant performance and Vercel best-practice skills.

Optimize:

- Initial page load
- JavaScript bundle
- Images
- Fonts
- Lazy loading
- Code splitting
- React rendering
- Expensive computations
- API requests
- Supabase queries
- Caching
- Network requests
- Animations
- DOM complexity

Look specifically for:

- unnecessary re-renders
- unnecessary useEffect
- unnecessary API calls
- duplicated API calls
- large dependencies
- loading everything upfront
- oversized images
- layout shifts
- blocking resources

Do NOT optimize blindly.

Measure or reason about the actual bottleneck first.

==================================================
PHASE 6 — RESPONSIVE DESIGN
==================================================

Make the entire application production-quality across:

- Mobile
- Tablet
- Laptop
- Desktop
- Large screens

Do not simply shrink desktop layouts.

Ensure:

- proper spacing
- readable typography
- usable touch targets
- responsive navigation
- responsive tables
- responsive cards
- responsive forms
- responsive images
- correct overflow behavior
- no horizontal scrolling unless intentional

Test important breakpoints.

==================================================
PHASE 7 — ACCESSIBILITY
==================================================

Perform a serious accessibility pass.

Check:

- semantic HTML
- keyboard navigation
- focus states
- aria labels
- buttons
- links
- forms
- color contrast
- image alt text
- heading hierarchy
- screen-reader usability
- modal accessibility
- keyboard traps

Fix real accessibility issues.

==================================================
PHASE 8 — SEO
==================================================

Where applicable, improve:

- page titles
- meta descriptions
- Open Graph
- semantic HTML
- heading hierarchy
- canonical URLs
- robots
- sitemap
- structured data
- image metadata

Do not add SEO elements that don't make sense for the application.

==================================================
PHASE 9 — SUPABASE / DATA LAYER
==================================================

Inspect the Supabase implementation carefully.

Check:

- inefficient queries
- duplicate queries
- unnecessary data fetching
- missing pagination
- missing filtering
- unnecessary realtime subscriptions
- authentication flow
- error handling
- loading states
- caching
- security
- RLS assumptions
- exposed secrets

NEVER expose service-role keys or private credentials.

Do not modify database behavior unless necessary.

==================================================
PHASE 10 — ANIMATIONS
==================================================

If GSAP or animation skills are relevant, use them carefully.

Animations should:

- improve UX
- feel intentional
- remain performant
- respect reduced-motion preferences
- not delay interaction
- not cause layout shifts

Avoid excessive animations.

==================================================
PHASE 11 — IMPLEMENTATION
==================================================

After completing the audit, start implementing improvements.

IMPORTANT:

Work in logical phases.

Do NOT make hundreds of unrelated changes at once.

For each phase:

1. Explain what you found.
2. Explain what you will change.
3. Implement the changes.
4. Run the relevant checks.
5. Fix resulting issues.
6. Verify the result.
7. Move to the next phase.

Do not stop after the audit.

Actually implement the improvements.

==================================================
PHASE 12 — QUALITY CONTROL
==================================================

After implementation:

Run:

- TypeScript checks
- ESLint/lint
- Build
- Tests if available

Fix all errors introduced by your changes.

Also inspect for:

- console errors
- console warnings
- broken imports
- broken routes
- broken components
- broken responsive behavior
- missing assets
- runtime errors

Do not consider the task complete while obvious errors remain.

==================================================
PHASE 13 — FINAL REVIEW
==================================================

Perform a final senior-level review.

Ask:

Would this project look professionally built by an experienced product team?

Check:

- UI quality
- UX quality
- consistency
- architecture
- maintainability
- performance
- accessibility
- responsiveness
- SEO
- security
- deployment readiness

Fix remaining high-impact issues.

==================================================
IMPORTANT RULES
==================================================

1. USE THE AVAILABLE SKILLS.

The `.agents/skills` directory is part of the project's development workflow.

When a task matches a skill, read and follow that skill.

2. DO NOT blindly apply skills that are irrelevant.

3. DO NOT rewrite the whole application just for the sake of refactoring.

4. Preserve existing functionality.

5. Prefer incremental improvements.

6. Do not introduce unnecessary dependencies.

7. Do not replace existing libraries unless there is a strong technical reason.

8. Do not create duplicate components when an existing reusable component can be improved.

9. Do not use placeholder content unless absolutely necessary.

10. Do not fake successful tests or validation.

11. If something cannot be verified, explicitly state that.

12. Never expose secrets, API keys, service-role keys, or credentials.

13. Before modifying important architecture, understand how the existing system works.

14. Prioritize high-impact improvements first.

15. Follow the existing project's conventions unless they are demonstrably harmful.

16. Use TypeScript strictly and avoid `any` unless absolutely necessary.

17. Keep the code production-ready.

==================================================
EXECUTION ORDER
==================================================

Execute in this order:

PHASE 0 → Skills & Project Discovery
PHASE 1 → Full Audit
PHASE 2 → UI/UX
PHASE 3 → Design System
PHASE 4 → Architecture
PHASE 5 → Performance
PHASE 6 → Responsive
PHASE 7 → Accessibility
PHASE 8 → SEO
PHASE 9 → Supabase/Data
PHASE 10 → Animations
PHASE 11 → Implementation
PHASE 12 → Quality Control
PHASE 13 → Final Review

IMPORTANT:

Do not ask me for permission between phases.

Proceed autonomously.

If a phase is not relevant, skip it and explain why.

At the end of every phase, provide a concise summary:

- What was inspected
- Problems found
- Changes made
- Files changed
- Validation performed
- Remaining issues

Then continue automatically to the next phase.

START NOW WITH PHASE 0.

CRITICAL PRIORITY RULE:

Do not confuse "improving the project" with only changing colors, spacing, fonts, or visual appearance.

I want a complete engineering + product improvement.

Your priorities are:

1. Correctness
2. Architecture
3. Maintainability
4. Performance
5. UX
6. UI
7. Accessibility
8. SEO
9. Security
10. Deployment readiness

When you find a problem, prioritize it based on:

IMPACT × FREQUENCY × RISK

Fix high-impact issues first.

For every significant change, understand the existing implementation before modifying it.

Use the skills in `.agents/skills` as your expert playbooks.

If multiple skills apply to the same task, combine them intelligently rather than following only one.

Never blindly follow a skill if it conflicts with the actual project architecture.

The final result should feel like the project was reviewed and improved by:

- Senior React Engineer
- Senior TypeScript Engineer
- Senior UI/UX Designer
- Design Systems Engineer
- Performance Engineer
- Accessibility Specialist
- SEO Specialist
- Security Engineer

Do not merely report problems.

FIND → ANALYZE → FIX → VERIFY → MOVE TO NEXT PHASE.
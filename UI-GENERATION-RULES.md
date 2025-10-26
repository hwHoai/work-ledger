# UI GENERATION RULES — Jobsnap Hero Style

This document specifies the exact rules, tokens, components and acceptance criteria to follow when generating UIs that match the Jobsnap-like hero image provided by the user.

Purpose

- Produce UIs matching the Jobsnap-like hero visual language:
  - Full-bleed soft gradient background.
  - Centered white rounded hero card with shadow.
  - Large multi-weight headline with an emphasized highlighted numeric token.
  - Slim search bar split into two inputs + right-aligned CTA.
  - Decorative floating icon circles around the hero.
  - Minimal, airy header/navigation.
- Output is UI-only unless the user explicitly requests logic (e.g. blockchain connectivity).

Tokens (CSS variables)

- Colors
  - --bg-gradient-start: #5563f7
  - --bg-gradient-end: #8b5cf6
  - --bg-page: linear-gradient(90deg, var(--bg-gradient-start), var(--bg-gradient-end))
  - --card-bg: #ffffff
  - --muted-1: #6b7280
  - --muted-2: #9ca3af
  - --accent: #2563eb
  - --accent-2: #4f46e5
  - --success: #16a34a
- Typography
  - --font-sans: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial
  - Headline sizes: XXL: 48–72px (desktop), XL: 36–48px (tablet), LG: 28–36px (mobile)
  - Emphasized number: font-weight 700 and gradient text from --accent -> --accent-2
- Radii & shadow
  - --radius-hero: 18px
  - --radius-pill: 9999px
  - --card-shadow: 0 10px 30px rgba(15,23,42,0.08)
- Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 (px) — use consistently

Layout rules

- Page background: full-bleed gradient with optional rounded outer viewport corners.
- Hero container
  - Centered, max-width ~1200px.
  - Background: var(--card-bg). Border-radius: var(--radius-hero).
  - Padding: 48px desktop / 32px tablet / 20px mobile.
  - Subtle drop shadow: var(--card-shadow).
- Decorative icons: absolutely-positioned, low-opacity circles. Mark `aria-hidden`.

Component rules

- Header (`Header`)
  - Left: brand mark (icon + label).
  - Center: nav links (Home, Explore, Post a job, Search).
  - Right: CTA button (Log in / Connect Wallet).
  - Height ~64px; responsive collapse to hamburger under 640px.
- Hero (`Hero`)
  - Headline with emphasized numeric token (gradient text).
  - Subtitle: muted text centered under headline.
  - Search bar: single rounded container with 2 inputs + CTA button.
    - Left input: free text (placeholder: "What are you looking for?").
    - Middle input: location (placeholder: "Enter location").
    - Right: Search button (compact).
  - Secondary small link under search: "Advanced search".
- Stats / Cards (`AttendanceCard`)
  - Up to 3 cards: small title, big numeric value, optional delta badge.
  - White background, light border, small shadow.
- Table (`AttendanceTable`)
  - Clean headers, airy rows, status pill with color for Present/Absent/On Leave.
- Modal (`Modal`)
  - Centered, accessible, backdrop with fade. Focus trap and ESC to close.

Interaction & animation

- Hover states: subtle translateY(-2px) and shadow increase for CTAs.
- Focus states: visible outline or box-shadow using accent color.
- Entrance animations: fade/slide for hero and cards (220–320ms ease-out).
- Buttons: primary gradient or solid dark on white hero.

Responsive rules (mobile-first)

- Breakpoints: sm 640px / md 768px / lg 1024px / xl 1280px.
- Mobile
  - Headline stacks; search becomes vertical stack or single input + CTA.
  - Nav collapses to hamburger.
- Desktop
  - Full horizontal search with two inputs + CTA; decorative icons shown.

Accessibility (required)

- All interactive elements have keyboard focus states and ARIA where needed.
- Color contrast: body text >= 4.5:1.
- Inputs must have labels (can be visually-hidden) — placeholders are not sufficient labels.
- Modal must trap focus and restore on close.
- Use semantic HTML elements for structure.

Dev rules (implementation choices)

- Tech: Next.js + TypeScript (current repo).
- Style approach: Tailwind utilities if present; otherwise CSS variables in `globals.css` + small CSS modules.
- File layout: components in `src/components`, page in `src/app/page.tsx`.
- Components must be typed, small and export props.
- UI-only: Buttons provide callbacks or mock flows; no side effects unless requested.

## SSR/CSR Separation Rules

### Purpose

- Ensure clear separation between server-side rendering (SSR) and client-side rendering (CSR) components.
- Optimize performance by minimizing hydration and keeping server components large while client components are small and focused.

### Folder Structure

- `src/components/ui/`: Pure presentational components (no `use client`) shared across multiple pages.
- `src/components/server/`: Server-only components (optional `.server` suffix) shared across multiple pages.
- `src/components/client/`: Interactive components requiring `use client` shared across multiple pages.
- `src/app/`: Pages and layouts, default to server components.
- **Page-specific components**: Components used only by a specific page must be placed in a `components/` folder within that page's directory.
  - Example: `src/app/dashboard/components/` for components specific to the dashboard page.
  - Apply the same SSR/CSR separation rules within page-specific component folders (use subfolders `ui/`, `server/`, `client/` if needed, or use naming suffixes).

### Rules for Server vs Client Components

- **Server Components**:
  - Use for data fetching, SEO content, and static rendering.
  - Avoid browser APIs, hooks, or wallet libraries.
- **Client Components**:
  - Use for interactivity (e.g., modals, forms, wallet connections).
  - Include `use client` directive.

### Data Fetching Patterns

- **SSR**:
  - Fetch data using `fetch` with caching options.
  - Pass data as props to child components.
- **CSR**:
  - Use client-side state managers (e.g., React Query) for real-time updates.
  - Perform API calls or blockchain interactions in client components.

### Component Granularity

- **Presentational Components**:
  - Stateless, props-only, reusable.
- **Container Components**:
  - Fetch data and pass props to presentational components.
- **Interactive Components**:
  - Handle events, state, and API calls.

### Accessibility & Testing

- Ensure all interactive elements have keyboard focus states and ARIA labels.
- Test client components with React Testing Library.
- Run `pnpm tsc --noEmit` and `pnpm lint` for type and lint checks.

### Migration Plan

1. Create `ui`, `server`, and `client` folders under `src/components`.
2. Move presentational components to `ui`.
3. Refactor interactive components to use `use client` and move to `client`.
4. Update pages to fetch data server-side and pass props to components.
5. Verify with TypeScript and visual checks.

### Acceptance Checklist

- Files in `client/` include `use client`.
- Pages perform server-side data fetching.
- Hydration errors are minimized.
- Accessibility checks pass.
- TypeScript compiles without errors.

Acceptance checklist

- Visual
  - Centered white hero card with rounded corners and gradient background visible.
  - Headline with highlighted numeric token styled with gradient.
  - Search bar horizontal on desktop with two inputs + CTA.
- Responsive
  - Mobile headline reduces and search collapses.
  - Nav collapses under 640px.
- Accessibility
  - Keyboard tab order, modal focus trap, labeled inputs.
- Build & types
  - TypeScript compiles: `pnpm tsc --noEmit`.

Generation contract example

- Input: { pageType: "attendance-dashboard", theme: "jobsnap-hero", dataShape: { employees: Employee[] } }
- Output: `src/app/page.tsx` + components implementing the hero + attendance UI-only.
- Employee type: `{ id: string; name: string; status: "Present" | "Absent" | "On Leave"; lastCheckIn?: string }`

How to apply these rules (practical steps)

1. Add CSS tokens to `globals.css` if not already present.
2. Scaffold `Header`, `Hero` (or `SearchBar`), `AttendanceCard`, `AttendanceTable`.
3. Use the tokens for colors, radii, spacing and typography.
4. Run `pnpm tsc --noEmit` and `pnpm dev` to visually check locally.

Delivery & usage

- Use this file as the canonical rule set when asking the assistant to "generate a page" using the Jobsnap-like style.
- If you want a sample generated now, request option A (generate code) or C (generate + save rules) from the assistant.

---

_Last updated: 2025-10-14_

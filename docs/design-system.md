# ScriptType Visual Design System

## Identity

ScriptType should feel like a focused studio for daily growth: warm, quietly confident, and alive through progress. Scripture is given breathing room; the product's color, voice, and activity map make it recognizable without relying on a logo.

## Color tokens

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `canvas` | `#F8F7FC` | `#111019` | App background |
| `surface` | `#FFFFFF` | `#1B1924` | Cards and input surfaces |
| `surface-raised` | `#F0EDF7` | `#252231` | Hovered/raised surfaces |
| `ink` | `#211B2C` | `#F7F4FB` | Primary text |
| `muted` | `#6D6578` | `#B8B1C2` | Secondary text |
| `brand` | `#6041B8` | `#B69AFF` | Primary actions and journey path |
| `brand-deep` | `#392366` | `#D0BCFF` | High-emphasis brand accents |
| `growth` | `#137A60` | `#62D6AE` | Success and mastery |
| `gold` | `#A66B0B` | `#F2C46F` | XP and milestone accents |
| `error` | `#B63D4A` | `#FF8790` | Error status |
| `border` | `#E5E0EC` | `#373341` | Quiet separation |

Use semantic tokens rather than raw palette values in components. Check all foreground/background pairs with automated contrast tests, particularly brand buttons and success states. Never rely on purple/green alone to distinguish characters.

## Type and layout

- Display: `DM Sans` (or a self-hosted equivalent) for confident product headings.
- Reading: `Source Serif 4` for Scripture passages and long-form reading.
- Interface: `DM Sans`; tabular numerals for WPM, time, XP, and progress metrics.
- Use `next/font` or licensed self-hosted font files; avoid blocking on external font networks.
- Mobile baseline: 4-column spacing rhythm with 16px page gutters; tablet 24px; wide layouts use max-width reading and practice canvases rather than stretching text.
- Scripture text: 1.4-1.6 line height; comfortable measure; clear reference/translation metadata.
- Touch targets: at least 44×44 CSS px. Keep challenge input and bottom navigation inside mobile thumb reach.

## Components and states

- **Mission spotlight:** asymmetrical verse card with reference, journey context, and one decisive CTA. Not a generic KPI card.
- **Journey path:** connected milestones with upcoming/active/completed shapes; readable without color and navigable by keyboard.
- **XP ribbon:** compact level progress with accessible text for current/next level; avoids full-width dashboard bars.
- **Streak ember:** restrained ember/flame mark paired with a count and supportive copy; no threatening loss state.
- **Typing canvas:** distinct reading and input surfaces, current character indicator, inline error decoration, and persistent progress/metric strip.
- **Achievement reveal:** small, celebratory earned-state transition; the content remains visible with motion disabled.
- **Buttons:** primary filled brand, secondary outlined/tonal, tertiary text; visible focus, disabled, busy, and error states.
- **Forms:** persistent labels, actionable inline validation, autocomplete hints, and accessible error summaries.
- **Navigation:** mobile bottom bar for Today/Journeys/Progress/Community/Profile; desktop rail with active journey marker.

## Voice and copy

- Encouraging, concrete, and adult: "One verse today" rather than "Don't break your streak!"
- Use “practice,” “recall,” “journey,” and “progress.” Avoid ranking spiritual worth or claiming a score measures faith.
- Errors state what happened and how to recover. Avoid spiritualized guilt in empty states or upgrade prompts.
- Cite translation and reference consistently. Distinguish editorial prompts from Scripture text.

## Motion

- 140-220ms for navigation, feedback, and small transitions; use spring-like easing only on reward reveal.
- A completed verse may animate the progress marker and XP number once. Avoid confetti by default; reserve larger moments for a meaningful journey milestone.
- All animation honors `prefers-reduced-motion`, does not move focus, and has a static equivalent.
- Never animate the live text cursor in a way that competes with the user's typing.

## Accessibility quality bar

- WCAG 2.2 AA target for the complete public/core flow.
- Semantic landmarks, heading hierarchy, skip link, focus ring, screen-reader labels, and status announcements.
- Keyboard-only flow for auth, challenge controls, dialogs, journey map, charts, and community moderation.
- Charts include text/table summaries; metric changes are not color-only.
- Dynamic type/zoom to 200% without loss of core challenge function.
- Responsive layouts verified at 320px, tablet, laptop, and wide desktop.

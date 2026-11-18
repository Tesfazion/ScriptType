# ScriptType Visual Design System

## Identity

ScriptType is a focused studio for daily growth: calm, confident, and made lively through progress. The authenticated home uses compact skill metrics and an obvious next lesson, while Scripture has equal prominence in its own journey. A restrained indigo accent identifies actions and active progress. The shared implementation lives in `src/app/globals.css`.

## Color tokens

The semantic CSS variables below are the source of truth. Light mode is the default; dark mode is selected with the theme toggle or follows the operating-system preference. Mission surfaces intentionally retain a dark treatment in either theme.

| Token | Purpose |
|---|---|
| `--background`, `--foreground` | Page canvas and primary text |
| `--card`, `--card-foreground` | Raised surfaces and their text |
| `--muted`, `--muted-foreground` | Secondary surfaces and text |
| `--primary`, `--primary-foreground` | Primary actions and active progress |
| `--accent`, `--accent-foreground` | Quiet emphasis and selected states |
| `--border`, `--input`, `--ring` | Separation, form controls, and focus |
| `--destructive` | Error and destructive-action feedback |
| `--mission-*` | Fixed contrast colors for dark Scripture/mission surfaces |

Use semantic Tailwind utilities such as `bg-background`, `text-muted-foreground`, `border-border`, and `ring-ring` rather than component-specific hex values. Verify foreground/background combinations against WCAG AA as screens evolve; status and typing correctness must never be communicated by color alone.

## Type and layout

- Interface: Inter when installed, with system UI fallbacks; Scripture uses a system serif stack and typing uses a system monospace stack. Avoid font downloads that block or make builds network-dependent.
- Display and page-title sizes are defined in the Tailwind theme; use the shared `page-title`, `eyebrow`, and `reading-type` classes for repeated roles.
- Spacing tokens: `--space-page`, `--space-section`, and `--space-card`, exposed as `page`, `section`, and `card` spacing utilities.
- Radius and elevation tokens: `--radius-control-token`, `--radius-card-token`, `--radius-panel-token`, and the `--shadow-*-token` family. Use the shared `surface-card`, `surface-muted`, and button classes before adding one-off treatments.
- Mobile baseline: 16px page gutters; tablet 24px; wide layouts use max-width reading and practice canvases rather than stretching text.
- Scripture text: 1.4-1.6 line height; comfortable measure; clear reference/translation metadata.
- Touch targets: at least 44×44 CSS px. Keep challenge input and bottom navigation inside mobile thumb reach.

## Components and states

- **Mission spotlight:** asymmetrical verse card with reference, journey context, and one decisive CTA. Not a generic KPI card.
- **Journey path:** connected milestones with upcoming/active/completed shapes; readable without color and navigable by keyboard.
- **XP ribbon:** compact level progress with accessible text for current/next level; avoids full-width dashboard bars.
- **Streak ember:** restrained ember/flame mark paired with a count and supportive copy; no threatening loss state.
- **Typing canvas:** distinct reading and input surfaces, current character indicator, inline error decoration, and persistent progress/metric strip.
- **Keyboard coach:** full key layout, highlighted target and finger zone, and paired hand diagrams that identify home-row placement.
- **Learning dashboard:** compact level/XP/WPM/accuracy/streak summary, continue-lesson action, daily goals, recent achievements, weekly activity, and typing analytics.
- **Race track:** clear relative-progress lanes for the learner and daily race comparators; server-checked score details remain distinct from client-measured elapsed time.
- **Achievement reveal:** small, celebratory earned-state transition; the content remains visible with motion disabled.
- **Buttons:** use `button-primary`, `button-secondary`, `button-quiet`, or `button-mission`; visible focus, disabled, busy, and error states.
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

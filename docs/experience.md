# User Flows, Page Map, and Wireframes

## Primary practice loop

```mermaid
flowchart TD
  A[Landing / deep link] --> B{Signed in?}
  B -- No --> C[Try sample or create account]
  C --> D[Optional setup: weekly goal and local/sync choice]
  D --> E[Today's mission]
  B -- Yes --> E
  E --> F[Choose continue journey or recommended verse]
  F --> G[Read / type / optional memory mode]
  G --> H{Input complete?}
  H -- No --> G
  H -- Yes --> I[Review WPM, accuracy, time, errors]
  I --> J[Reward reveal: XP, streak, progress]
  J --> K[Optional reflection / journal]
  K --> L[Next journey step or return tomorrow]
```

### Keyboard learning loop

`/today` summarizes skill level, XP, WPM, accuracy, streak, current curriculum step, daily goals, and recent learning activity. The primary action continues the current lesson. `/journeys` presents 15 sequential keyboard lessons followed by available Scripture journeys. `/trainer` provides guided keyboard and finger coaching; keyboard lessons unlock sequentially. Practice modes include speed and accuracy criteria plus a daily race.

## Supporting flows

### Journey
Browse journeys → inspect translation, duration, and sample → start → complete an assigned practice → unlock next step → view completion milestone. Leaving midway preserves progress; a journey can be paused without losing completed work.

### Memory and audio
Select a verse → choose visible / missing words / major words hidden / fully hidden, or audio mode → practice → see recall score separately from typing accuracy → schedule/recommend a later review. The free/premium boundary is stated before a locked mode opens.

### Community
Create/join by invite → preview group name, owner, rules, and visible profile fields → accept → choose alias/leaderboard visibility → join an opt-in challenge → report/block if needed. No private journal or full practice text appears in group feeds.

### AI assistant
Open **Ask** from a product page → review the AI data-use notice → optionally consent → ask about Scripture or typing → receive an answer with a reminder that AI can be wrong. The current context sent is a section label only; journals, account details, and progress are not attached. Conversation stays in component memory and is not saved by ScriptType.

### Admin publishing (planned; not in this build)
The repository has no admin route or publishing interface. A future authorized staff flow should create drafts, attach translation/provenance and rights metadata, validate and preview content, publish versioned content, and record an audit log. Do not treat this design as an available feature.

## Page-by-page breakdown

| Route / surface | Primary purpose | Key content and actions |
|---|---|---|
| `/` | Explain and convert | Distinctive hero, sample typing interaction, how-it-works, testimonials/social proof (only verified), plan comparison, CTA |
| `/sign-in` | Establish identity | Email/password, Google, error recovery, privacy links; guest demo path |
| `/onboarding` | Personalize habit | Weekly goal, preferred reminder/timezone, optional journey, privacy and consent |
| `/today` | Start today's action | Compact typing and Scripture progress, continue lesson, daily goals, weekly rhythm, recent achievements, typing analytics |
| `/practice` | Focused practice | Verse/reference, mode controls, typed text, caret/progress, timer/WPM/accuracy, completion feedback |
| `/journeys` | Choose a structured path | Keyboard curriculum and Scripture journey previews, progress and next step |
| `/journeys/[id]` | Continue a path | Three sample-passage steps, completion states, resume action |
| `/memory` | Recall and review | Memory practice levels and recall feedback |
| `/audio` | Listen and type | Audio practice and typing score, subject to configured content |
| `/progress` | See growth | WPM/accuracy trends, activity calendar, chapters, memory, goals |
| `/community` | Race with consent | Daily leaderboard preview and privacy guardrails; group features are not open in this build |
| `/trainer` | Learn keyboard mechanics | Guided key/finger/hand placement with a visual keyboard and hand model |
| `/reflection` | Private practice journal | Optional prompts and locally saved entries; explicit AI requests have a separate disclosure |
| `/settings` | Manage preferences | Weekly goal, sound, race identity/visibility, local data export/delete |
| `/profile` | View identity and practice history | Level/rank, XP, WPM, accuracy, streak, recent lessons, account/device state |
| `/sign-in` | Establish identity or continue locally | Email/password, Google when configured, recovery, guest/device-only path |
| `/privacy`, `/terms` | Review policies | Data handling and terms |
| `/offline` | Recover while offline | Offline status and return path |
| `/admin` | Not implemented | No admin route exists; content publishing and staff controls remain a product gap |

Routes above describe the current App Router paths. Older `/app/...` paths in earlier design notes were aspirational and are not implemented routes.

## Mobile-first wireframes

### Today / app home

```text
┌──────────────────────────────┐
│ ScriptType     🔥 4    ◉ 240 │  compact header, safe-area aware
│                              │
│ TUESDAY · YOUR DAILY MISSION │  small, calm eyebrow
│                              │
│ “Your word is a lamp...”     │  large editorial verse card
│ Psalm 119:105 · KJV          │  reference and translation
│                              │
│ [ Continue today's practice ]│  one obvious primary action
│                              │
│ YOUR PATH                    │
│ John Journey   8 of 21        │  path-like segmented progress
│ ━━━━━━━━━━━○━━━━━━━━━━━━     │
│                              │
│ WEEKLY RHYTHM    3 / 5 days   │  compact goal ring / activity dots
│ ○ ● ● ○ ○ ○ ○                │
│                              │
│ Next: Recall yesterday's verse│  personalized secondary action
│ Home  Journeys  Progress  You│  thumb-zone navigation
└──────────────────────────────┘
```

The desktop dashboard follows the same hierarchy in a denser two-column layout rather than stretching each metric into a large card. Scripture and typing retain equal prominence.

### Focused typing challenge

```text
┌──────────────────────────────┐
│ ‹ Exit       JOHN 1 JOURNEY   │
│ Step 9 of 21      ━━━━━━○━━━  │
│                              │
│  In the beginning was the    │
│  Word, and the Word was with │
│  God, and the Word was God.  │  reading block, line wraps naturally
│                              │
│  In the beginning was the    │
│  Word, and the Word was with │  live character-state input surface
│  God, and the Word was God.█ │
│                              │
│  42 WPM       98% accuracy   │  fixed metric strip, announced accessibly
│                              │
│  68% COMPLETE                │
│  [ Save and leave ]           │
└──────────────────────────────┘
```

### Completion

```text
┌──────────────────────────────┐
│         Verse complete       │
│        +25 XP  ✨             │  restrained, reduced-motion aware
│                              │
│  42 WPM     98%     1:18     │
│  +4 vs avg  accuracy  time   │
│                              │
│  DAILY STREAK  4 days 🔥     │
│  Weekly rhythm: 4 / 5        │
│                              │
│  What stands out to you?     │
│  [ Reflect (optional) ]      │
│                              │
│  [ Continue John Journey ]   │
│  Back to today               │
└──────────────────────────────┘
```

## Interaction and accessibility states

- Correct/incorrect character status uses shape/underline/color, never color alone. Contrast meets WCAG AA for text and controls.
- Keep keyboard focus visible and predictable. Provide a labeled editable text field rather than requiring pointer-only character interactions.
- Announce meaningful milestones and metric summaries via a polite live region; do not announce every keystroke.
- On mobile, use the native keyboard and a scroll-stable input; prevent viewport jumps and keep submit/exit reachable.
- Provide pause/exit with a clear save/discard choice. On network failure, retain only the user's current local session until sync can succeed and explain that state.
- Support `prefers-reduced-motion`; reward animations are short, non-blocking, and never necessary to understand a state.

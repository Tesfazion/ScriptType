# ScriptType

Build typing confidence, one focused session at a time.

A guided keyboard curriculum meets Scripture practice, memory, and meaningful daily progress.

[Quick Start](#quick-start) · [Experience](#experience) · [Install & Offline](#install-and-offline-use) · [Docs](#documentation)

---

## About ScriptType

ScriptType is a typing practice application that turns keyboard skill-building into a clear, rewarding learning path. Practice typing with live character feedback, follow a 15-lesson beginner curriculum, and keep Scripture memory, audio recall, and reflection as meaningful parts of your journey.

The app is a Next.js (App Router) web app that works as a Progressive Web App (PWA), so users can install it on phones and desktops — the ScriptType logo appears as the app icon on your home screen or desktop shortcut.

---

## Experience

| Learn | Practice | Grow |
| --- | --- | --- |
| Follow 15 ordered beginner lessons, from keyboard orientation and home row to coding and advanced fluency, with visual key and finger guidance. | Practice with live character feedback, typing metrics, Scripture memory and audio, speed/accuracy drills, or a daily race. | Track XP, levels, streaks, badges, daily missions, weekly rhythm, and typing analytics. |

### Highlights

- **Structured path** — stages unlock in sequence as lessons are completed.
- **Visible progress** — current level, XP, WPM, accuracy, streak, and next lesson are always shown.
- **Daily missions** — small goals make it easy to choose what to do next.
- **Personal milestones** — badges celebrate lessons, accuracy, speed, and consistency.
- **Thoughtful hybrid** — typing is the core curriculum; Scripture journeys, recall, and reflection are first-class experiences.
- **Visual coaching** — the trainer highlights target keys, finger zones, and home-row placement.
- **Everyday ready** — responsive layouts, keyboard-friendly controls, light/dark themes, and optional sound feedback.
- **Installable and resilient** — PWA install manifest, offline navigation fallback, cached app pages, and a bounded local practice outbox.

---

## App Icon (PWA)

The ScriptType logo (`src/app/ScrptType logo.png`) is the app icon used when the app is installed on a phone or desktop:

- `public/scripttype-icon-192.png` — 192×192 icon (manifest + Apple touch icon)
- `public/scripttype-icon-512.png` — 512×512 maskable icon
- `public/manifest.json` — PWA manifest referencing both icons
- `src/app/layout.tsx` — icon metadata for browsers and install prompts

Install via **Install ScriptType** in the app navigation, or your browser's Add to Home Screen / Install option.

---

## Quick Start

### Requirements

- Node.js 20+
- npm

### Install and run

```powershell
npm ci
npm run dev
```

Open **[http://localhost:3646](http://localhost:3646)**.

Without Firebase configuration, ScriptType runs in **device demo mode**. Practice progress stays in the current browser and does not sync across devices.

### Optional Firebase setup

1. Copy the example environment file:

   ```powershell
   Copy-Item .env.example .env.local
   ```

2. Add your Firebase web app settings as described in the [Firebase setup guide](./docs/firebase-setup.md).
3. Restart the dev server.

Never commit `.env.local` or place Firebase Admin credentials, service-account keys, or other server secrets in `NEXT_PUBLIC_*` variables.

---

## Product Areas

| Route | What you can do |
| --- | --- |
| `/` | Explore ScriptType and try a sample |
| `/today` | View your daily practice, missions, progress, and next lesson |
| `/journeys` | Follow the keyboard curriculum or browse Scripture journeys |
| `/practice` | Open the typing challenge and practice-mode selector |
| `/memory` · `/audio` | Practice recall or listen-and-type |
| `/progress` · `/profile` | Review milestones, skill metrics, and recent sessions |
| `/community` | View opt-in daily global race results or an existing invited group's results |
| `/reflection` · `/settings` | Reflect privately and manage preferences |
| `/sign-in` | Connect an account for Firebase-backed features |

---

## Progression and Rewards

The beginner curriculum has 15 ordered lessons, progressing from keyboard orientation and finger placement to real-world, coding, and advanced fluency. Completing a lesson at the required accuracy unlocks the next lesson.

Practice earns XP toward levels and rank milestones. Accuracy drills require 95% accuracy; speed practice targets the learner's current best WPM; daily challenge requires 95% accuracy and a five-second minimum. Streaks, missions, and badges recognize consistency and skill — not spiritual worth. In local demo mode, progression is stored on the device. Signed-in account practice is queued locally while offline and retried in the foreground when online; pending sessions do not receive provisional XP. The bounded queue uses localStorage, not IndexedDB or Background Sync.

Signed-in weekly-goal and sound preferences sync to the account using per-setting timestamps; the newer value wins when devices conflict. Race alias and global-visibility settings are account-backed as well.

---

## Install and Offline Use

On supported browsers, use **Install ScriptType** in the product navigation or your browser's install control. The service worker caches the app's primary pages and static manifest/icon assets. Offline practice works with the bundled curriculum and verse content.

Browser storage can be cleared by the user or evicted by the browser; it is not a substitute for an account backup. Account sync requires a configured Firebase project and a foreground connection. Development HTTP localhost is supported by browsers; production installation requires HTTPS.

---

## Community and Privacy

Daily race results are written through Firebase Functions. Global visibility is opt-in and uses a user-selected alias; group results require existing group membership. The server validates the daily passage and calculates text metrics, but elapsed time is client-measured and should not be treated as cheat-proof competition. Group creation/invitation, reporting, blocking, moderation tools, public tournaments, country rankings, and school leaderboards are not enabled.

Reflections are optional and private by default. AI reflection requires explicit user action and configured Firebase AI Logic. Never include private journal text, credentials, or personal user data in issues or logs.

---

## Technology

- Next.js App Router, React, and TypeScript
- Tailwind CSS and ScriptType design tokens/components
- Firebase Authentication, Cloud Firestore, callable Cloud Functions, and App Check
- Firebase AI Logic for optional reflection
- Vitest and ESLint

---

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server on port 3646 |
| `npm run build` | Create the production build |
| `npm run start` | Serve the production build on port 3646 |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest suite |
| `npm run functions:build` | Compile Firebase Cloud Functions |
| `npm run emulators` | Start the Firebase Emulator Suite |
| `npm run deploy:hosting` | Build and deploy Firebase Hosting |

For emulator setup and deployment details, see the [Firebase setup guide](./docs/firebase-setup.md).

---

## Project Structure

```text
src/
  app/                 App Router pages and route groups
  components/          Shared UI and interactive practice components
  data/                Demo Scripture and journey content
  lib/                 Firebase clients, progress, and app utilities
shared/                Curriculum, progression, and domain logic
functions/             Server-side Firebase Cloud Functions
tests/                 Focused automated tests
docs/                  Product, design, architecture, and setup guides
public/                Static assets: manifest, icons, service worker
```

---

## Documentation

- [Product requirements](./docs/prd.md)
- [Architecture and data design](./docs/architecture.md)
- [User experience and flows](./docs/experience.md)
- [Design system](./docs/design-system.md)
- [Roadmap and launch strategy](./docs/roadmap-growth-launch.md)
- [Firebase setup and deployment](./docs/firebase-setup.md)

---

## Production Readiness

Before public launch, configure separate development, staging, and production Firebase projects; validate Firestore rules and App Check; and establish privacy, retention, account deletion, moderation, analytics, and operational policies. Confirm distribution rights for Scripture content and separate audio rights. Documentation of planned safeguards does not mean those services are already deployed.

---

## Contributing

Include a concise description, relevant test results, and any Firebase setup needed to verify a change. Do not include credentials, user data, or private journal content.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: ..."`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License

No license has been added. All rights remain with the copyright holder; contact the repository owner before redistributing or reusing this project.

---

<div align="center">
  ScriptType · Built for typing confidence and meaningful daily practice
</div>

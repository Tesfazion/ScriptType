<div align="center">

# ScriptType

### Build typing confidence, one focused session at a time.

A guided keyboard curriculum meets Scripture practice, memory, and meaningful daily progress.

[Get started](#quick-start) · [Explore the experience](#the-experience) · [Read the docs](#documentation)

</div>

---

> **Project status**
> ScriptType is an active product prototype. The guided typing curriculum, Scripture practice, and device-local offline experience are available in demo mode. Firebase sign-in, authoritative rewards, and opt-in daily race leaderboards require project configuration. Invite-only group membership must already exist in Firebase; group creation/invitations, tournaments, billing, and moderation tools are not live.

## The experience

ScriptType turns typing practice into a clear, rewarding learning path. Start with keyboard basics, build accuracy and speed, and keep Scripture practice available as a meaningful part of the journey.

| Learn | Practice | Grow |
| --- | --- | --- |
| Follow 15 ordered beginner lessons, from keyboard orientation and home row to coding and advanced fluency, with visual key/finger guidance. | Practice with live character feedback, typing metrics, Scripture memory and audio, speed/accuracy drills, or a daily race. | Track XP, levels, streaks, badges, daily missions, weekly rhythm, and typing analytics. |

### Built around a next step

- **A structured path:** stages unlock in sequence as eligible lessons are completed.
- **Visible progress:** see your current level, XP, WPM, accuracy, streak, and next lesson.
- **Small daily goals:** daily mission cards make it easy to choose what to do next.
- **Personal milestones:** badges celebrate lessons, accuracy, speed, and consistency.
- **A thoughtful hybrid:** typing is the core curriculum; Scripture journeys, recall, and reflection remain first-class experiences.
- **Visual coaching:** the trainer highlights target keys, finger zones, and home-row placement.
- **Made for everyday use:** responsive layouts, keyboard-friendly controls, light and dark themes, and optional sound feedback.
- **Installable and resilient:** the web app includes an install manifest, offline navigation fallback, cached app pages, and a bounded local practice outbox.

## Quick start

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

## Product areas

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

## Progression and rewards

The beginner curriculum has 15 ordered lessons, progressing from keyboard orientation and finger placement to real-world, coding, and advanced fluency. Completing a lesson at the required accuracy unlocks the next lesson.

Practice earns XP toward levels and rank milestones. Accuracy drills require 95% accuracy; speed practice targets the learner's current best WPM; daily challenge requires 95% accuracy and a five-second minimum. Streaks, missions, and badges recognize consistency and skill—not spiritual worth. In local demo mode, progression is stored on the device. Signed-in account practice is queued locally while offline and retried in the foreground when online; pending sessions do not receive provisional XP. The bounded queue uses localStorage, not IndexedDB or Background Sync.

Signed-in weekly-goal and sound preferences sync to the account using per-setting timestamps; the newer value wins when devices conflict. Race alias and global-visibility settings are account-backed as well.

## Install and offline use

On supported browsers, use **Install ScriptType** in the product navigation or the browser's install control. The service worker caches the app's primary pages and static manifest/icon assets. Offline practice works with the bundled curriculum and verse content. Browser storage can be cleared by the user or evicted by the browser; it is not a substitute for an account backup. Account sync requires a configured Firebase project and a foreground connection. Development HTTP localhost is supported by browsers; production installation requires HTTPS.

## Community and privacy

Daily race results are written through Firebase Functions. Global visibility is opt-in and uses a user-selected alias; group results require existing group membership. The server validates the daily passage and calculates text metrics, but elapsed time is client-measured and should not be treated as cheat-proof competition. Group creation/invitation, reporting, blocking, moderation tools, public tournaments, country rankings, and school leaderboards are not enabled.

Reflections are optional and private by default. AI reflection requires explicit user action and configured Firebase AI Logic. Never include private journal text, credentials, or personal user data in issues or logs.

## Technology

- Next.js App Router, React, and TypeScript
- Tailwind CSS and ScriptType design tokens/components
- Firebase Authentication, Cloud Firestore, callable Cloud Functions, and App Check
- Firebase AI Logic for optional reflection
- Vitest and ESLint

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server on port 3646 |
| `npm run build` | Create the production build |
| `npm run start` | Serve the production build on port 3646 |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest suite |
| `npm run functions:build` | Compile Firebase Cloud Functions |
| `npm run emulators` | Start the Firebase Emulator Suite |

For emulator setup and deployment details, see the [Firebase setup guide](./docs/firebase-setup.md).

## Project structure

```text
src/
  app/                 Landing page and product routes
  components/          Shared UI and interactive practice components
  data/                Demo Scripture and journey content
  lib/                 Firebase clients, progress, and app utilities
shared/                Curriculum, progression, and domain logic
functions/             Server-side Firebase Cloud Functions
tests/                  Focused automated tests
docs/                   Product, design, architecture, and setup guides
```

## Documentation

- [Product requirements](./docs/prd.md)
- [Architecture and data design](./docs/architecture.md)
- [User experience and flows](./docs/experience.md)
- [Design system](./docs/design-system.md)
- [Roadmap and launch strategy](./docs/roadmap-growth-launch.md)
- [Firebase setup and deployment](./docs/firebase-setup.md)

## Production readiness

Before public launch, configure separate development, staging, and production Firebase projects; validate Firestore rules and App Check; and establish privacy, retention, account deletion, moderation, analytics, and operational policies. Confirm distribution rights for Scripture content and separate audio rights. Documentation of planned safeguards does not mean those services are already deployed.

## Contributing

Include a concise description, relevant test results, and any Firebase setup needed to verify a change. Do not include credentials, user data, or private journal content.

## License

No license has been added. All rights remain with the copyright holder; contact the repository owner before redistributing or reusing this project.

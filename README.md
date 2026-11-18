# ScriptType

**Improve your typing speed while memorizing Scripture.**

ScriptType turns Scripture practice into a focused daily habit: read a verse, type it with intention, revisit it through memory challenges, and see your progress. It combines a premium, responsive Next.js experience with an optional Firebase backend.

> **Project status:** ScriptType is an active product prototype. The core practice experience can be explored in local demo mode without a Firebase project. Firebase sign-in, cloud-backed practice, and AI reflection require your own Firebase configuration. Community, billing, analytics, and other production services are not represented as fully deployed services.

## What’s in the app

- **Daily practice:** a mission-oriented home, interactive typing challenges, real-time character feedback, and practice metrics.
- **Scripture memory:** progressive recall challenges, from visible text to hidden verses.
- **Journeys and progress:** guided Scripture paths, streaks, XP, levels, achievements, and progress views.
- **Audio practice:** an audio-oriented challenge experience.
- **Private reflection:** optional journaling saved in the current browser; Firebase AI reflection is an explicit, optional action.
- **Community and administration:** interface experiences for groups, challenges, and content management.
- **Responsive design:** mobile-first layouts, keyboard-friendly interactions, and light/dark themes.

The local demo stores practice progress on the device. It is not a substitute for an authenticated account or cross-device persistence. See [the product requirements](./docs/prd.md) and [the Firebase setup guide](./docs/firebase-setup.md) for scope and setup details.

## Technology

- Next.js App Router, React, and TypeScript
- Tailwind CSS and custom ScriptType UI components
- Firebase Authentication, Cloud Firestore, callable Cloud Functions, and App Check
- Firebase AI Logic with Gemini 2.5 Flash for consent-based Scripture reflection
- Vitest and ESLint

## Run locally

### Prerequisites

- Node.js 20 or later
- npm

### Install and start

```powershell
npm ci
npm run dev
```

Open [http://localhost:3646](http://localhost:3646). The development and production servers use port **3646**.

Without Firebase settings, the app runs in local demo mode. To enable Firebase features, copy the example environment file and configure a Firebase web app:

```powershell
Copy-Item .env.example .env.local
```

Then fill in the values described in [docs/firebase-setup.md](./docs/firebase-setup.md) and restart the app. `.env.local` contains local configuration and must never be committed.

### Environment variables

| Variable | Required for | Description |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase | Firebase web app API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase | Firebase Authentication domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase | Firebase project identifier |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase | Firebase web app identifier |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Optional | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Optional | Firebase Storage bucket |
| `NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY` | Deployed practice submissions | reCAPTCHA v3 site key for Firebase App Check |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATORS` | Optional | Set to `true` to connect to local Firebase emulators |

These are browser-side Firebase web configuration values. Never put Firebase Admin credentials, service-account keys, or other server secrets in `NEXT_PUBLIC_*` variables. For emulator configuration, deployment steps, and troubleshooting, see the [Firebase setup guide](./docs/firebase-setup.md).

## Firebase services

With a configured Firebase project, the app supports email/password and Google sign-in, Firestore progress reads, and server-validated practice completion through the `completePractice` callable function. Practice submissions require App Check when deployed. Firestore rules and indexes are in the repository.

AI reflection uses Firebase AI Logic and `gemini-2.5-flash`. It is not available until Firebase is configured and the project has Firebase AI Logic enabled. The user must explicitly consent before the selected verse and reflection text are sent for a response. AI output is guidance, not authoritative spiritual or theological advice.

Start the local Firebase Emulator Suite in a separate terminal:

```powershell
npm run emulators -- --project demo-scripttype-local
```

Set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` in `.env.local` when using the emulators. See [docs/firebase-setup.md](./docs/firebase-setup.md) for complete instructions.

## Useful commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start Next.js development server on port 3646 |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build on port 3646 |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest suite |
| `npm run functions:build` | Compile the Firebase Cloud Function |
| `npm run emulators` | Start Firebase emulators |

## Project layout

```text
src/
  app/                 Landing page, sign-in, and product routes
  components/          Shared UI and interactive practice components
  data/                Demo Scripture and journey data
  lib/                 Firebase clients, AI integration, and app utilities
functions/             Server-side Firebase Cloud Functions
shared/                Shared contracts and helpers
tests/                 Focused automated tests
docs/                  Product, design, architecture, and setup documentation
firestore.rules        Firestore access rules
firestore.indexes.json Firestore index definitions
```

Product routes include `/today`, `/practice`, `/memory`, `/audio`, `/journeys`, `/progress`, `/reflection`, `/community`, `/settings`, and `/admin`.

## Documentation

- [Product requirements](./docs/prd.md)
- [System architecture and data design](./docs/architecture.md)
- [User experience and flows](./docs/experience.md)
- [Design system](./docs/design-system.md)
- [Roadmap, growth, and launch strategy](./docs/roadmap-growth-launch.md)
- [Firebase setup and deployment](./docs/firebase-setup.md)

## Content, privacy, and production readiness

Scripture text and media must be used only with verified distribution rights; audio licensing is separate from text licensing. Remote imagery may require an internet connection and should be reviewed for licensing, performance, and hosting requirements before production use.

Before a public production launch, configure and test Firebase in separate development, staging, and production projects; review access rules and App Check; establish privacy, retention, account-deletion, moderation, analytics, and operational policies; and validate all user-facing flows. The repository’s architecture and roadmap documents describe planned safeguards and services—documentation of a design does not mean that service is deployed.

## Contributing

Contributions and issue reports are welcome. For changes, please include a concise description, the relevant test results, and any Firebase setup needed to verify the behavior. Do not include credentials, user data, or private journal content in issues or pull requests.

## License

No license has been added yet. Unless a license is provided, all rights remain with the copyright holder; please contact the repository owner before redistributing or reusing this project.

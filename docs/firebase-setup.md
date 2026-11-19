# Connect ScriptType to Firebase

ScriptType already contains Firebase client initialization, email/password and
Google sign-in, Firestore progress reads, and a callable Cloud Function for
saving account practice. This guide connects those pieces to your Firebase
project. You need to supply project-specific settings; none are committed to
the repository.

## What is connected

| Firebase service | Current use |
|---|---|
| Authentication | Email/password and Google sign-in |
| Cloud Firestore | Reads user progress and practice sessions; access is controlled by `firestore.rules` |
| Cloud Functions | `completePractice` verifies practice and writes session/reward data server-side; `setRaceSettings`, race submission, and leaderboard callables manage opt-in daily race data; requires authentication and App Check |
| Firebase AI Logic | Client-side Gemini Developer API requests from the private reflection screen, only after explicit consent |
| App Check | Firebase AI Logic uses a localhost debug token during development and reCAPTCHA Enterprise for production Web requests |

Firebase Storage, Analytics, and push notifications are **not currently wired
into the app**. Do not treat those services as configured just because Firebase
is present.

## 1. Create and configure a Firebase project

1. In the [Firebase console](https://console.firebase.google.com/), create a
   project (or choose an existing development/staging project).
2. Register a **Web app** in Project settings. Copy its Firebase web config.
   The Firebase web API key is intended to be used in the browser; it is not an
   Admin credential. Never put a service-account key in a `NEXT_PUBLIC_*`
   variable.
3. In Firebase Console, open **AI Logic**, click **Get started**, choose the **Gemini
   Developer API** (the code uses `GoogleAIBackend`), and finish the setup for
   the existing ScriptType Web app. If prompted, select/register that app and
   complete the setup workflow. Do not stop while the AI Logic app status says
   **Unregistered**. This workflow enables the required APIs and configures the
   Firebase AI Logic API for the Firebase web API key.
4. In **Authentication → Sign-in method**, enable **Email/Password** and
   **Google**. Add the site host (for local development, `localhost`) to
   Authentication's authorized domains.
5. Create a **Cloud Firestore** database. The current callable function is
   deployed in `us-central1`; choose a nearby Firestore location before
   creating the database because its location cannot later be changed.
6. In **Security → App Check → Apps**, register the production Web app with
   **reCAPTCHA Enterprise**. Use a score-based Web key created for the correct
   domains; do not add `localhost` to a production key. AI Logic App Check is
   enforced, and callable practice also requires App Check.
7. In **Security → App Check → APIs**, check the **Firebase AI Logic**
   enforcement status. Keep replay protection disabled until the app is
   explicitly configured to use limited-use tokens.
8. If the Firebase API key has API restrictions, include
   `firebasevertexai.googleapis.com` in its allowed APIs.

## 2. Add local environment settings

Copy `.env.example` to `.env.local` in the repository root (the same level as
`package.json`). Populate the Firebase values from the web app config:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=your-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-web-app-id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_APPCHECK_ENTERPRISE_SITE_KEY=your-recaptcha-enterprise-site-key
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false
```

Use the exact values shown in your Firebase project settings; the example
values above are placeholders. The storage bucket and sender ID are currently
optional for the features connected here. Keep `.env.local` private and
untracked. Next.js embeds `NEXT_PUBLIC_*` values into browser bundles at build
time, so set the correct values in each deployment environment before building.

During `npm run dev`, the browser initializes Firebase App Check's debug mode
automatically (unless the emulator flag is enabled). Open `/reflection`, read
the debug token printed in the **browser console**, and register that token in
**Security → App Check → Apps → ScriptType → Manage debug tokens**. Keep the
token private and out of source control. For production, provide the
reCAPTCHA Enterprise site key above.

Then start the app:

```powershell
npm run dev
```

Open `http://localhost:3646/sign-in`. Create an email/password account or use
Google sign-in. A successful sign-in uses Firebase Authentication. Completing
practice while signed in calls `completePractice`; the server writes the
authoritative session and rewards. Signed-out practice remains device-local.

The app can be installed from supported browsers and caches selected app routes
for offline navigation. Offline account sessions are held in a bounded
localStorage queue and retried when the app is open and connectivity returns.
They do not receive account XP until the server confirms the submission.
Clearing browser storage can remove pending sessions. This is not a full
offline Firestore database and does not use Background Sync.

Daily race results are calculated and written by callable functions. Global
visibility is opt-in and uses the configured alias. Group race access requires
an existing Firebase group membership; this repository does not yet include
the group invite creation/join flow. Race elapsed time is measured client-side,
so results are not cheat-proof.

## 3. Run Firebase locally with emulators

Install the Firebase CLI once if it is not already available:

```powershell
npm install --global firebase-tools
firebase login
```

For emulator-only development, set these values in `.env.local`:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=local-emulator
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-scripttype-local.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-scripttype-local
NEXT_PUBLIC_FIREBASE_APP_ID=local-emulator
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=local-emulator
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-scripttype-local.firebasestorage.app
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

In separate terminals, start the emulators and the Next.js app:

```powershell
npm run emulators -- --project demo-scripttype-local
```

```powershell
npm run dev
```

The browser SDK connects Auth to `127.0.0.1:9099`, Firestore to
`127.0.0.1:8080`, and Functions to `127.0.0.1:5001` when the emulator flag is
true. The Emulator Suite UI is at `http://127.0.0.1:4000`. Emulator data is
local and separate from your production Firebase project. Turn the flag off
before using real Firebase services. Firebase AI Logic calls the real Firebase
backend, not an emulator; to test AI locally, use your real Firebase web
configuration with emulator mode off and register the local App Check debug
token.

Build the callable function independently with:

```powershell
npm run functions:build
```

## 4. Deploy Firebase services

The repository is linked to the production Firebase project
`scripttype-61c15`. For safer testing, replace this project ID with a separate
staging project in the commands below.

Build and deploy the Firestore rules, indexes, and callable Function:

```powershell
npm run deploy:firebase
```

The Function uses Node.js 20 and the `us-central1` region. Deploying Cloud
Functions requires a Firebase plan that supports Functions and the associated
Google Cloud billing setup.

## 5. Deploy the web app to Firebase Hosting

This app uses Firebase Hosting for a **static Next.js export**, not Firebase
App Hosting or server-side rendering. All current routes are pre-renderable:
the journey IDs come from checked-in data, and the optional `?verse=...`
selection is read in the browser. Authentication, Firestore, Firebase AI, and
callable Functions are browser-to-Firebase SDK integrations; there are no
Next.js API routes, server actions, request cookies, or server-only page data.

The Firebase Hosting config serves Next.js's `out` directory and maps its
`.html` files to clean URLs. There is intentionally no catch-all rewrite to
`/index.html`, which would incorrectly send every deep link to the landing
page.

Set the `NEXT_PUBLIC_FIREBASE_*` values in `.env.local` (or the production
environment used by the build) before deploying. These values are embedded
into the exported browser bundle at build time. Then run:

```powershell
npm run deploy:hosting
```

The script runs `next build` to generate `out` before deploying Hosting to
`scripttype-61c15`. Enable the Google and Email/Password providers, configure
Firestore, deploy the rules/indexes/Function, and allowlist the Hosting domain
in Firebase Authentication and App Check. Do not put Firebase Admin
credentials or service-account keys in `NEXT_PUBLIC_*` variables.

## 6. Deploy automatically from GitHub

`.github/workflows/firebase-hosting.yml` builds and deploys the static site to
the live Firebase Hosting channel whenever a commit reaches `main`. It also
supports a manual run from the GitHub Actions tab. The workflow deploys Hosting
only; Firestore rules, indexes, and Cloud Functions remain a separate,
intentional deployment.

The workflow reads the repository Actions secret
`FIREBASE_SERVICE_ACCOUNT_SCRIPTTYPE_61C15`. Its service account needs the
Firebase Hosting Admin and Service Usage Consumer roles on `scripttype-61c15`.
Create or rotate its JSON key in Google Cloud IAM, then add the full JSON as a
repository secret under **Settings → Secrets and variables → Actions**. Never
commit the key, put it in a workflow file, or expose it in logs. The key is
encrypted by GitHub as a repository secret and is not included in the build.

## Troubleshooting

- **Sign-in says Firebase is not configured:** check that all four required
  values (`API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, and `APP_ID`) are set in the
  root `.env.local`, then restart `npm run dev`.
- **Google sign-in reports an unauthorized domain:** add the current hostname
  in Firebase Authentication's authorized domains.
- **AI Logic shows the Web app as Unregistered:** complete **AI Logic → Get
  started** for the existing Firebase Web app and selected
  Gemini API provider. A Firebase Web app being `ACTIVE` does not mean the
  separate Firebase AI Logic onboarding step is complete.
- **Firebase AI Logic returns 403:** confirm the AI Logic Web app is registered,
  App Check is enforced for AI Logic, and a valid App Check token is present.
  For localhost, register the debug token printed in the browser console. For
  production, register the app with reCAPTCHA Enterprise and set
  `NEXT_PUBLIC_FIREBASE_APPCHECK_ENTERPRISE_SITE_KEY`.
- **API key request is denied:** compare all Firebase config fields with the
  same Web app in Project settings. If the key is API-restricted, allow
  `firebasevertexai.googleapis.com`. Firebase CLI's `firebase apps:sdkconfig
  WEB <app-id>` can retrieve the authoritative Web config.
- **Practice cannot be saved for a signed-in account:** verify App Check is
  registered with reCAPTCHA Enterprise, the site key matches
  `NEXT_PUBLIC_FIREBASE_APPCHECK_ENTERPRISE_SITE_KEY`, the hostname is allowed,
  and the Function is deployed with App Check enabled.
- **Permission denied reading progress:** deploy `firestore.rules` and ensure
  the user is signed in to the same Firebase project configured in the app.
- **Function not found or unavailable:** deploy Functions to the configured
  project and confirm that the project ID matches `.env.local`.
- **Emulator requests reach production:** set
  `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` before starting Next.js, and verify
  that the project ID passed to `npm run emulators` matches the one in
  `.env.local`.

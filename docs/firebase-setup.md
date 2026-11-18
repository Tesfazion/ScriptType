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
| Cloud Functions | `completePractice` verifies practice and writes session/reward data server-side; requires authentication and App Check |
| App Check | reCAPTCHA v3 client setup; a site key is required for deployed practice submissions |

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
3. In **Authentication → Sign-in method**, enable **Email/Password** and
   **Google**. Add the site host (for local development, `localhost`) to
   Authentication's authorized domains.
4. Create a **Cloud Firestore** database. The current callable function is
   deployed in `us-central1`; choose a nearby Firestore location before
   creating the database because its location cannot later be changed.
5. In **App Check**, register the web app with **reCAPTCHA v3**. Add your local
   and deployed hostnames to the reCAPTCHA key's allowed domains. Copy the
   reCAPTCHA **site key** (not the secret key). The function enforces App Check,
   so deployed practice submissions will fail until the site key is configured.

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
NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY=your-recaptcha-v3-site-key
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false
```

Use the exact values shown in your Firebase project settings; the example
values above are placeholders. The storage bucket and sender ID are currently
optional for the features connected here. Keep `.env.local` private and
untracked. Next.js embeds `NEXT_PUBLIC_*` values into browser bundles at build
time, so set the correct values in each deployment environment before building.

Then start the app:

```powershell
npm run dev
```

Open `http://localhost:3646/sign-in`. Create an email/password account or use
Google sign-in. A successful sign-in uses Firebase Authentication. Completing
practice while signed in calls `completePractice`; the server writes the
authoritative session and rewards. Signed-out practice remains device-local.

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
NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY=
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
before using real Firebase services.

Build the callable function independently with:

```powershell
npm run functions:build
```

## 4. Deploy Firebase rules, indexes, and functions

Use a staging Firebase project first. Build the function, then deploy the
Firestore rules, indexes, and Functions:

```powershell
npm run functions:build
firebase deploy --only firestore:rules,firestore:indexes,functions --project YOUR_FIREBASE_PROJECT_ID
```

Replace `YOUR_FIREBASE_PROJECT_ID` with the project ID from the Firebase
console. The function uses Node.js 20 and the `us-central1` region. Deploying
Cloud Functions requires a Firebase plan that supports Functions and the
associated Google Cloud billing setup.

Set the same web app config and reCAPTCHA site key in the hosting provider's
environment settings, then rebuild/redeploy the Next.js site. Firebase web
config is public configuration, but Admin credentials and other server
secrets must never be exposed as `NEXT_PUBLIC_*` values.

## 5. Hosting note

The `hosting` block in `firebase.json` points to a static `out` directory, but
this Next.js app is not configured for static export. Do not deploy the site
with `firebase deploy --only hosting` unless you first deliberately configure
and verify a compatible static export. Host the Next.js app on a Next.js
compatible provider (or configure Firebase App Hosting separately); the web
app can still use Firebase Authentication, Firestore, and Functions regardless
of where the UI is hosted.

## Troubleshooting

- **Sign-in says Firebase is not configured:** check that all four required
  values (`API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, and `APP_ID`) are set in the
  root `.env.local`, then restart `npm run dev`.
- **Google sign-in reports an unauthorized domain:** add the current hostname
  in Firebase Authentication's authorized domains.
- **Practice cannot be saved for a signed-in account:** verify App Check is
  registered with reCAPTCHA v3, the site key matches
  `NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY`, the hostname is allowed, and the
  Function is deployed with App Check enabled.
- **Permission denied reading progress:** deploy `firestore.rules` and ensure
  the user is signed in to the same Firebase project configured in the app.
- **Function not found or unavailable:** deploy Functions to the configured
  project and confirm that the project ID matches `.env.local`.
- **Emulator requests reach production:** set
  `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` before starting Next.js, and verify
  that the project ID passed to `npm run emulators` matches the one in
  `.env.local`.

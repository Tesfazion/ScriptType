import { getApps, initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "firebase/app-check";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import {
  connectFunctionsEmulator,
  getFunctions,
} from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
);

export const firebaseApp = firebaseConfigured
  ? (getApps()[0] ?? initializeApp(firebaseConfig))
  : null;

export const firebaseEmulatorsEnabled =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

export const firebaseAppCheck =
  firebaseApp &&
  typeof window !== "undefined" &&
  !firebaseEmulatorsEnabled &&
  process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY
    ? initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider(
          process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY,
        ),
        isTokenAutoRefreshEnabled: true,
      })
    : null;

export const firebaseAuth =
  firebaseApp && typeof window !== "undefined" ? getAuth(firebaseApp) : null;
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;
export const cloudFunctions =
  firebaseApp && typeof window !== "undefined"
    ? getFunctions(firebaseApp, "us-central1")
    : null;

if (firebaseEmulatorsEnabled && firebaseAuth && firestore && cloudFunctions) {
  connectAuthEmulator(firebaseAuth, "http://127.0.0.1:9099", {
    disableWarnings: true,
  });
  connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
  connectFunctionsEmulator(cloudFunctions, "127.0.0.1", 5001);
}

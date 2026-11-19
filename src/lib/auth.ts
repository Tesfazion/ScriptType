import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

function requireAuth() {
  if (!firebaseAuth) {
    throw new Error(
      "Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* settings to enable account sign-in.",
    );
  }
  return firebaseAuth;
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(requireAuth(), email, password);
}

export async function createAccount(
  name: string,
  email: string,
  password: string,
) {
  const credential = await createUserWithEmailAndPassword(
    requireAuth(),
    email,
    password,
  );
  await updateProfile(credential.user, { displayName: name });
  return credential;
}

export async function signInWithGoogle() {
  return signInWithPopup(requireAuth(), new GoogleAuthProvider());
}

export async function sendPasswordResetEmail(email: string) {
  return firebaseSendPasswordResetEmail(requireAuth(), email);
}

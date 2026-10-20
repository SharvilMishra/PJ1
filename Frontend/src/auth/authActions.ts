import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";

function requireAuth() {
  if (!auth) throw new Error("Firebase is not configured. Fill in Frontend/.env first.");
  return auth;
}

export async function signUp(email: string, password: string) { return createUserWithEmailAndPassword(requireAuth(), email, password); }
export async function signIn(email: string, password: string) { return signInWithEmailAndPassword(requireAuth(), email, password); }
export async function signInWithGoogle() { return signInWithPopup(requireAuth(), new GoogleAuthProvider()); }
export async function signOutUser() { return signOut(requireAuth()); }

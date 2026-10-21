import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  // Firebase web configuration is public client configuration. Keep access
  // protected with Firebase Authentication and Firestore Security Rules.
  apiKey: "AIzaSyAiDpUtr6HyE_7J-sj22jmFcB3u6bQ3bxI",
  authDomain: "ignite-1df6e.firebaseapp.com",
  projectId: "ignite-1df6e",
  storageBucket: "ignite-1df6e.firebasestorage.app",
  messagingSenderId: "233569488556",
  appId: "1:233569488556:web:4db65328486845f9559909",
};

export const firebaseConfigured = true;
export const firebaseApp = getApps().length ? getApp() : initializeApp(config);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

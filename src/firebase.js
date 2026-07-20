import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Projekt-Config (Auth + Firestore fürs Speichern der Userdaten)
const firebaseConfig = {
  apiKey: "AIzaSyD6iqVDxXM9d7P2BmEFFSECyrrh_aUYXr4",
  authDomain: "bodymap-6daa4.firebaseapp.com",
  projectId: "bodymap-6daa4",
  storageBucket: "bodymap-6daa4.firebasestorage.app",
  messagingSenderId: "913479152357",
  appId: "1:913479152357:web:f9da6e61dca0ddf7589a0c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
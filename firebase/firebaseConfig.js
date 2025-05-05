// firebase/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCibYHatyINBJTjBbyMj3G_WqZgJUj6xus",
  authDomain: "errands-app-mmb.firebaseapp.com",
  projectId: "errands-app-mmb",
  storageBucket: "errands-app-mmb.firebasestorage.app",
  messagingSenderId: "97985870085",
  appId: "1:97985870085:web:daaff6a1e92b8dad481f6c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

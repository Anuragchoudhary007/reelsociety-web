import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB5gRFu8JZMN2v9i4BHYRGcvqUfAnkEuvw",
  authDomain: "reelsociety-15428.firebaseapp.com",
  projectId: "reelsociety-15428",
  storageBucket: "reelsociety-15428.firebasestorage.app",
  messagingSenderId: "373428769400",
  appId: "1:373428769400:web:de7b42761a38b59577d38d",
  measurementId: "G-LT1N3Y1748"
}

// Prevent multiple initializations in Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
console.log(firebaseConfig)
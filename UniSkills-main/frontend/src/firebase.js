import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8-jFSuFKogk0JBcY0NU58kWrl8Syc0uI",
  authDomain: "uniskills-96225.firebaseapp.com",
  projectId: "uniskills-96225",
  storageBucket: "uniskills-96225.firebasestorage.app",
  messagingSenderId: "395762323190",
  appId: "1:395762323190:web:a001b792eafb63756aa6d7",
  measurementId: "G-EN3TJ8LM8Q"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

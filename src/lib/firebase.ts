// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-2694253795-a36d9",
  "appId": "1:1049150617946:web:ab13f5a9add75c78645b63",
  "storageBucket": "studio-2694253795-a36d9.firebasestorage.app",
  "apiKey": "AIzaSyDzmuUlsa27J1wRBULFPF4cQ7DjydquMD0",
  "authDomain": "studio-2694253795-a36d9.firebaseapp.com",
  "messagingSenderId": "1049150617946"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export { app, db };

// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRi2WrzJiuhe7ycsRNZcwmglqcLTPIfEc",
  authDomain: "deoapp-56eb9.firebaseapp.com",
  projectId: "deoapp-56eb9",
  storageBucket: "deoapp-56eb9.firebasestorage.app",
  messagingSenderId: "857633752168",
  appId: "1:857633752168:web:556f666e1d657827ad27dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialise Firestore and export it
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAUveYgm8XX3T3mjyn8UAJDNWkKS7vueBM",
  authDomain: "controlesolidario.firebaseapp.com",
  projectId: "controlesolidario",
  storageBucket: "controlesolidario.firebasestorage.app",
  messagingSenderId: "654544308272",
  appId: "1:654544308272:web:ed9d58865326fd4b0405f5",
  measurementId: "G-D1SBG7KN7R",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
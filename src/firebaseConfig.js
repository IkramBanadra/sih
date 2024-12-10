import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8Rlo1r_1bMadGAs6WOcLRNj4iuW4kCR8",
  authDomain: "sih2024-a16f8.firebaseapp.com",
  projectId: "sih2024-a16f8",
  storageBucket: "sih2024-a16f8.firebasestorage.app",
  messagingSenderId: "52485487058",
  appId: "1:52485487058:web:c2faa18225f507d44db00b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;

export { firebaseConfig };
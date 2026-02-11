import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBg1rNf2g1lHp-JL_JJBYho00rMnkEo0CQ",
  authDomain: "kash-16ae4.firebaseapp.com",
  projectId: "kash-16ae4",
  storageBucket: "kash-16ae4.firebasestorage.app",
  messagingSenderId: "31120879949",
  appId: "1:31120879949:web:3b5e3f835e8c4923d80704",
  measurementId: "G-RS8EVV3TTJ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("🔥 Banco de dados Kash conectado!");

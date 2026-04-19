import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAku-XiocDXpBAkk7r5RI_Bukt4nx709uM",
  authDomain: "interclasse-266bf.firebaseapp.com",
  projectId: "interclasse-266bf",
  storageBucket: "interclasse-266bf.firebasestorage.app",
  messagingSenderId: "209105220298",
  appId: "1:209105220298:web:98f24d21851d58f9f53a33"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

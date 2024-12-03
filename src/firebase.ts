import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4x78akXgUdv4UcGJaBzvlpc0uj_AnlHc",
  authDomain: "nwitter-reloaded-a2489.firebaseapp.com",
  projectId: "nwitter-reloaded-a2489",
  storageBucket: "nwitter-reloaded-a2489.firebasestorage.app",
  messagingSenderId: "401515948784",
  appId: "1:401515948784:web:4b2726b948a079bcb77035",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

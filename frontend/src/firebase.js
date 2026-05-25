import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA1TjZ1UMAn6OzUjOWKoppGmvKLYfy5xzU",
  authDomain: "school-management-41dcb.firebaseapp.com",
  projectId: "school-management-41dcb",
  storageBucket: "school-management-41dcb.firebasestorage.app",
  messagingSenderId: "382837297189",
  appId: "1:382837297189:web:2ed64c92b2c53b8941afcc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
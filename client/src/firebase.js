// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sofdes-61864.firebaseapp.com",
  projectId: "sofdes-61864",
  storageBucket: "sofdes-61864.appspot.com",
  messagingSenderId: "193018756586",
  appId: "1:193018756586:web:12ba40c621f6fdd05c4693"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmpt8k8WSEKi7V1rcUUrGUHnOkTkTVJps",
  authDomain: "headstarter-3da68.firebaseapp.com",
  projectId: "headstarter-3da68",
  storageBucket: "headstarter-3da68.appspot.com",
  messagingSenderId: "16154107604",
  appId: "1:16154107604:web:bd0a83335004c761a6e541",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

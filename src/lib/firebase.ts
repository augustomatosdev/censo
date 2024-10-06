import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyDJNeoQeWu_hPSXi86WcjrIcLjgl4MoG8E",
  authDomain: "censo-c02a3.firebaseapp.com",
  projectId: "censo-c02a3",
  storageBucket: "censo-c02a3.appspot.com",
  messagingSenderId: "607124334086",
  appId: "1:607124334086:web:6d373c125d2e63e0374587",
};

// Initialize Firebase

const app = getApps.length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.useDeviceLanguage(); // Use the device's language for authentication

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);

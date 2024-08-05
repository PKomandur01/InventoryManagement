import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOuw9Nz3OikGV0RNHdXPLhsqrwEcEmnKk",
  authDomain: "inventory-management-b334d.firebaseapp.com",
  projectId: "inventory-management-b334d",
  storageBucket: "inventory-management-b334d.appspot.com",
  messagingSenderId: "369830752099",
  appId: "1:369830752099:web:32c3a445a07c180967ad56",
  measurementId: "G-TXE9FWGRZM"
};

let app;
let firestore;
let analytics;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  firestore = getFirestore(app);
}

export { app, firestore };

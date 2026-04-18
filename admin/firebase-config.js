/**
 * Firebase Configuration - USL Admin Panel
 * Ultimate Speed Limited
 */

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2d2QoKUUWGLydDpgzQhBkyH5ONND0RNg",
  authDomain: "uslweb-c2d9c.firebaseapp.com",
  databaseURL: "https://uslweb-c2d9c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "uslweb-c2d9c",
  storageBucket: "uslweb-c2d9c.firebasestorage.app",
  messagingSenderId: "450947693009",
  appId: "1:450947693009:web:ab539d7233e04f8c0b48f0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export instances
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

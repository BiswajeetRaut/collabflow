import firebase from "firebase";
const firebaseConfig = {
    apiKey: {FIREBASE_API_KEY},
  authDomain: "collabflow-82014.firebaseapp.com",
  projectId: "collabflow-82014",
  storageBucket: "collabflow-82014.appspot.com",
  messagingSenderId: "488570500193",
  appId: "1:488570500193:web:e7f2a05d8a1a4722962620",
  measurementId: "G-XDT6E4ZYFP"
  };
// const firebaseApp = firebase.initializeApp(fireba)
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
export { auth, provider, storage};
export default db;

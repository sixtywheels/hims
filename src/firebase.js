// import firebase from 'firebase';
// import firebase from 'firebase/app';
import firebase from 'firebase/compat/app';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB1OVt7lf1oH3g1fO6rqsKVXU8tfK0jeQg",
    authDomain: "bt3103project-b69fb.firebaseapp.com",
    projectId: "bt3103project-b69fb",
    storageBucket: "bt3103project-b69fb.appspot.com",
    messagingSenderId: "812445459565",
    appId: "1:812445459565:web:5906c3c6112b56b7718b64",
    measurementId: "G-61XJMJD53T"
  };

  firebase.initializeApp(firebaseConfig);
  var database = firebase.firestore();
  export default database;

////////////////////

// import {initializeApp } from 'firebase/app';

// const firebaseConfig = {
//   apiKey: "AIzaSyB1OVt7lf1oH3g1fO6rqsKVXU8tfK0jeQg",
//   authDomain: "bt3103project-b69fb.firebaseapp.com",
//   projectId: "bt3103project-b69fb",
//   storageBucket: "bt3103project-b69fb.appspot.com",
//   messagingSenderId: "812445459565",
//   appId: "1:812445459565:web:5906c3c6112b56b7718b64",
//   measurementId: "G-61XJMJD53T"
// };
  
//   // Initialize Firebase
//   const firebaseApp = initializeApp(firebaseConfig);
//   export default firebaseApp
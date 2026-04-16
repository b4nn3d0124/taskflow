// src/index.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { App } from './app/App';

const firebaseConfig = {
  apiKey: "AIzaSyDfXpq_S5JrKsELbqUY4QXfubME5DJ8Mx8",
  authDomain: "taskflow-50cc8.firebaseapp.com",
  projectId: "taskflow-50cc8",
  storageBucket: "taskflow-50cc8.firebasestorage.app",
  messagingSenderId: "695913074142",
  appId: "1:695913074142:web:7ec2a5cbdb23a508cee14f",
  measurementId: "G-ZBFW2DB62F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const taskflowApp = new App(document.getElementById('app')!, auth, db);
taskflowApp.init();
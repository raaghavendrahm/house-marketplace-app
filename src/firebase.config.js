import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBB7zil8Myp2po_XSra1hfGqSg-FRORWJg',
  authDomain: 'house-marketplace-emulator.firebaseapp.com',
  projectId: 'house-marketplace-emulator',
  storageBucket: 'house-marketplace-emulator.appspot.com',
  messagingSenderId: '527177862933',
  appId: '1:527177862933:web:dd26e4aa6b30602200e31c',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();

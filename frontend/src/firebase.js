// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAOQvfQc69yY3hnLUMgcY3qacSm-7ddQZA",
    authDomain: "mysherpa-15898.firebaseapp.com",
    projectId: "mysherpa-15898",
    storageBucket: "mysherpa-15898.appspot.app",
    messagingSenderId: "300622646555",
    appId: "1:300622646555:web:471c15ff534182038dd7be"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
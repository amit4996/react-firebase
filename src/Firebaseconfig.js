import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage";
require('dotenv').config()


const firebaseConfig = {
  apiKey:process.env.API_KEY,
  authDomain: "reactfirebase-c14b0.firebaseapp.com",
  projectId: "reactfirebase-c14b0",
  storageBucket: "reactfirebase-c14b0.appspot.com",
  messagingSenderId: "125386572546",
  appId: "1:125386572546:web:f5b06779d98c95905db81b"
};


const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export const db= getFirestore(firebaseApp)
export {storage};




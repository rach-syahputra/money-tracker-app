// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAyD0h3OqUfIp46tdR5ZmX0DqsZwNPtgxQ',
  authDomain: 'money-tracker-app-8bec9.firebaseapp.com',
  projectId: 'money-tracker-app-8bec9',
  storageBucket: 'money-tracker-app-8bec9.appspot.com',
  messagingSenderId: '1043988389294',
  appId: '1:1043988389294:web:e8865b0d90a74396927c3f',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app)

export { app, auth, db, storage }

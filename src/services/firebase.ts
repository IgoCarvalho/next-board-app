import { initializeApp, getApps, getApp } from 'firebase/app'
import { collection, CollectionReference, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

if (!getApps().length) {
  initializeApp(firebaseConfig)
}

const app = getApp()
const database = getFirestore(app)

function createCollection<T>(collectionName: string) {
  return collection(database, collectionName) as CollectionReference<T>
}

export {
  app,
  database,
  createCollection
}

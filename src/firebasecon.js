import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDfhF4WNTYlVW1xyuK4MSNP8EcPRrRjcno',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'disneyhotstar-55ab1.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'disneyhotstar-55ab1',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'disneyhotstar-55ab1.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID || '631248049812',
  appId: process.env.FIREBASE_API_ID || '1:631248049812:web:70f5448e24bd840a548681',
  measurementId: process.env.FIREBASE_MEASURMENT_ID || 'G-RPXFGJWKLS'
}

export const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()
const storage = firebase.storage()

export { auth, provider, storage }
export default db

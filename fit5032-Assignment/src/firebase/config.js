
// Firebase Configuration File
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRTAJ9i3g1coNEnlk5fZe0wcBRvp_-fvU",
  authDomain: "fit5032-a3-xilongwang.firebaseapp.com",
  projectId: "fit5032-a3-xilongwang",
  storageBucket: "fit5032-a3-xilongwang.appspot.com",
  messagingSenderId: "964825487187",
  appId: "1:964825487187:web:577364a3f669801a5a73a6"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export authentication and database instances
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app

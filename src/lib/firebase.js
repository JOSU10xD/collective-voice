import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Safe initialization
let app;
let auth;
let db;
let storage;
let googleProvider;

try {
    // Only initialize if we have at least an API key, otherwise mock it
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key_here') {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        googleProvider = new GoogleAuthProvider();
    } else {
        throw new Error("Missing Firebase Config");
    }
} catch (error) {
    console.warn("Firebase not initialized (using mock mode):", error.message);

    // Mock objects to prevent crashes in other files
    const mockReturn = () => { console.log("Firebase mock call"); return Promise.resolve(); };
    auth = { currentUser: null, onAuthStateChanged: (cb) => { cb(null); return () => { }; }, signOut: mockReturn, signInWithPopup: mockReturn, signInWithEmailAndPassword: mockReturn, createUserWithEmailAndPassword: mockReturn };
    db = { _mock: true }; // Marker for other components to know
    storage = {};
    googleProvider = {};
}

export { auth, db, storage, googleProvider };
export default app;

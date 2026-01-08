import { createContext, useContext, useEffect, useState } from "react";
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { auth, db, googleProvider } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null); // Data from Firestore
    const [loading, setLoading] = useState(true);

    // Sync user to Firestore
    const syncUserToFirestore = async (user) => {
        if (!user || db._mock) {
            // Mock profile if db is mock
            if (db._mock) {
                setUserProfile({
                    displayName: user.displayName || "Demo User",
                    email: user.email || "demo@example.com",
                    photoURL: user.photoURL,
                    role: "user",
                    followedPolicies: []
                });
            }
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    displayName: user.displayName || "Anonymous",
                    email: user.email,
                    photoURL: user.photoURL,
                    role: "user",
                    createdAt: new Date().toISOString(),
                    followedPolicies: []
                });
                setUserProfile({
                    displayName: user.displayName || "Anonymous",
                    email: user.email,
                    photoURL: user.photoURL,
                    role: "user",
                    followedPolicies: []
                });
            } else {
                setUserProfile(userSnap.data());
            }
        } catch (e) {
            console.error("Firestore sync error", e);
        }
    };

    function signup(email, password, name) {
        // Mock fallback
        if (db._mock) {
            return new Promise(resolve => {
                const mockUser = { uid: 'mock-uid', email, displayName: name, photoURL: null };
                setCurrentUser(mockUser);
                syncUserToFirestore(mockUser);
                localStorage.setItem('mockUser', JSON.stringify(mockUser));
                resolve({ user: mockUser });
            });
        }
        return createUserWithEmailAndPassword(auth, email, password).then(async (result) => {
            await updateProfile(result.user, { displayName: name });
            await syncUserToFirestore({ ...result.user, displayName: name });
            return result;
        });
    }

    function login(email, password) {
        if (db._mock) {
            return new Promise(resolve => {
                const mockUser = { uid: 'mock-uid', email, displayName: 'Demo User', photoURL: null };
                setCurrentUser(mockUser);
                syncUserToFirestore(mockUser);
                localStorage.setItem('mockUser', JSON.stringify(mockUser));
                resolve({ user: mockUser });
            });
        }
        return signInWithEmailAndPassword(auth, email, password);
    }

    function loginWithGoogle() {
        if (db._mock) {
            return new Promise(resolve => {
                const mockUser = { uid: 'mock-uid-google', email: 'google@demo.com', displayName: 'Google User', photoURL: null };
                setCurrentUser(mockUser);
                syncUserToFirestore(mockUser);
                localStorage.setItem('mockUser', JSON.stringify(mockUser));
                resolve({ user: mockUser });
            });
        }
        return signInWithPopup(auth, googleProvider);
    }

    function logout() {
        if (db._mock) {
            setCurrentUser(null);
            setUserProfile(null);
            localStorage.removeItem('mockUser');
            return Promise.resolve();
        }
        return signOut(auth);
    }

    useEffect(() => {
        // If mocked, we simulate a guest or logged-out state initially
        if (db._mock) {
            console.log("Running in Mock Auth Mode");
            const stored = localStorage.getItem('mockUser');
            if (stored) {
                const user = JSON.parse(stored);
                setCurrentUser(user);
                syncUserToFirestore(user);
            }
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await syncUserToFirestore(user);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        signup,
        login,
        loginWithGoogle,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

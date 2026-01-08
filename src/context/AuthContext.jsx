import { createContext, useContext, useEffect, useState } from "react";
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { auth, db, googleProvider, storage } from "../lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

    // Changing function signature
    async function signup(email, password, name, photoFile = null) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        let photoURL = null;

        if (photoFile) {
            try {
                const storageRef = ref(storage, `profiles/${result.user.uid}`);
                const snapshot = await uploadBytes(storageRef, photoFile);
                photoURL = await getDownloadURL(snapshot.ref);
            } catch (err) {
                console.error("Error uploading profile photo:", err);
            }
        }

        await updateProfile(result.user, {
            displayName: name,
            photoURL: photoURL
        });

        // Sync triggers automatically via onAuthStateChanged, but explicit sync ensures faster UI update?
        // onAuthStateChanged will fire, but we might want to ensure Firestore has the FULL data including photoURL immediately.
        // syncUserToFirestore uses 'user' object. We should pass the updated details.
        // Actually onAuthStateChanged might grab the user object *before* updateProfile completes if we are not careful?
        // No, result.user is the object. updateProfile updates it on backend. locally we need to reload or manually object.

        await syncUserToFirestore({
            ...result.user,
            displayName: name,
            photoURL: photoURL,
            uid: result.user.uid,
            email: result.user.email
        });

        return result;
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

    // Listen to user profile in Firestore
    useEffect(() => {
        let unsubscribeProfile = null;

        // If mocked, we simulate a guest or logged-out state initially
        if (db._mock) {
            console.log("Running in Mock Auth Mode");
            const stored = localStorage.getItem('mockUser');
            if (stored) {
                const user = JSON.parse(stored);
                setCurrentUser(user);
                // Mock profile setting
                setUserProfile({
                    displayName: user.displayName || "Demo User",
                    email: user.email || "demo@example.com",
                    photoURL: user.photoURL,
                    role: "user",
                    followedPolicies: []
                });
            }
            setLoading(false);
            return;
        }

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            // Clean up previous profile listener if user changes or logs out
            if (unsubscribeProfile) {
                unsubscribeProfile();
                unsubscribeProfile = null;
            }

            if (user) {
                const userRef = doc(db, "users", user.uid);

                unsubscribeProfile = onSnapshot(userRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data());
                    } else {
                        // Create profile if keys missing
                        const newProfile = {
                            displayName: user.displayName || "Anonymous",
                            email: user.email,
                            photoURL: user.photoURL,
                            role: "user",
                            createdAt: new Date().toISOString(),
                            followedPolicies: []
                        };
                        await setDoc(userRef, newProfile);
                        setUserProfile(newProfile);
                    }
                }, (error) => {
                    console.error("Profile sync error:", error);
                });
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) unsubscribeProfile();
        };
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

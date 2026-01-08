import React, { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
// import { updateProfile } from "firebase/auth"; // Removed to avoid URL limit
import { compressImage, estimateDataUrlSizeBytes } from "../utils/imageUtils";

export default function AvatarUploader({ className }) {
    const [user, setUser] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(async (u) => {
            setUser(u);
            if (u) {
                try {
                    const userDocRef = doc(db, "users", u.uid);
                    const snap = await getDoc(userDocRef);
                    if (snap.exists()) {
                        const data = snap.data();
                        if (data.photoBase64) setPhoto(data.photoBase64);
                        else if (u.photoURL) setPhoto(u.photoURL);
                    } else if (u.photoURL) {
                        setPhoto(u.photoURL);
                    }
                } catch (err) {
                    console.warn("Avatar read failed:", err);
                }
            } else {
                setPhoto(null);
            }
        });
        return () => unsub();
    }, []);

    async function handleFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setMessage("");
        setLoading(true);
        try {
            const dataUrl = await compressImage(file, 512, 0.7);
            const sizeBytes = estimateDataUrlSizeBytes(dataUrl);
            const LIMIT = 700 * 1024;
            if (sizeBytes > LIMIT) {
                setMessage(`Image too large (${Math.round(sizeBytes / 1024)} KB). Try a smaller image.`);
                setLoading(false);
                return;
            }
            if (!user) throw new Error("Sign in first.");

            const userDocRef = doc(db, "users", user.uid);
            // Only update Firestore, do NOT update Auth Profile with giant string
            await setDoc(userDocRef, { photoBase64: dataUrl }, { merge: true });

            setPhoto(dataUrl);
            setMessage("Avatar uploaded and saved to Firestore.");
        } catch (err) {
            console.error(err);
            setMessage("Upload failed: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={className || ""}>
            <div className="mb-3">
                {photo ? (
                    <img src={photo} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">No photo</div>
                )}
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                {loading ? "Uploading..." : "Choose & Upload"}
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>

            {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </div>
    );
}

# CollectiveVoice

A global petitions platform with a dedicated section for Viswajyothi College. Built with React, Vite, Tailwind CSS, and Firebase.

## Features

- **Global & Local Feeds**: Switch between global petitions and Viswajyothi campus-specific petitions.
- **Create Petitions**: Rich form with image uploads.
- **Real-time Signatures**: Live updates on signature counts.
- **Micro-interactions**: Animated confetti on signing, smooth transitions, and hover effects.
- **Authentication**: Google Sign-In and Email/Password auth.
- **Responsive**: Mobile-first design with a collapsible sidebar/drawer.
- **Share**: Integrated Web Share API.

## Getting Started

### 1. Prerequisites

- Node.js installed.
- A Firebase project (Free tier).

### 2. Installation

```bash
# Install dependencies
npm install
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project "CollectiveVoice".
3. **Authentication**: Enable "Email/Password" and "Google" providers.
4. **Firestore Database**: Create a database. Start in **Test Mode** (or see Rules below).
5. **Storage**: Enable Storage. Start in **Test Mode**.
6. **Project Settings**: 
   - Register a Web App.
   - Copy the `firebaseConfig` keys.

### 4. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in the values from your Firebase Console.

### 5. Running the App

```bash
npm run dev
```

Visit `http://localhost:5173`.

---

## Firestore Rules (Security)

For production, use these rules to secure your data:

**Firestore Rules:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Petitions: Readable by all, writable by auth users
    match /petitions/{petitionId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null; // Ideally restrict fields
      
      // Signatures subcollection
      match /signatures/{userId} {
        allow read: if true;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Users: Users can read/write their own profile
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Storage Rules:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /petitions/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
  }
}
```

## Security Considerations

- **API Keys**: Firebase API keys are safe to expose in client code, but ensure you set **Authorized Domains** in Firebase Console -> Authentication -> Settings to prevent abuse.
- **Quotas**: Firebase Free Plan (Spark) has limits on reads/writes. This app uses denormalized counts to minimize reads, but heavy traffic may hitting limits.

## Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS, Headless UI
- **Animations**: Framer Motion, Canvas Confetti
- **Backend**: Firebase (Auth, Firestore, Storage)

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const firebaseStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const firebaseMessagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const firebaseMeasurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

const missingPublicKeys = [
    !firebaseApiKey ? "NEXT_PUBLIC_FIREBASE_API_KEY" : null,
    !firebaseAuthDomain ? "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" : null,
    !firebaseProjectId ? "NEXT_PUBLIC_FIREBASE_PROJECT_ID" : null,
    !firebaseStorageBucket ? "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" : null,
    !firebaseMessagingSenderId ? "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" : null,
    !firebaseAppId ? "NEXT_PUBLIC_FIREBASE_APP_ID" : null,
].filter(Boolean) as string[];

if (missingPublicKeys.length > 0) {
    throw new Error(`Missing Firebase env vars: ${missingPublicKeys.join(", ")}`);
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: firebaseApiKey,
    authDomain: firebaseAuthDomain,
    projectId: firebaseProjectId,
    storageBucket: firebaseStorageBucket,
    messagingSenderId: firebaseMessagingSenderId,
    appId: firebaseAppId,
    measurementId: firebaseMeasurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);
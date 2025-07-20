import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyBQ7b6dYdHb-_NkOLo7lWok0IXDvELqwCs",
    authDomain: "hackathon-fiap-7c916.firebaseapp.com",
    projectId: "hackathon-fiap-7c916",
    storageBucket: "hackathon-fiap-7c916.firebasestorage.app",
    messagingSenderId: "458443648742",
    appId: "1:458443648742:web:80915b3fc117064b269527",
    measurementId: "G-PZMCBKS6G5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

if (typeof window !== 'undefined') {
    import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
        isSupported().then((supported) => {
            if (supported) {
                getAnalytics(app);
            }
        });
    });
}
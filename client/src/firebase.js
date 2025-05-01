import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBNQ98oyBLkkKIZcqPvVzu0w8qLbskA5qU",
    authDomain: "airbnb-clone-dbcd1.firebaseapp.com",
    projectId: "airbnb-clone-dbcd1",
    storageBucket: "airbnb-clone-dbcd1.firebasestorage.app",
    messagingSenderId: "339644846302",
    appId: "1:339644846302:web:f1cfcf0b0dcee56f80f24f",
    measurementId: "G-3Y4CW2M08Q",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

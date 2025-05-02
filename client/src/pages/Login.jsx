import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // ✅ Send user info to your backend
            await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                }),
            });

            console.log("User info sent to backend");
        } catch (error) {
            console.error("Google login error:", error);
        }
    };

    return (
        <div>
            <button onClick={handleGoogleLogin}>Sign in with Google</button>
        </div>
    );
};

export default Login;

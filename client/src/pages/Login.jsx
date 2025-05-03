import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            console.log("User signed in:", user);

            // Send to backend
            await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                }),
            });

            console.log("User info sent to backend");

            navigate("/listings");
        } catch (error) {
            console.error("Google login error:", error);
        }
    };

    return (
        <div>
            <h2>Login with Google</h2>
            <button onClick={handleGoogleLogin}>Sign in with Google</button>
        </div>
    );
};

export default Login;

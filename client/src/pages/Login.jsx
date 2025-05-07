import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "/Login.css";
import logo from "../assets/logo.png";

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                }),
            });

            navigate("/listings");
        } catch (error) {
            console.error("Google login error:", error);
        }
    };

    return (
        <div className="login-background">
            <div className="login-card">
                <img src={logo} alt="Chistay Logo" className="login-logo" />
                <h2 className="login-title">Welcome to Sasti Masti</h2>
                <button className="login-button" onClick={handleGoogleLogin}>
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;

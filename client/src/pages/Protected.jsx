import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Protected = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const callProtectedAPI = async () => {
        if (!user) return alert("Please log in first");

        const token = await user.getIdToken();

        const res = await fetch("http://localhost:5000/api/users/protected", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        console.log(data);
        alert(data.message);
    };

    return (
        <div>
            <h2>Welcome to the protected page, {user.displayName}!</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Protected;

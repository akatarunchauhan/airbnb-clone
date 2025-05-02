import React from "react";
import { useAuth } from "../context/AuthContext";
import { data } from "react-router-dom";

const Protected = () => {
    const { user } = useAuth();

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
            <h2>Test Protected Route</h2>
            <button onClick={callProtectedAPI}>Call Protected API</button>
        </div>
    );
};

export default Protected;

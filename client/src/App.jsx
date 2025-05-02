import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Protected from "./pages/Protected";

const App = () => {
    const { user } = useAuth(); // Get current user from context

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route
                path="/protected"
                element={user ? <Protected /> : <Login />}
            />
        </Routes>
    );
};

export default App;

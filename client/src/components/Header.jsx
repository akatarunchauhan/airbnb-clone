import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header style={styles.header}>
            <div>
                <Link to="/protected" style={styles.link}>
                    Dashboard
                </Link>
            </div>
            {user && (
                <div style={styles.userSection}>
                    <span style={styles.userText}>Hi, {user.displayName}</span>
                    <button onClick={handleLogout} style={styles.button}>
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
};

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem",
        background: "#f5f5f5",
        borderBottom: "1px solid #ccc",
        fontFamily: "Arial",
    },
    userSection: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
    },
    userText: {
        fontWeight: "bold",
    },
    button: {
        padding: "0.5rem 1rem",
        cursor: "pointer",
    },
    link: {
        textDecoration: "none",
        color: "black",
        fontWeight: "bold",
    },
};

export default Header;

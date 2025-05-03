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
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
            <Link className="navbar-brand" to="/">
                Airbnb Clone
            </Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ms-auto">
                    {user && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/listings">
                                    Listings
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/create">
                                    Create Listing
                                </Link>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link">
                                    Hello, {user.displayName}
                                </span>
                            </li>
                            <li className="nav-item">
                                <button
                                    onClick={logout}
                                    className="btn btn-outline-danger btn-sm"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                    {!user && (
                        <li className="nav-item">
                            <Link
                                className="btn btn-outline-primary btn-sm"
                                to="/"
                            >
                                Login
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
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

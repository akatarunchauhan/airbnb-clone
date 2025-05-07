import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3">
            <Link className="navbar-brand d-flex align-items-center" to="/">
                <img
                    src={logo}
                    alt="Chistay Logo"
                    style={{ height: "40px", marginRight: "10px" }}
                />
                <span className="fw-bold text-white">Chistay</span>
            </Link>

            <div className="ms-auto d-flex align-items-center position-relative">
                {user ? (
                    <div className="position-relative" ref={dropdownRef}>
                        <button
                            className="btn d-flex align-items-center text-white"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <img
                                src={
                                    user.photoURL ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        user.displayName
                                    )}&background=random`
                                }
                                alt="Profile"
                                className="rounded-circle me-2"
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    border: "2px solid white",
                                }}
                            />
                            <span className="fw-semibold">
                                {user.displayName}
                            </span>
                        </button>

                        {dropdownOpen && (
                            <div
                                className="dropdown-menu dropdown-menu-end show mt-2 animate__animated animate__fadeIn"
                                style={{
                                    background: "rgba(30, 30, 30, 0.85)",
                                    backdropFilter: "blur(12px)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                    boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
                                    minWidth: "220px",
                                    overflow: "hidden",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <Link
                                    className="dropdown-item text-white"
                                    to="/listings"
                                >
                                    Listings
                                </Link>
                                <Link
                                    className="dropdown-item text-white"
                                    to="/create"
                                >
                                    Create Listing
                                </Link>
                                <Link
                                    className="dropdown-item text-white"
                                    to="/my-listings"
                                >
                                    My Listings
                                </Link>
                                <Link
                                    className="dropdown-item text-white"
                                    to="/my-bookings"
                                >
                                    My Bookings
                                </Link>
                                <Link
                                    className="dropdown-item text-white"
                                    to="/host-dashboard"
                                >
                                    Host Dashboard
                                </Link>
                                <div className="dropdown-divider"></div>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link className="btn btn-outline-light" to="/">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Header;

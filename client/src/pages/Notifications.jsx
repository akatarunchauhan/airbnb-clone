import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/notifications/${user.uid}`
            );
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: "PATCH",
            });
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    useEffect(() => {
        if (user?.uid) {
            fetchNotifications();
        }
    }, [user]);

    useEffect(() => {
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="min-vh-100 text-light"
            style={{ background: "transparent" }}
        >
            <Header />
            <div className="container mt-4">
                <h2>Notifications</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : notifications.length === 0 ? (
                    <p>No notifications yet.</p>
                ) : (
                    <ul className="list-group">
                        {notifications.map((n) => (
                            <li
                                key={n.id}
                                className={`list-group-item d-flex justify-content-between align-items-center ${
                                    n.is_read
                                        ? "bg-secondary text-light"
                                        : "bg-dark text-white fw-bold"
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => markAsRead(n.id)}
                            >
                                <div>
                                    📬 {n.message}
                                    <br />
                                    <span
                                        className="text-muted"
                                        style={{ fontSize: "0.8rem" }}
                                    >
                                        {formatDistanceToNow(
                                            new Date(n.created_at),
                                            { addSuffix: true }
                                        )}
                                    </span>
                                </div>
                                {!n.is_read && (
                                    <span className="badge bg-warning text-dark">
                                        New
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notifications;

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import { reauthenticateWithCredential } from "firebase/auth";

const HostBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHostBookings = async () => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/bookings/host/${user.uid}`
            );
            const data = await res.json();
            setBookings(data);
        } catch (err) {
            console.error("Failed to fetch host bookings", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, action) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/bookings/${id}/${action}`,
                { method: "PATCH" }
            );
            if (res.ok) {
                setBookings((prev) =>
                    prev.map((b) =>
                        b.id === id
                            ? {
                                  ...b,
                                  status:
                                      action === "approve"
                                          ? "approved"
                                          : "rejected",
                              }
                            : b
                    )
                );
            }
        } catch (err) {
            console.error("Failed to update bookin status:", err);
        }
    };

    useEffect(() => {
        if (user?.uid) fetchHostBookings();
    }, [user]);

    return (
        <div>
            <Header />
            <div className="container mt-4 text-light">
                <h2>Booking Requests</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : bookings.length === 0 ? (
                    <p>No booking requests found.</p>
                ) : (
                    <div className="row">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="col-md-6 mb-3">
                                <div className="card bg-dark text-light p-3 shadow">
                                    <img
                                        src={booking.image_url}
                                        alt={booking.title}
                                        style={{
                                            height: "180px",
                                            width: "100%",
                                            objectFit: "cover",
                                        }}
                                        className="rounded"
                                    />
                                    <div className="mt-2">
                                        <h5>{booking.title}</h5>
                                        <p>
                                            Dates:{" "}
                                            {new Date(
                                                booking.start_date
                                            ).toLocaleDateString()}{" "}
                                            -{" "}
                                            {new Date(
                                                booking.end_date
                                            ).toLocaleDateString()}
                                        </p>
                                        <p>
                                            Status:{" "}
                                            <strong>{booking.status}</strong>
                                        </p>
                                        {booking.status === "pending" && (
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() =>
                                                        updateStatus(
                                                            booking.id,
                                                            "approve"
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        updateStatus(
                                                            booking.id,
                                                            "reject"
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostBookings;

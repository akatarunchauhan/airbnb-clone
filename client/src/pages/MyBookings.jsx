import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/bookings/user/${user.uid}`
                );
                if (!res.ok) throw new Error("Failed to fetch bookings");
                const data = await res.json();
                setBookings(data);
            } catch (err) {
                console.error("Error fetching bookings: ", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.uid) {
            fetchBookings();
        }
    }, [user]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want ot cancel this booking?"))
            return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/bookings/${bookingId}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) throw new Error("Failed to cancel booking");

            setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        } catch (err) {
            console.error("Cancel error:", err);
            alert("Something went wrong while cancelling. Please try again.");
        }
    };

    return (
        <div>
            <Header />
            <div className="container mt-4">
                <h2>My Bookings</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : bookings.length === 0 ? (
                    <p>You haven't booked any listings yet.</p>
                ) : (
                    <div className="row">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <img
                                        src={booking.image_url}
                                        alt={booking.title}
                                        className="card-img-top"
                                        style={{
                                            height: "200px",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {booking.title}
                                        </h5>
                                        <p className="card-text">
                                            From:{" "}
                                            {new Date(
                                                booking.start_date
                                            ).toLocaleDateString()}
                                            <br />
                                            To:{" "}
                                            {new Date(
                                                booking.end_date
                                            ).toLocaleDateString()}
                                            <br />
                                            {new Date(booking.end_date) >
                                                new Date() && (
                                                <button
                                                    className="btn btn-danger mt-2"
                                                    onClick={() =>
                                                        handleCancel(booking.id)
                                                    }
                                                >
                                                    Cancel Booking
                                                </button>
                                            )}
                                        </p>
                                        {new Date(booking.end_date) <
                                            new Date() &&
                                            !booking.has_review && (
                                                <Link
                                                    to={`/leave-review/${booking.id}/${booking.listing_id}`}
                                                    className="btn btn-sm btn-outline-light mt-2"
                                                >
                                                    Leave Review
                                                </Link>
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

export default MyBookings;

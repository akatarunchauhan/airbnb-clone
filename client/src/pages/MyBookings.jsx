import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
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
                                        </p>
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

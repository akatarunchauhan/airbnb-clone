import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import { Link } from "react-router-dom";

const HostDashboard = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/listings/user/${user.uid}`
                );
                const data = await res.json();
                setListings(data);
            } catch (err) {
                console.error("Failed to fetch host listings:", err);
            }
        };

        if (user?.uid) {
            fetchListings();
        }
    }, [user]);

    useEffect(() => {
        const fetchHostBookings = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/bookings/host/${user.uid}`
                );
                const data = await res.json();
                setBookings(data);
            } catch (err) {
                console.error("Failed to fetch host bookings:", err);
            }
        };

        if (user?.uid) {
            fetchHostBookings();
        }
    }, [user]);

    const totalBookings = bookings.length;
    const totalEarnings = bookings.reduce((sum, b) => sum + Number(b.price), 0);

    // Count bookings per listing
    const bookingCountMap = {};
    bookings.forEach((b) => {
        bookingCountMap[b.listing_id] =
            (bookingCountMap[b.listing_id] || 0) + 1;
    });
    const mostBookedId = Object.entries(bookingCountMap).sort(
        (a, b) => b[1] - a[1]
    )[0]?.[0];
    const mostBooked = bookings.find((b) => b.listing_id == mostBookedId);

    return (
        <div>
            <Header />
            <div className="container mt-4">
                <h2>Host Dashboard</h2>
                {listings.length === 0 ? (
                    <p>You haven't created any listings yet.</p>
                ) : (
                    <div className="row">
                        <div className="mb-4">
                            <h4>Booking Stats</h4>
                            <p>
                                <strong>Total Bookings:</strong> {totalBookings}
                            </p>
                            <p>
                                <strong>Total Earnings:</strong> ₹
                                {totalEarnings}
                            </p>
                            {mostBooked && (
                                <div>
                                    <p>
                                        <strong>Most Booked Listing:</strong>{" "}
                                        {mostBooked.title}
                                    </p>
                                    <img
                                        src={mostBooked.image_url}
                                        alt={mostBooked.title}
                                        style={{
                                            width: "200px",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {listings.map((listing) => (
                            <div key={listing.id} className="col-md-4 mb-3">
                                <div className="card h-100">
                                    <img
                                        src={listing.image_url}
                                        alt={listing.title}
                                        className="card-img-top"
                                        style={{
                                            height: "200px",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {listing.title}
                                        </h5>
                                        <p>{listing.location}</p>
                                        <p>
                                            <strong>₹{listing.price}</strong>
                                        </p>
                                        <Link
                                            to={`/edit-listing/${listing.id}`}
                                            className="btn btn-sm btn-primary me-2"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={async () => {
                                                if (
                                                    window.confirm(
                                                        "Are you sure you want to delete this listing?"
                                                    )
                                                ) {
                                                    await fetch(
                                                        `http://localhost:5000/api/listings/${listing.id}`,
                                                        { method: "DELETE" }
                                                    );
                                                    setListings(
                                                        listings.filter(
                                                            (l) =>
                                                                l.id !==
                                                                listing.id
                                                        )
                                                    );
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
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

export default HostDashboard;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import ReviewsSection from "../components/ReviewsSection";

const ListingDetail = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [bookingMessage, setBookingMessage] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);

    console.log("Logged in user:", user);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/reviews/${id}`
                );
                if (!res.ok) {
                    throw new Error("Failed to fetch reviews");
                }
                const data = await res.json();
                setReviews(data.reviews || []);
                setAverageRating(data.averageRating || null);
            } catch (error) {
                console.error("Error loading reviews:", error);
                setReviews([]);
            }
        };

        fetchReviews();
    }, [id]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/listings/${id}`
                );
                if (!res.ok) {
                    throw new Error("Listing not found");
                }
                const data = await res.json();
                setListing(data);
            } catch (err) {
                console.error("Error loading listing:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    const handleBooking = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.uid,
                    listing_id: listing.id,
                    start_date: startDate,
                    end_date: endDate,
                }),
            });

            if (res.ok) {
                setBookingMessage("Booking Successful!");
                setStartDate("");
                setEndDate("");
            } else {
                const errData = await res.json();
                setBookingMessage("Booking failed: " + errData.error);
            }
        } catch (err) {
            console.error("Booking error:", err);
            setBookingMessage("Booking failed due to a server error.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/listings/${id}`,
                    {
                        method: "DELETE",
                    }
                );

                if (res.ok) {
                    console.log("Successfully deleted, navigating...");
                    navigate("/listings", { state: { refetch: true } });
                } else {
                    console.error("Delete failed");
                }
            } catch (err) {
                console.error("Delete error:", err);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div
            className="min-vh-100 text-light"
            style={{ background: "transparent" }}
        >
            <Header />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-8">
                        <img
                            src={listing.image_url}
                            alt={listing.title}
                            className="img-fluid rounded mb-3"
                            style={{
                                width: "100%",
                                height: "400px",
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />
                    </div>
                    <ReviewsSection listingId={listing.id} />

                    <div className="col-md-4">
                        <div className="bg-dark p-3 rounded shadow">
                            <h2>{listing.title}</h2>
                            <p>
                                <strong>Location:</strong> {listing.location}
                            </p>
                            <p>
                                <strong>Price:</strong> ₹{listing.price}
                            </p>
                            <p>{listing.description}</p>

                            {user?.uid === listing.user_id && (
                                <div className="mt-3">
                                    <Link
                                        to={`/edit-listing/${listing.id}`}
                                        className="btn btn-primary me-2"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}

                            {user?.uid !== listing.user_id && (
                                <div className="mt-4 p-3 bg-secondary rounded shadow">
                                    <h5>Book This Listing</h5>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={startDate}
                                            onChange={(e) =>
                                                setStartDate(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={endDate}
                                            onChange={(e) =>
                                                setEndDate(e.target.value)
                                            }
                                        />
                                    </div>
                                    <button
                                        className="btn btn-success"
                                        onClick={handleBooking}
                                        disabled={!startDate || !endDate}
                                    >
                                        Book Now
                                    </button>
                                    {bookingMessage && (
                                        <div className="mt-2 alert alert-info">
                                            {bookingMessage}
                                        </div>
                                    )}
                                    {averageRating && (
                                        <div className="mt-3">
                                            <h5>
                                                ⭐ Average Rating:{" "}
                                                {averageRating}/5
                                            </h5>
                                        </div>
                                    )}

                                    <div className="mt-3">
                                        <h5>Guest Reviews</h5>
                                        {reviews.length === 0 ? (
                                            <p>No reviews yet.</p>
                                        ) : (
                                            reviews.map((r) => (
                                                <div
                                                    key={r.id}
                                                    className="border rounded p-2 mb-2 bg-dark text-white"
                                                >
                                                    <strong>
                                                        {r.display_name}
                                                    </strong>{" "}
                                                    – ⭐ {r.rating}
                                                    <p>{r.comment}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LeaveReview = () => {
    const { booking_id, listing_id } = useParams();
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const checkExistingReview = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/reviews/booking/${booking_id}`
                );
                const data = await res.json();
                setAlreadyReviewed(data.hasReview);
            } catch (err) {
                console.error("Error checking review status:", err);
            }
        };

        checkExistingReview();
    }, [booking_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    booking_id,
                    listing_id,
                    user_id: user.uid,
                    rating,
                    comment,
                }),
            });

            if (res.ok) {
                setMessage("✅ Review submitted successfully!");
                setAlreadyReviewed(true);
            } else {
                const err = await res.json();
                setMessage(`❌ ${err.error}`);
            }
        } catch (err) {
            console.error("Failed to submit review:", err);
            setMessage("❌ Failed to submit review.");
        }
    };

    if (alreadyReviewed) {
        return (
            <div className="container mt-4 text-light">
                <h4>You have already reviewed this stay.</h4>
            </div>
        );
    }

    return (
        <div className="container mt-4 text-light">
            <h3>Leave a Review</h3>
            {message && <div className="alert alert-info mt-3">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Rating (1–5)</label>
                    <select
                        className="form-select"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5].map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Comment</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-primary" type="submit">
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default LeaveReview;

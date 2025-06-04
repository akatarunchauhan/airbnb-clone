import React, { useEffect, useState } from "react";

const ReviewsSection = ({ listingId }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/reviews/${listingId}`
                );
                if (!res.ok) throw new Error("Failed to fetch reviews");

                const data = await res.json();

                // Ensure the expected structure exists
                if (Array.isArray(data.reviews)) {
                    setReviews(data.reviews);
                    setAverageRating(data.averageRating);
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
                setError("Could not load reviews.");
            }
        };

        fetchReviews();
    }, [listingId]);

    return (
        <div className="mt-5">
            <h4>Reviews</h4>
            {error && <p className="text-danger">{error}</p>}
            {averageRating && (
                <p className="text-warning fw-bold">
                    🌟 Average Rating: {averageRating} / 5
                </p>
            )}
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <ul className="list-group">
                    {reviews.map((r) => (
                        <div
                            key={r.id}
                            className="border rounded p-2 mb-2 bg-dark text-white"
                        >
                            <strong>{r.display_name}</strong> – ⭐ {r.rating}
                            <p>{r.comment}</p>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReviewsSection;

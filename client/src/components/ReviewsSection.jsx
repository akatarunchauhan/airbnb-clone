import React, { useEffect, useState } from "react";

const ReviewsSection = ({ listingId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/reviews/${listingId}`
                );
                const data = await res.json();
                setReviews(data);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            }
        };

        fetchReviews();
    }, [listingId]);

    const averageRating = reviews.length
        ? (
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : null;

    return (
        <div className="mt-5">
            <h4>Reviews</h4>
            {averageRating && (
                <p className="text-warning fw-bold">
                    🌟 Average Rating: {averageRating} / 5
                </p>
            )}
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <ul className="list-group">
                    {Array.isArray(reviews) && reviews.length > 0 ? (
                        reviews.map((r) => (
                            <div
                                key={r.id}
                                className="border rounded p-2 mb-2 bg-dark text-white"
                            >
                                <strong>{r.display_name}</strong> – ⭐{" "}
                                {r.rating}
                                <p>{r.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default ReviewsSection;

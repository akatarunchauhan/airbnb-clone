import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const ListingDetail = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    console.log("Logged in user:", user);

    const navigate = useNavigate();

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
                    navigate("/listings");
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
        <div>
            <Header />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-8">
                        <img
                            src={listing.image_url}
                            alt={listing.title}
                            className="img-fluid rounded mb-3"
                        />
                    </div>
                    <div className="col-md-4">
                        <h2>{listing.title}</h2>
                        <p>
                            <strong>Location:</strong> {listing.location}
                        </p>
                        <p>
                            <strong>Price:</strong> ₹{listing.price}
                        </p>
                        <p>{listing.description}</p>
                        {console.log("User UID:", user?.uid)}
                        {console.log("Listing User ID:", listing.user_id)}

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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;

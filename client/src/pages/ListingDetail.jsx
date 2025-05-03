import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

const ListingDetail = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;

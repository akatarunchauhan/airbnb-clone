import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const Listings = () => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/listings");
                const data = await res.json();
                setListings(data);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            }
        };

        fetchListings();
    }, []);
    return (
        <div>
            <Header />
            <div className="container mt-4">
                <h2>Available Listings</h2>
                <div className="row">
                    {listings.map((listing) => (
                        <div key={listing.id} className="col-md-4 mb-3">
                            <div className="card">
                                <img
                                    src={listing.image_url}
                                    alt={listing.title}
                                    className="card-img-top"
                                />
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {listing.title}
                                    </h5>
                                    <p className="card-text">
                                        {listing.location}
                                    </p>
                                    <p>
                                        <strong>₹{listing.price}</strong>
                                    </p>
                                    <p>{listing.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Listings;

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";

const Listings = () => {
    const [listings, setListings] = useState([]);
    const location = useLocation();

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

        if (listings.length === 0 || location.state?.refetch) {
            fetchListings();
        }
    }, [location]);

    return (
        <div className="min-vh-100" style={{ background: "transparent" }}>
            <Header />
            <div className="container mt-4 text-light">
                <h2 className="mb-4">Available Listings</h2>
                <div className="row">
                    {listings.map((listing) => (
                        <div key={listing.id} className="col-md-4 mb-3">
                            <div className="card h-100 bg-dark text-light shadow">
                                <Link to={`/listings/${listing.id}`}>
                                    <img
                                        src={listing.image_url}
                                        alt={listing.title}
                                        className="card-img-top"
                                        style={{
                                            height: "200px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Link>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <Link
                                            to={`/listings/${listing.id}`}
                                            className="text-decoration-none text-light"
                                        >
                                            {listing.title}
                                        </Link>
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

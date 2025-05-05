import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const MyListings = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchUserListings = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/listings/user/${user.uid}`
                );
                const data = await res.json();
                setListings(data);
            } catch (err) {
                console.error("Failed to fetch user listings:", err);
            }
        };

        if (user?.uid) fetchUserListings();
    }, [user]);

    return (
        <div>
            <Header />
            <div className="container mt-4">
                <h2>My Listings</h2>
                <div className="row">
                    {listings.length === 0 ? (
                        <p>You haven't created any listings yet.</p>
                    ) : (
                        listings.map((listing) => (
                            <div key={listing.id} className="col-md-4 mb-3">
                                <div className="card h-100">
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
                                                className="text-decoration-none text-dark"
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
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyListings;

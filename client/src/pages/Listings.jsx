import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";

const Listings = () => {
    const [listings, setListings] = useState([]);
    const location = useLocation();
    const [filters, setFilters] = useState({
        location: "",
        minPrice: "",
        maxPrice: "",
        startDate: "",
        endDate: "",
    });

    const handleInputChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const fetchListings = async () => {
        try {
            const query = new URLSearchParams(filters);
            const res = await fetch(
                `http://localhost:5000/api/listings?${query}`
            );
            const data = await res.json();
            setListings(data);
        } catch (error) {
            console.error("Failed to fetch listins:", error);
        }
    };

    useEffect(() => {
        if (listings.length === 0 || location.state?.refetch) {
            fetchListings();
        }
    }, [location]);

    return (
        <div className="min-vh-100" style={{ background: "transparent" }}>
            <Header />
            <div className="container mt-4 text-light">
                <h2 className="mb-4">Available Listings</h2>

                <div className="row g-2 mb-4">
                    <div className="col-md-2">
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={filters.location}
                            className="form-control"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            className="form-control"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            className="form-control"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            className="form-control"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            className="form-control"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <button
                            className="btn btn-primary w-100"
                            onClick={fetchListings}
                        >
                            Search
                        </button>
                    </div>
                </div>
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
                                    {listing.available_from &&
                                        listing.available_to && (
                                            <p
                                                className="text-muted"
                                                style={{ fontSize: "0.9rem" }}
                                            >
                                                Available:{" "}
                                                {new Date(
                                                    listing.available_from
                                                ).toLocaleDateString()}{" "}
                                                to{" "}
                                                {new Date(
                                                    listing.available_to
                                                ).toLocaleDateString()}
                                            </p>
                                        )}
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

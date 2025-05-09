import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        price: "",
        image_url: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/listings/${id}`
                );
                if (!res.ok) throw new Error("Failed to load listing");
                const data = await res.json();

                if (data.user_id !== user?.uid) {
                    throw new Error("Unauthorized");
                }

                setFormData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id, user]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageData = new FormData();
        imageData.append("image", file);

        try {
            const res = await fetch("http://localhost:5000/api/uploads", {
                method: "POST",
                body: imageData,
            });

            const data = await res.json();
            setFormData((prev) => ({
                ...prev,
                image_url: data.imageUrl,
            }));
        } catch (error) {
            console.error("Image upload failed:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(
                `http://localhost:5000/api/listings/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!res.ok) throw new Error("Failed to update listing");

            navigate(`/listings/${id}`);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div
            className="min-vh-100 text-light"
            style={{ background: "transparent" }}
        >
            <Header />
            <div className="container mt-4">
                <div className="bg-dark p-4 rounded shadow">
                    <h2 className="mb-4">Edit Listing</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input
                                name="title"
                                className="form-control bg-secondary text-light border-0"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Location</label>
                            <input
                                name="location"
                                className="form-control bg-secondary text-light border-0"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Price</label>
                            <input
                                name="price"
                                type="number"
                                className="form-control bg-secondary text-light border-0"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {formData.image_url && (
                            <div className="mb-3">
                                <img
                                    src={formData.image_url}
                                    alt="Current Listing"
                                    className="img-fluid rounded"
                                    style={{ maxHeight: "200px" }}
                                />
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label">
                                Upload New Image
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-control bg-secondary text-light border-0"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <button className="btn btn-success">
                            Update Listing
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditListing;

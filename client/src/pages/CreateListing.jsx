import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const CreateListing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        price: "",
        image_url: "",
        description: "",
        available_from: "",
        available_to: "",
        user_id: user.uid,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                navigate("/listings");
            } else {
                console.error("Fal=iled to create listing");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("http://localhost:5000/api/uploads", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setFormData((prev) => ({ ...prev, image_url: data.imageUrl }));
    };

    return (
        <div
            className="min-vh-100 text-light"
            style={{ background: "transparent" }}
        >
            <Header />
            <div className="container mt-4">
                <div className="bg-dark p-4 rounded shadow">
                    <h2 className="mb-4">Create New Listing</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control bg-secondary text-light border-0"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="form-control bg-secondary text-light border-0"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-light">
                                Available From
                            </label>
                            <input
                                type="date"
                                name="available_from"
                                value={formData.available_from}
                                className="form-control"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        available_from: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-light">
                                Available To
                            </label>
                            <input
                                type="date"
                                name="available_to"
                                value={formData.available_to}
                                className="form-control"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        available_to: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Price (₹)</label>
                            <input
                                type="text"
                                name="price"
                                className="form-control bg-secondary text-light border-0"
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
                            <label className="form-label">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="form-control bg-secondary text-light border-0"
                            />
                            {formData.image_url && (
                                <img
                                    src={formData.image_url}
                                    alt="Uploaded Preview"
                                    className="mt-2 rounded"
                                    style={{
                                        height: "200px",
                                        objectFit: "cover",
                                    }}
                                />
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-control bg-secondary text-light border-0"
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Create Listing
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateListing;

import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Protected from "./pages/Protected";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import CreateListing from "./pages/CreateListing";

import EditListing from "./pages/EditListing";
import MyListings from "./pages/MyListings";
import MyBookings from "./pages/MyBookings";

const App = () => {
    const { user } = useAuth(); // Get current user from context

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route
                path="/protected"
                element={user ? <Protected /> : <Login />}
            />
            <Route
                path="/create"
                element={user ? <CreateListing /> : <Login />}
            />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/edit-listing/:id" element={<EditListing />} />
            <Route
                path="/my-listings"
                element={user ? <MyListings /> : <Login />}
            />
            <Route
                path="/my-bookings"
                element={user ? <MyBookings /> : <Login />}
            />
        </Routes>
    );
};

export default App;

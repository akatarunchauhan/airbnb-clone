import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Protected from "./pages/Protected";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import CreateListing from "./pages/CreateListing";
import ProtectedRoute from "./components/ProtectedRoute";
import EditListing from "./pages/EditListing";
import MyListings from "./pages/MyListings";
import MyBookings from "./pages/MyBookings";
import HostDashboard from "./pages/HostDashboard";
import HostBookings from "./pages/HostBookings";
import Notifications from "./pages/Notifications";
import MessageCenter from "./pages/MessageCenter";
import "./App.css";

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />

            <Route
                path="/protected"
                element={
                    <ProtectedRoute>
                        <Protected />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-bookings"
                element={
                    <ProtectedRoute>
                        <HostBookings />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create"
                element={
                    <ProtectedRoute>
                        <CreateListing />
                    </ProtectedRoute>
                }
            />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetail />} />

            <Route
                path="/edit-listing/:id"
                element={
                    <ProtectedRoute>
                        <EditListing />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my-listings"
                element={
                    <ProtectedRoute>
                        <MyListings />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my-bookings"
                element={
                    <ProtectedRoute>
                        <MyBookings />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-dashboard"
                element={
                    <ProtectedRoute>
                        <HostDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <Notifications />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/messages"
                element={
                    <ProtectedRoute>
                        <MessageCenter />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default App;

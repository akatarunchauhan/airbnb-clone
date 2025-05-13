import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const MessageCenter = () => {
    const { user } = useAuth();
    const { booking_id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const [recipientId, setRecipientId] = useState(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/messages/${booking_id}`
            );
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        if (!recipientId) {
            console.error("recipientId is null. Cannot send message.");
            return;
        }

        console.log("Sending message to recipientId:", recipientId);

        try {
            const res = await fetch("http://localhost:5000/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    booking_id,
                    sender_id: user.uid,
                    recipient_id: recipientId,
                    content: newMessage,
                }),
            });

            if (res.ok) {
                setNewMessage("");
                fetchMessages();
            } else {
                const error = await res.json();
                console.error("Failed to send message:", error);
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/bookings/${booking_id}`
                );
                const booking = await res.json();
                console.log("Fetched booking:", booking);

                const otherParty =
                    user.uid === booking.user_id
                        ? booking.listing_user_id
                        : booking.user_id;

                setRecipientId(otherParty);
            } catch (err) {
                console.error("Failed to fetch booking:", err);
            }
        };

        if (user?.uid && booking_id) {
            fetchBooking();
        }
    }, [booking_id, user]);

    useEffect(() => {
        if (booking_id) {
            fetchMessages();
        }
    }, [booking_id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="min-vh-100 text-light bg-dark">
            <Header />
            <div className="container mt-4">
                <h3>Message Center</h3>
                <div
                    className="bg-secondary p-3 rounded"
                    style={{ height: "60vh", overflowY: "auto" }}
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`d-flex ${
                                msg.sender_id === user.uid
                                    ? "justify-content-end"
                                    : "justify-content-start"
                            } mb-2`}
                        >
                            <div
                                className={`p-2 rounded ${
                                    msg.sender_id === user.uid
                                        ? "bg-primary text-white"
                                        : "bg-light text-dark"
                                }`}
                                style={{ maxWidth: "75%" }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="mt-3 d-flex">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button className="btn btn-success" onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageCenter;

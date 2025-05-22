import express from "express";
import pool from "../db/index.js";

const router = express.Router();

// Get a specific booking by ID and include host user_id

router.post("/", async (req, res) => {
    const { user_id, listing_id, start_date, end_date } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO bookings (user_id, listing_id, start_date, end_date, status)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user_id, listing_id, start_date, end_date, "pending"]
        );

        const booking = result.rows[0];

        const hostRes = await pool.query(
            "SELECT user_id FROM listings WHERE id = $1",
            [listing_id]
        );

        const host_id = hostRes.rows[0]?.user_id;

        if (host_id) {
            await pool.query(
                `INSERT INTO notifications (user_id, message, type, booking_id)
                VALUES ($1, $2, $3, $4)`,
                [
                    host_id,
                    `New booking request for your listing (ID: ${listing_id})`,
                    "booking_request",
                    booking.id,
                ]
            );
        }

        res.status(201).json(booking);
    } catch (err) {
        console.error("Booking error:", err);
        res.status(500).json({ error: "Failed to create booking" });
    }
});

router.get("/host/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT b.*, l.title, l.price, l.image_url
            FROM bookings b
            JOIN listings l ON b.listing_id = l.id
            WHERE l.user_id = $1
            ORDER BY b.start_date DESC`,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Host bookings fetch error:", err);
        res.status(500).json({ error: "Failed to fetch host bookings" });
    }
});

// Get all bookings for a user (guest)
router.get("/user/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT b.*, l.title, l.image_url,
  EXISTS (
    SELECT 1 FROM reviews r WHERE r.booking_id = b.id
  ) AS has_review
FROM bookings b
JOIN listings l ON b.listing_id = l.id
WHERE b.user_id = $1
ORDER BY b.start_date DESC
`,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching bookings for user:", err);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "SELECT end_date FROM bookings WHERE id = $1",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const endDate = new Date(result.rows[0].end_date);
        if (endDate < new Date()) {
            return res
                .status(400)
                .json({ error: "Cannot cancel past bookings" });
        }

        await pool.query("DELETE FROM bookings WHERE id = $1", [id]);
        res.json({ message: "Booking cancelled successfully" });
    } catch (err) {
        console.error("Error cancelling booking:", err);
        res.status(500).json({ error: "Failed to cancel booking" });
    }
});

router.put("/status/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    try {
        const result = await pool.query(
            "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );
        const updatedBooking = result.rows[0];

        await pool.query(
            `INSERT INTO notifications (user_id, message, type, booking_id)
    VALUES ($1, $2, $3, $4)`,
            [
                updatedBooking.user_id,
                `Your booking has been ${status}.`,
                `booking_${status}`,
                updatedBooking.id,
            ]
        );
        res.json({ message: `Booking ${status}` });
    } catch (err) {
        console.error("Error updating booking status:", err);
        res.status(500).json({ error: "Failed to update the booking status" });
    }
});

router.patch("/:id/approve", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            "UPDATE bookings SET status = 'approved' WHERE id = $1",
            [id]
        );
        res.json({ message: "Booking approved" });
    } catch (err) {
        console.error("Error approving booking:", err);
        res.status(500).json({ error: "Failed to approve booking" });
    }
});

router.patch("/:id/reject", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            "UPDATE bookings SET status = 'rejected' WHERE id = $1",
            [id]
        );
        res.json({ message: "Booking rejected" });
    } catch (err) {
        console.error("Error rejecting booking:", err);
        res.status(500).json({ error: "Failed to reject booking" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT b.*, l.user_id AS listing_user_id
            FROM bookings b
            JOIN listings l ON b.listing_id = l.id
            WHERE b.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching booking by ID:", err);
        res.status(500).json({ error: "Failed to fetch booking" });
    }
});

export default router;

import express from "express";
import pool from "../db/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { user_id, listing_id, start_date, end_date } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO bookings (user_id, listing_id, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *`,
            [user_id, listing_id, start_date, end_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Booking error:", err);
        res.status(500).json({ error: "Failed to create booking" });
    }
});

router.get("/user/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT b.*, l.title, l.image_url
            FROM bookings b
            JOIN listings l ON b.listing_id = l.id
            WHERE b.user_id = $1
            ORDER BY b.start_date DESC
            `,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Fetch bookings error:", err.message, err.stack);
        res.status(500).json({ error: "Failed to fetch bookings" });
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

export default router;

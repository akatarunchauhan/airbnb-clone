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
            JOIN listing l on b.listing_id = l.id
            WHERE b.user_id = $1
            ORDER BY b.start_date DESC
            `,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Fetch bookings error:", err);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

export default router;

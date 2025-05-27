import express from "express";
import pool from "../db/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { booking_id, listing_id, user_id, rating, comment } = req.body;

    try {
        // Check if the booking already has a review
        const existing = await pool.query(
            "SELECT * FROM reviews WHERE booking_id = $1",
            [booking_id]
        );
        if (existing.rows.length > 0) {
            return res
                .status(400)
                .json({ error: "Review already exists for this booking." });
        }

        const result = await pool.query(
            `INSERT INTO reviews (booking_id, listing_id, user_id, rating, comment)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [booking_id, listing_id, user_id, rating, comment]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating review:", err);
        res.status(500).json({ error: "Failed to create review" });
    }
});

router.get("/:listing_id", async (req, res) => {
    const { listing_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT r.*, u.display_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE listing_id = $1
            ORDER BY r.created_at DESC`,
            [listing_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

router.get("/booking/:booking_id", async (req, res) => {
    const { booking_id } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM reviews WHERE booking_id = $1",
            [booking_id]
        );
        res.json({ hasReview: result.rows.length > 0 });
    } catch (err) {
        console.error("Error checking review existence:", err);
        res.status(500).json({ error: "Failed to check review status" });
    }
});

export default router;

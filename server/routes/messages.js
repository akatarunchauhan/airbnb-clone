import express from "express";
import pool from "../db/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { booking_id, sender_id, recipient_id, content } = req.body;

    if (!recipient_id) {
        return res.status(400).json({ error: "Recipient ID is required" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO messages (booking_id, sender_id, recipient_id, content, is_read)
             VALUES ($1, $2, $3, $4, false) RETURNING *`,
            [booking_id, sender_id, recipient_id, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Send message error:", err);
        res.status(500).json({ error: "Failed to send message" });
    }
});

router.get("/unread-count/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT COUNT(*) FROM messages
            WHERE is_read = false AND recipient_id = $1`,
            [user_id]
        );
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        console.error("Unread count error:", err);
        res.status(500).json({ error: "Failed to get unread count" });
    }
});

router.get("/:booking_id", async (req, res) => {
    const { booking_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM messages
            WHERE booking_id = $1
            ORDER BY created_at ASC`,
            [booking_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Fetch messages error:", err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

router.patch("/:id/read", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(`UPDATE messages SET is_read = true WHERE id = $1`, [
            id,
        ]);
        res.json({ message: "Message marked as read" });
    } catch (err) {
        console.error("Mark as read error:", err);
        res.status(500).json({ error: "Failed to mark as read" });
    }
});

router.get("/unread-count/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT COUNT(*) FROM messages
            WHERE is_read = false AND recipient_id = $1`,
            [user_id]
        );
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        console.error("Unread count error:", err);
        res.status(500).json({ error: "Failed to get unread count" });
    }
});

export default router;

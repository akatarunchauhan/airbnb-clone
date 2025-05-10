import express from "express";
import pool from "../db/index.js";

const router = express.Router();

router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

router.patch("/:id/read", async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(
            `UPDATE notifications SET is_read = true WHERE id = $1`,
            [id]
        );
        res.json({ message: "Notification marked as read" });
    } catch (err) {
        console.error("Error marking notification as read:", err);
        res.status(500).json({ error: "Failed to mark as read" });
    }
});

router.get("/:user_id/unread-count", async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query(
            "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false",
            [user_id]
        );
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        console.error("Error fetching unread count:", err);
        res.status(500).json({
            error: "Failed to get unread notifications count",
        });
    }
});

export default router;

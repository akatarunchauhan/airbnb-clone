import express from "express";
import pool from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching users : ", err);
        res.status(500).json({
            error: "Server error",
        });
    }
});

router.post("/", async (req, res) => {
    const { name, email } = req.body;

    try {
        const existing = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existing.rows.length === 0) {
            await pool.query(
                "INSERT INTO users (name, email) VALUES ($1, $2)",
                [name, email]
            );
        }
        res.status(200).json({ message: "User saved" });
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

export default router;

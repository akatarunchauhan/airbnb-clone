import express from "express";
import pool from "../db/index.js";
// import { messaging } from "firebase-admin";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT  * FROM listings ORDER BY id DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM listings WHERE id = $1",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching listing by ID:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, location, price, image_url, description, user_id } =
            req.body;
        const result = await pool.query(
            `INSERT INTO listings (title, location, price, image_url, description, user_id)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, location, price, image_url, description, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(500).json({ error: "Failed to create listing" });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, location, price, image_url, description } = req.body;

    try {
        await pool.query(
            "UPDATE listings SET title=$1, location=$2, price=$3, image_url = $4, description=$5 WHERE id=$6",
            [title, location, price, image_url, description, id]
        );
        res.join({ message: "Listing updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update listing" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM listings WHERE id = $1", [id]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete listing" });
    }
});

export default router;

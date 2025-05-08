import express from "express";
import pool from "../db/index.js";
// import { messaging } from "firebase-admin";

const router = express.Router();

router.get("/", async (req, res) => {
    const { location, minPrice, maxPrice, startDate, endDate } = req.query;

    let query = "SELECT * FROM listings WHERE 1=1";
    const values = [];

    if (location) {
        values.push(`%${location.toLowerCase()}%`);
        query += ` AND LOWER(location) LIKE $${values.length}`;
    }

    if (minPrice) {
        values.push(Number(minPrice));
        query += ` AND price >= $${values.length}`;
    }

    if (maxPrice) {
        values.push(Number(maxPrice));
        query += ` AND price <= $${values.length}`;
    }

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error("Failed to fetch filtered listings:", err);
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});

router.get("/user/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM listings WHERE user_id = $1 ORDER BY id DESC",
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching user's listings: ", err);
        res.status(500).json({ error: "Failed to fetch user's listings" });
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
        res.json({ message: "Listing updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update listing" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM listings WHERE id = $1", [id]);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete listing" });
    }
});

export default router;

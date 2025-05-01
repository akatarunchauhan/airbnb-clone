import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const { Pool } = pg;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.get("/", (req, res) => {
    res.send("API is running!!");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

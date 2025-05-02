import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import listingsRoutes from "./routes/listings.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/listings", listingsRoutes);

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("API is running!!");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import listingsRoutes from "./routes/listings.js";
import bookingRoutes from "./routes/bookings.js";
import uploadRoutes from "./routes/uploads.js";
import notificationRoutes from "./routes/notifications.js";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/uploads", uploadRoutes);

app.use("/api/listings", listingsRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
    res.send("API is running!!");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

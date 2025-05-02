import admin from "../firebaseAdmin.js";

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

export default authenticate;

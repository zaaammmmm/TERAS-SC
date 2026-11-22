// backend/server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Import models to register them
import "./models/Booking.js";
import "./models/Room.js";
import "./models/User.js";

// Routes
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import roomRoutes from "./routes/rooms.js";

// Import the connectDB function from the db.js file
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  "https://terassc.netlify.app",
  "https://terassc.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5000",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Requests without Origin (curl/server-to-server) are allowed.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked origin: ${origin}`));
    }
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Ensure MongoDB is connected before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    return res.status(503).json({
      message: "Database service temporarily unavailable",
    });
  }
});

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);

app.use("/", (req, res) => {
  res.json("req dari" + req.path);
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;

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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: ["https://terassc.netlify.app", "https://terassc.netlify.app/", "http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://localhost:5000"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);
app.use("/", (req, res) => {
  res.json("req dari" + req.path);
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

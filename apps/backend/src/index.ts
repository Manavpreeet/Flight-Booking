import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import flightRoutes from "./routes/flightRoutes";
import flightStatusRoutes from "./routes/flightStatusRoutes";
import { setupSwagger } from "./config/swagger";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/flights/status", flightStatusRoutes);
// Root Route
app.get("/", (req, res) => {
    res.json({ message: "Flight Booking API is running 🚀" });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

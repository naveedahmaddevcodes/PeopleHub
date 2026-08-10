import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import { protect, authorize } from "./middleware/authMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow cookies
  }),
);
app.use(express.json());
app.use(cookieParser());

// Base route
app.get("/", (req, res) => {
  res.json({ message: "PeopleHub API is running" });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Employee routes
app.use("/api/employees", employeeRoutes);

// Sample protected route (demonstrates protect + authorize)
app.get("/api/demo/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Hello admin", user: req.user.name });
});

app.get(
  "/api/demo/manager",
  protect,
  authorize("admin", "manager"),
  (req, res) => {
    res.json({ message: "Hello manager", user: req.user.name });
  },
);

app.get("/api/demo/employee", protect, (req, res) => {
  res.json({ message: "Hello employee", user: req.user.name });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

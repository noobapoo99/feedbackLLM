import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes.js";
import { verifyToken } from "./middleware/auth.js";
import { verifyRole } from "./middleware/role.js";
import productRoutes from "./routes/product.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import globalAnalyticsRoutes from "./routes/globalAnalytics.routes.js";
import uploadCsvRoutes from "./routes/uploadCsv.routes.js";
import { registerSocketHandlers } from "./socket.js";
import chatRoutes from "./routes/chat.routes.js";
const app = express();
const prisma = new PrismaClient();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//app.use(cors());
app.use(express.json());
/* app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.path);
  next();
}); */
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/products", productRoutes);
app.use("/admin/csv", uploadCsvRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/analytics/global", globalAnalyticsRoutes);
app.use("/reviews", reviewRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/chat", chatRoutes);
app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.get("/admin-only", verifyToken, verifyRole("ADMIN"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

//app.listen(5001, () => console.log("Server running on port 5001"));
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Register all socket handlers
registerSocketHandlers(io);

// Start server
server.listen(5001, () =>
  console.log("🚀 Server + Socket.IO running on port 5001")
);

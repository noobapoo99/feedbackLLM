import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes.js";
import { verifyToken } from "./middleware/auth.js";
import { verifyRole } from "./middleware/role.js";
import productRoutes from "./routes/product.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.path);
  next();
});
app.use("/auth", authRoutes);

app.use("/products", productRoutes);

app.use("/assignments", assignmentRoutes);

app.use("/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.get("/admin-only", verifyToken, verifyRole("ADMIN"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

app.listen(5001, () => console.log("Server running on port 5001"));

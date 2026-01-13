import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/database";
import { errorHandler } from "./middlewares/errorHandler";

// Routes
import authRoutes from "./modules/auth/routes/auth.routes";

const app: Application = express();

/* ======================
   GLOBAL MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logs requests in dev
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* ======================
   HEALTH CHECK
====================== */
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

/* ======================
   API ROUTES
====================== */
app.use("/api/auth", authRoutes);

/* ======================
   ERROR HANDLER
   (must be last)
====================== */
app.use(errorHandler);

/* ======================
   SERVER + DB
====================== */
const PORT = Number(process.env.PORT) || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;

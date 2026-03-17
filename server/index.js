import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Allow the dev client origin (Vite default) and any override via env var.
// Also allow any localhost port (e.g. Vite might run on 5173/5174/5175/5176 etc).
// If you prefer to allow all origins while developing, set CLIENT_ORIGIN to "*".
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:5175",
  "http://localhost:5176",
];

app.use(
  cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*") || /http:\/\/localhost:\d+/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "E-Learning platform API is running" });
});

async function start() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/elearning";
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

start();

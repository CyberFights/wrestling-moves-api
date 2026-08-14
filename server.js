import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import movesRoutes from "./routes/moves.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/moves", movesRoutes);
app.use("/api/upload", uploadRoutes);

// Root
app.get("/", (req, res) => {
  res.json({ status: "Wrestling Moves API (MongoDB + IMGBB + Categories) running" });
});

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));

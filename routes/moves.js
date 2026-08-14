import express from "express";
import multer from "multer";
import FormData from "form-data";
import fetch from "node-fetch";
import Move from "../models/Move.js";
import {
  getMoves,
  getMove,
  createMove,
  updateMove,
  deleteMove
} from "../controllers/movesController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const VALID_CATEGORIES = ["Strike", "Grapple", "Power", "Submission"];

// CRUD
router.get("/", getMoves);
router.get("/:id", getMove);
router.post("/", createMove);
router.put("/:id", updateMove);
router.delete("/:id", deleteMove);

// CREATE move + upload image (IMGBB)
router.post("/create-with-image", upload.single("image"), async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name || !description || !category) {
      return res
        .status(400)
        .json({ error: "Name, description, and category required" });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image file required" });
    }

    const base64 = req.file.buffer.toString("base64");

    const form = new FormData();
    form.append("image", base64);

    const resp = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: "POST",
        body: form
      }
    );

    const data = await resp.json();

    if (!data.success) {
      return res
        .status(500)
        .json({ error: "Image upload failed", details: data });
    }

    const move = await Move.create({
      name,
      description,
      category,
      image: data.data.url
    });

    res.json({ ok: true, move });
  } catch (err) {
    console.error("Create-with-image error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// CATEGORY: list all categories
router.get("/categories", (req, res) => {
  res.json(VALID_CATEGORIES);
});

// CATEGORY: get moves by category
router.get("/category/:category", async (req, res) => {
  const category = req.params.category;

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  const moves = await Move.find({ category });
  res.json(moves);
});

// CATEGORY: random move from category
router.get("/random/:category", async (req, res) => {
  const category = req.params.category;

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  const moves = await Move.find({ category });
  if (moves.length === 0) {
    return res.status(404).json({ error: "No moves found in this category" });
  }

  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  res.json(randomMove);
});

export default router;

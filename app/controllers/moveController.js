import Move from "../models/Move.js";

// GET all moves
export const getMoves = async (req, res) => {
  const moves = await Move.find();
  res.json(moves);
};

// GET one move
export const getMove = async (req, res) => {
  const move = await Move.findById(req.params.id);
  if (!move) return res.status(404).json({ error: "Move not found" });
  res.json(move);
};

// CREATE move (no image upload)
export const createMove = async (req, res) => {
  try {
    const move = await Move.create(req.body);
    res.json(move);
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err.message });
  }
};

// UPDATE move
export const updateMove = async (req, res) => {
  try {
    const move = await Move.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!move) return res.status(404).json({ error: "Move not found" });
    res.json(move);
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err.message });
  }
};

// DELETE move
export const deleteMove = async (req, res) => {
  const move = await Move.findByIdAndDelete(req.params.id);
  if (!move) return res.status(404).json({ error: "Move not found" });
  res.json({ message: "Move deleted" });
};
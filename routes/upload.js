import express from "express";
import multer from "multer";
import FormData from "form-data";
import fetch from "node-fetch";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
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
      return res.status(500).json({ error: "Upload failed", details: data });
    }

    res.json({
      ok: true,
      url: data.data.url,
      viewer: data.data.url_viewer
    });
  } catch (err) {
    console.error("IMGBB upload error:", err);
    res.status(500).json({ error: "Upload error" });
  }
});

export default router;

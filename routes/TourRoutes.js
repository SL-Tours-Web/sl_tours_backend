import express from "express";
import Tour from "../models/Tour.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= PUBLIC ================= */
// Get active tours (Client side)
router.get("/", async (req, res) => {
  const tours = await Tour.find({ status: "Active" }).sort({ createdAt: -1 });
  res.json(tours);
});

/* ================= ADMIN ================= */
// Get all tours
router.get("/admin", authMiddleware, async (req, res) => {
  const tours = await Tour.find().sort({ createdAt: -1 });
  res.json(tours);
});

// Create tour
router.post("/", authMiddleware, async (req, res) => {
  const tour = await Tour.create(req.body);
  res.json(tour);
});

// Delete tour
router.delete("/:id", authMiddleware, async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.json({ message: "Tour deleted" });
});

export default router;

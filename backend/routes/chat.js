import express from "express";
import { getSymptomAnalysis } from "../gemini/geminiClient.js";
import db from "../db.js";

const router = express.Router();

// GET all chat history
router.get("/history", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM chat_history ORDER BY id DESC");
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// DELETE a chat by ID
router.delete("/history/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM chat_history WHERE id = ?", [id]);
    res.json({ message: "Deleted successfully" });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

// POST a new symptom check and save
router.post("/symptom-check", async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || !symptoms.trim()) {
      return res.status(400).json({ error: "Please provide symptom details." });
    }

    const output = await getSymptomAnalysis(symptoms);

    // Save to DB
    await db.query(
      "INSERT INTO chat_history (user_query, ai_response) VALUES (?, ?)",
      [symptoms, output]
    );

    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

export default router;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getSymptomAnalysis } from "./gemini/geminiClient.js";
import db from "./db.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/status", (req, res) => res.send("Server running ✅"));

app.use("/api", chatRoutes);


app.post("/api/symptom-check", async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || !symptoms.trim()) {
      return res.status(400).json({ error: "Please provide symptom details." });
    }

    const output = await getSymptomAnalysis(symptoms);
    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

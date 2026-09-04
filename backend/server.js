import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 AI CHAT API (HUGGINGFACE)
app.post("/api/chat", async (req, res) => {
    const message = req.body.message;

    if (!message) {
        return res.status(400).json({
            reply: "Message is required"
        });
    }

    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
            { inputs: message },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply =
            response.data?.[0]?.generated_text ||
            response.data?.generated_text ||
            "No response from AI";

        res.json({ reply });

    } catch (error) {
        console.log("AI ERROR:", error.response?.data || error.message);

        res.status(500).json({
            reply: "AI error occurred"
        });
    }
});

app.listen(5000, () => {
    console.log("Backend running on 5000");
});
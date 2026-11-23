
/* global process */

import "dotenv/config";

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Date website server is running ❤️");
});
app.get("/check-bot", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getMe`
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/test-telegram", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text: "Hello! ❤️ Your date website is working!",
        }),
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/send-date", async (req, res) => {
  try {
    const { place, date, time, message } = req.body;

    const text = `
❤️ NEW DATE REQUEST!

📍 Place: ${place}
📅 Date: ${date}
🕒 Time: ${time}

💌 Message: ${message || "No message"}
    `;

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text,
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description);
    }

    res.status(200).json({
      success: true,
      message: "Telegram message sent!",
    });

  } catch (error) {
    console.error("Telegram error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to send Telegram message",
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

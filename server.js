const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const DB_FILE = "messages.json";

// Helper: read messages
function readMessages() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

// Helper: write messages
function writeMessages(messages) {
  fs.writeFileSync(DB_FILE, JSON.stringify(messages, null, 2));
}

// POST /messages -> add new message
app.post("/messages", (req, res) => {
  const { author, text } = req.body;
  if (!author || !text) return res.status(400).send("Invalid request");
  const messages = readMessages();
  const id = Date.now().toString();
  messages.push({ id, author, text });
  writeMessages(messages);
  res.json({ success: true, id });
});

// GET /messages -> fetch all messages
app.get("/messages", (req, res) => {
  const messages = readMessages();
  res.json(messages);
});

// DELETE /messages/:id -> delete a message
app.delete("/messages/:id", (req, res) => {
  let messages = readMessages();
  messages = messages.filter(m => m.id !== req.params.id);
  writeMessages(messages);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

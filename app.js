require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');

const bot = new Telegraf('6164948105:AAHyQxNrSywSPFCpltrTC5rPDA1cy8USJKQ');

const app = express();
app.use(bodyParser.json());

// POST endpoint to send direct messages to chats
app.post('/api/send-message', async (req, res) => {
  try {
    console.log(req.body);
    const { chatId, message } = req.body;
    await bot.telegram.sendMessage(chatId, message);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));

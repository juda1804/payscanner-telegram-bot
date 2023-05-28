require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');
const consume = require('./rabbitmq');
const { buildMessage } = require("./paymentService");

const bot = new Telegraf(process.env.apiKey);

const app = express();
app.use(bodyParser.json());

// POST endpoint to send direct messages to chats
app.post('/api/send-message', async (req, res) => {
  try {
    const payload = {
      "id": 460,
      "description": "Bancolombia le informa Transferencia por $70,000.00 desde cta *7251 a cta 0000003113749930. 23/05/2023 12:18. Inquietudes al 6045109095/018000931987",
      "details": "",
      "card": "7251",
      "date": {
        "year": 2023,
        "month": 5,
        "day": 23
      },
      "price": 70000
    };

    console.log("procesing: ", payload.id);
    const { chatId, message } = req.body;
    await bot.telegram.sendMessage(chatId, buildMessage(payload));
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));

consume(bot);

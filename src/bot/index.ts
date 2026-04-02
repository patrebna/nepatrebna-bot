import express from 'express';
import TelegramBot from 'node-telegram-bot-api';

const { BOT_TOKEN, PORT = 3000, WEBHOOK_URL, WEBHOOK_PATH = '/webhook' } = process.env;

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is required');
  process.exit(1);
}
if (!WEBHOOK_URL) {
  console.error('WEBHOOK_URL is required (full https URL)');
  process.exit(1);
}

export const bot = new TelegramBot(BOT_TOKEN);

const app = express();
app.use(express.json());

app.post(WEBHOOK_PATH, (req: express.Request, res: express.Response) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(PORT, async () => {
  try {
    await bot.setWebHook(WEBHOOK_URL);
    console.log(`Bot2 webhook set to ${WEBHOOK_URL}`);
  } catch (err) {
    console.error('Failed to set webhook', err);
  }
  console.log(`Bot2 server listening on ${PORT}`);
});

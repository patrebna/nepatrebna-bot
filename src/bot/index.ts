import express from 'express';
import TelegramBot from 'node-telegram-bot-api';

const { BOT_TOKEN, PORT = 3000, WEBHOOK_URL, WEBHOOK_PATH = '/webhook' } = process.env;

if (!BOT_TOKEN) {
  console.error('Токен бота (BOT_TOKEN) не найден в переменных окружения');
  process.exit(1);
}
if (!WEBHOOK_URL) {
  console.error('URL вебхука (WEBHOOK_URL) не найден в переменных окружения');
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
    console.log(`Webhook установлен на ${WEBHOOK_URL}`);
  } catch (err) {
    console.error('Не удалось установить вебхук', err);
  }
  console.log(`Nepatrebna запущен на порту ${PORT}`);
});

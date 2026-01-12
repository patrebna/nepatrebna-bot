import 'dotenv/config';
import cbquery from 'bot/cbquery';

void cbquery();

// bot.onText(/\/start/, (msg) => {
//   bot.sendMessage(msg.chat.id, "Приветсветнный текст", {
//     reply_markup: {
//       inline_keyboard: [
//         [{ text: "Предложить новость", callback_data: "suggest_news" }],
//       ],
//     },
//   });
// });

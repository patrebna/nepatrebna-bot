import { type ReplyKeyboardMarkup } from 'node-telegram-bot-api';

class KeyboardManager {
  Main(): ReplyKeyboardMarkup {
    return {
      keyboard: [[{ text: '🪑 Барахолка' }], [{ text: '❓ Помощь' }]],
      resize_keyboard: true,
    };
  }
}

const keyboards = new KeyboardManager();
export default keyboards;

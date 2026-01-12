import { sendMessage } from 'config/lib/helpers/sendMessage';
import { type ICommandHandler } from 'config/types';

export const сommandHandlers: ICommandHandler[] = [
  {
    regex: /\/start/,
    handler: async (userId) => {
      const helloText = `${[
        '<b>Привет!</b> 👋',
        'Это бот проекта <b>«Радар Минска»</b> 📡',
        '',
        'Здесь можно анонимно предложить новость, происшествие или важную информацию о городе 🏙',
        '',
        'Нажми <b>«Предложить новость»</b> ✍️',
        'Отправь текст, фото или видео — и после модерации мы опубликуем новость в канале.',
      ].join('\n')}`;
      await sendMessage(userId, helloText, {
        inline_keyboard: [[{ text: '💡 Предложить новость', callback_data: 'suggest_news' }]],
      });
    },
  },
];

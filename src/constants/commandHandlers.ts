import { sendMessage } from 'config/lib/helpers/sendMessage';
import { type ICommandHandler } from 'config/types';

export const сommandHandlers: ICommandHandler[] = [
  {
    regex: /\/start/,
    handler: async (userId) => {
      const helloText = `${[
        '<b>Привет!</b> 👋',
        'Это <b>Nepatrebna</b> — бот для размещения объявлений 🛍 на канале <a href="https://t.me/nepatrebna">Непатрэбныя товары</a>',
        '',
        'Здесь можно быстро разместить объявление о продаже ненужных вещей 📦',
        '',
        'Нажми <b>«Разместить объявление»</b> ✍️',
        'Отправь описание, фото или видео — и после модерации объявление появится в канале.',
      ].join('\n')}`;
      await sendMessage(userId, helloText, {
        inline_keyboard: [[{ text: '📦 Разместить объявление', callback_data: 'create_ad' }]],
      });
    },
  },
];

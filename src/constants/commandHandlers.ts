import keyboards from 'bot/keyboards';
import { sendMessage } from 'config/lib/helpers/sendMessage';
import { type ICommandHandler } from 'config/types';

export const сommandHandlers: ICommandHandler[] = [
  {
    regex: /\/start/,
    handler: async (userId) => {
      const helloText = `${[
        '<b>Привет!</b> 👋',
        'Это <b>Nepatrebna</b> — бот для размещения объявлений 🛍 на канале <a href="https://t.me/nepatrebna">Непатрэбныя товары</a>.',
        '',
        'Здесь можно быстро разместить объявление о продаже ненужных вещей 📦.',
      ].join('\n')}`;
      const subtitleText = `${[
        'Нажми <b>«Разместить объявление»</b> ✍️.',
        'Отправь описание, фото или видео — и после модерации объявление появится в канале.',
      ].join('\n')}`;

      await sendMessage(userId, helloText, keyboards.Main());
      await sendMessage(userId, subtitleText, {
        inline_keyboard: [[{ text: '📦 Разместить объявление', callback_data: 'create_ad' }]],
      });
    },
  },
  {
    regex: /🪑 Барахолка/,
    handler: async (userId) => {
      const message = `${[
        '👋 Пространство для объявлений о <b>товарах</b> и <b>услугах</b>.',
        'Всё легко найти и поделиться своими предложениями 🛍️📦. ',
      ].join('\n')}`;
      await sendMessage(userId, message, {
        inline_keyboard: [[{ text: '📦 Разместить объявление', callback_data: 'create_ad' }]],
      });
    },
  },
  {
    regex: /❓ Помощь/,
    handler: async (userId) => {
      await sendMessage(
        userId,
        '💬 Если у вас возникли <b>вопросы</b> или <b>нужна помощь</b>, пожалуйста, свяжитесь с нами -  <a>@evgeniykolmak</a>.\n<b>Мы всегда рады помочь!</b>',
      );
    },
  },
];

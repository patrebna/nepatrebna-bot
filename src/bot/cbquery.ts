import { bot } from 'bot';
import { сommandsWrapper } from 'config/lib/helpers/commandsWrapper';
import { editMessage } from 'config/lib/helpers/editMessage';
import { safeAnswerCallbackQuery } from 'config/lib/helpers/safeAnswerCallbackQuery';
import { sendMessage } from 'config/lib/helpers/sendMessage';
import { type ICallbackData } from 'config/types';
import { сommandHandlers } from 'constants/commandHandlers';
import keyboards from './keyboards';

export default async (): Promise<void> => {
  bot.on('callback_query', async (query): Promise<void> => {
    const { data, from, id: callbackQueryId, message } = query;
    const userId = from.id;
    const messageId = message?.message_id;
    const MAIN_CHANNEL_ID = process.env.MAIN_CHANNEL_ID ?? '';
    const MODERATION_CHANNEL_ID = process.env.MODERATION_CHANNEL_ID ?? '';

    let callbackData: ICallbackData;
    try {
      const parsed = JSON.parse(data ?? '{}');
      if (typeof parsed === 'object' && parsed !== null && 'action' in parsed) {
        callbackData = parsed;
      } else {
        throw new Error('Невалидный JSON');
      }
    } catch {
      callbackData = { action: data ?? '' };
    }

    switch (callbackData.action) {
      case 'create_ad': {
        const message1 = '❓ Какое объявление вы хотели бы разместить?';
        const message2 = `${[
          '✍️ <b>Опишите товар</b>: что это, состояние, цена и другие детали.',
          '📎 Прикрепите <b>один</b> медиафайл (фото или видео) — так объявление быстрее пройдет модерацию.',
          '',
          '❗ Добавьте содержимое в <b>поле ниже</b> и отправьте сообщение.',
        ].join('\n')}`;
        await editMessage(userId, messageId, message1, callbackQueryId);
        const prompt = await sendMessage(userId, message2, {
          force_reply: true,
          input_field_placeholder: 'Введите описание товара...',
        });
        if (!prompt) return;
        bot.onReplyToMessage(userId, prompt?.message_id, async (message) => {
          const copied = await bot.copyMessage(MODERATION_CHANNEL_ID, userId, message.message_id);
          await bot.editMessageReplyMarkup(
            {
              inline_keyboard: [
                [
                  {
                    text: '✅ Опубликовать',
                    callback_data: JSON.stringify({
                      action: 'approve',
                      param: [copied?.message_id, userId],
                    }),
                  },
                  {
                    text: '❌ Отклонить',
                    callback_data: JSON.stringify({
                      action: 'reject',
                      param: [copied?.message_id, userId],
                    }),
                  },
                ],
              ],
            },
            {
              chat_id: MODERATION_CHANNEL_ID,
              message_id: copied?.message_id,
            },
          );

          await sendMessage(
            userId,
            ' ✅ Спасибо! Объявление отправлено на модерацию.',
            keyboards.Main(),
          );
        });
        break;
      }
      case 'approve': {
        const sourceMessageId = callbackData?.param[0];
        const userId = callbackData?.param[1];
        const publishedMessage = await bot.copyMessage(
          MAIN_CHANNEL_ID,
          MODERATION_CHANNEL_ID,
          sourceMessageId,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '💬 Написать',
                    url: `tg://user?id=${userId}`,
                  },
                ],
              ],
            },
          },
        );
        await sendMessage(userId, '✅ Ваша новость одобрена и опубликована! 👇');
        await bot.forwardMessage(userId, MAIN_CHANNEL_ID, publishedMessage.message_id);

        await safeAnswerCallbackQuery(callbackQueryId, {
          text: '✅ Опубликовано',
          show_alert: true,
        });
        if (!messageId) return;
        await bot.deleteMessage(MODERATION_CHANNEL_ID, messageId);
        break;
      }
      case 'reject': {
        const sourceMessageId = callbackData?.param[0];
        const userId = callbackData?.param[1];
        await safeAnswerCallbackQuery(callbackQueryId, {
          text: '❌ Отклонено',
          show_alert: true,
        });
        await sendMessage(userId, '❌ Ваша новость отклонена. 👇');
        await bot.copyMessage(userId, MODERATION_CHANNEL_ID, sourceMessageId);
        if (!messageId) return;
        await bot.deleteMessage(MODERATION_CHANNEL_ID, messageId);
        break;
      }
    }
  });
  for (const command of сommandHandlers) {
    await сommandsWrapper(command);
  }
};

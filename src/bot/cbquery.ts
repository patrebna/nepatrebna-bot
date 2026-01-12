import { bot } from 'bot';
import { сommandsWrapper } from 'config/lib/helpers/commandsWrapper';
import { editMessage } from 'config/lib/helpers/editMessage';
import { safeAnswerCallbackQuery } from 'config/lib/helpers/safeAnswerCallbackQuery';
import { sendMessage } from 'config/lib/helpers/sendMessage';
import { type ICallbackData } from 'config/types';
import { сommandHandlers } from 'constants/commandHandlers';

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
      case 'approve': {
        await bot.copyMessage(MAIN_CHANNEL_ID, MODERATION_CHANNEL_ID, callbackData?.param);
        await safeAnswerCallbackQuery(callbackQueryId, {
          text: '✅ Опубликовано',
          show_alert: true,
        });
        if (!messageId) return;
        await bot.deleteMessage(MODERATION_CHANNEL_ID, messageId);
        break;
      }
      case 'reject': {
        await safeAnswerCallbackQuery(callbackQueryId, {
          text: '❌ Отклонено',
          show_alert: true,
        });
        if (!messageId) return;
        await bot.deleteMessage(MODERATION_CHANNEL_ID, messageId);
        break;
      }
      case 'suggest_news': {
        const message1 = '❓ О чём хотите рассказать?';
        const message2 = `${[
          '✍️ <b>Опишите вашу новость</b>: расскажите, что произошло и все детали.',
          '📎 Если есть <b>фото</b> или <b>видео</b>, обязательно прикрепите один медиафайл.',
        ].join('\n')}`;
        await editMessage(userId, messageId, message1, callbackQueryId);
        const prompt = await sendMessage(userId, message2, {
          force_reply: true,
          input_field_placeholder: 'Введите вашу новость...',
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
                      param: copied?.message_id,
                    }),
                  },
                  {
                    text: '❌ Отклонить',
                    callback_data: JSON.stringify({
                      action: 'reject',
                      param: copied?.message_id,
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

          await sendMessage(userId, ' ✅ Спасибо! Новость отправлена на модерацию.');
        });

        break;
      }
    }
  });
  for (const command of сommandHandlers) {
    await сommandsWrapper(command);
  }
};

import { bot } from "bot";

import { sendMessage } from "config/lib/helpers/sendMessage";

import { type ICommandHandler } from "config/types";

export async function сommandsWrapper({
  regex,
  handler,
}: ICommandHandler): Promise<void> {
  bot.onText(regex, (ctx, match) => {
    void (async () => {
      const userId = ctx.chat.id;
      await handler(userId, match);
    })();
  });
}

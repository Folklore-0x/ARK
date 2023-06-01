import { Context } from "grammy"

/**
 * Check that the chat ID is allowed to use the bot.
 * If not, reply to the user and return false.
 *
 * @param ctx - The context object.
 * @returns Whether the chat ID is allowed.
 */
export async function hasPermissions(ctx: Context) {
  const allowedChats = process.env.ALLOWED_CHAT_IDS?.split(",")
  const chatId = String(ctx.chat?.id)

  if (!allowedChats || !chatId || !allowedChats.includes(chatId)) {
    console.log("Chat ID not allowed: ", chatId)
    await ctx.reply("This bot is only available in the official group chat.")
    return false
  }

  return true
}

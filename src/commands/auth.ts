import { Context } from "grammy"

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

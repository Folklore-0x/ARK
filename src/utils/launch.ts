import { Bot } from "grammy"
import fetch from "node-fetch"
import { MyContext } from "src/types"

const production = async (bot: Bot<MyContext>): Promise<void> => {
  try {
    await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook?url=${process.env.VERCEL_URL}`
    )
    await bot.api.setWebhook(`${process.env.VERCEL_URL}/api/index`)
    console.log(`[SERVER] Bot starting webhook`)
  } catch (e) {
    console.error(e)
  }
}

const development = async (bot: Bot<MyContext>): Promise<void> => {
  try {
    await bot.api.deleteWebhook()
    console.log("[SERVER] Bot starting polling")
    await bot.start()
  } catch (e) {
    console.error(e)
  }
}

export { production, development }

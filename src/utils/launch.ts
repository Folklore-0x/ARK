import { Bot } from "grammy"
import fetch from "node-fetch"
import { MyContext } from "src/types"

const production = async (bot: Bot<MyContext>): Promise<void> => {
  try {
    console.time("set_webhook")
    const url = await bot.api.getWebhookInfo().then((info) => info.url)

    if (url !== process.env.VERCEL_URL) {
      console.log(`[SERVER] Setting up webhook for ${process.env.VERCEL_URL}`)
      await bot.api.setWebhook(process.env.VERCEL_URL!)
    } else {
      console.log(`[SERVER] Webhook already set to ${process.env.VERCEL_URL}`)
    }

    console.log(`[SERVER] Bot starting webhook`)
    console.timeEnd("set_webhook")
  } catch (e) {
    console.log("Failed to set webhook")
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

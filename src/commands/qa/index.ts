import { Context } from "grammy"
import Mendable from "../../core/mendable"

const qa = async (ctx: Context): Promise<void> => {
  let response: string | undefined

    // Send a typing task until the api call is done.
  ;(async function sendTyping() {
    while (!response) {
      await ctx.replyWithChatAction("typing")
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  })()

  await ctx.replyWithChatAction("typing")

  const mendable = new Mendable(String(process.env.MENDABLE_API_KEY))

  try {
    response = await mendable.call(ctx)
  } catch (err) {
    console.error(err)
    response = "I'm sorry, I didn't understand that."
  }

  await ctx.reply(response, {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  })
}

export default qa

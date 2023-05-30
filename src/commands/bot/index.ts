import { Context } from "grammy"
import Mendable from "../../core/mendable"
import { hasPermissions } from "../utils"
import { MyContext } from "src/types"

const bot = async (ctx: MyContext): Promise<void> => {
  // Limit the bot command to the official group chat.
  if (!(await hasPermissions(ctx))) return

  // Mendable can take up to 10 seconds to respond, so we'll schedule a typing indicator after 5 seconds.
  let isFinished = false
  setTimeout(async () => {
    if (!isFinished) {
      await ctx.replyWithChatAction("typing")
    }
  }, 5000)

  if (!ctx.session?.myString) {
    ctx.session = {
      myString: "Hello, world!",
    }
  } else {
    ctx.session.myString += "!"
  }

  // const mendable = new Mendable(String(process.env.MENDABLE_API_KEY))
  // const response = await mendable.call(ctx)
  const response = ctx.session.myString!
  await ctx.reply(response, {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  })

  isFinished = true
}

export default bot

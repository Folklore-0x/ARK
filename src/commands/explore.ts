import { hasPermissions } from "./auth"
import { MyContext } from "src/types"
import { Mendable } from "./ask"

///
/// Like `/ask`, but include previous messages in history.
///
const explore = async (ctx: MyContext): Promise<void> => {
  // Limit the bot command to the official group chat.
  if (!(await hasPermissions(ctx))) return

  // Send the typing indicator for 10 seconds (typing indicators expire after 5 seconds).
  let isFinished = false
  await ctx.replyWithChatAction("typing")
  setTimeout(async () => {
    if (!isFinished) {
      await ctx.replyWithChatAction("typing")
    }
  }, 5000)

  // Get the response from Mendable.
  const mendable = new Mendable(String(process.env.MENDABLE_API_KEY), true)
  const response = await mendable.call(ctx)

  await ctx.reply(response, {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  })

  isFinished = true
}

export default explore

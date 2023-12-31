import { hasPermissions } from "./auth"
import { MyContext } from "src/types"

/**
 * Reset the conversation for the current chat.
 */
const start = async (ctx: MyContext): Promise<void> => {
  if (!(await hasPermissions(ctx))) return

  // Delete the conversation from the session.
  const chatId = String(ctx.chat?.id)
  if (chatId) {
    delete ctx.session.conversations[chatId]
  }

  console.log(`Session after resetting: ${ctx.session}`)

  await ctx.reply("I am ready for a new conversation.", {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  })
}

export default start

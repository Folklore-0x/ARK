import { MyContext } from "src/types"

/**
 * Console.log the chat ID.
 */
const info = async (ctx: MyContext): Promise<void> => {
  console.log("Logging info for chat: ", ctx.chat?.id)

  await ctx.reply("This chat can now be configured by the admins.", {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  })
}

export default info

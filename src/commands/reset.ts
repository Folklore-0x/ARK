import { hasPermissions } from "./auth"
import { MyContext } from "src/types"

const reset = async (ctx: MyContext): Promise<void> => {
  if (!(await hasPermissions(ctx))) return

  ctx.session = { conversation: null }

  await ctx.reply("The bot was reset.", {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  })
}

export default reset

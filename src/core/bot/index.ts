import { Bot, BotError, Context, session } from "grammy"
import { MyContext, SessionData } from "src/types"
import { freeStorage } from "@grammyjs/storage-free"

const bot = new Bot<MyContext>(String(process.env.BOT_TOKEN))

bot.catch((err: BotError) => {
  console.error(err)
})

bot.use(
  session({
    initial: () => ({ conversation: null }),
    storage: freeStorage<SessionData>(bot.token),
  })
)

export default bot

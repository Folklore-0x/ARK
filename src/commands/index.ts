import { Composer } from "grammy"

import bot from "./bot"
import { MyContext } from "src/types"

const composer = new Composer<MyContext>()

composer.on("message").command("bot", bot)

export default composer

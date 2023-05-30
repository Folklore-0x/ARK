import { Composer } from "grammy"
import { MyContext } from "src/types"

import bot from "./bot"
import reset from "./reset"

const composer = new Composer<MyContext>()

composer.on("message").command("bot", bot)
composer.on("message").command("reset", reset)

export default composer

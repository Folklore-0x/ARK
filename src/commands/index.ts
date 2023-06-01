import { Composer } from "grammy"
import { MyContext } from "src/types"

import ask from "./ask"
import start from "./start"
import info from "./info"

const composer = new Composer<MyContext>()

composer.on("message").command("ask", ask)
composer.on("message").command("start", start)
composer.on("message").command("info", info)

export default composer

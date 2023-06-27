import { MyContext } from "src/types"
import { Composer } from "grammy"

import explore from "./explore"
import start from "./start"
import info from "./info"
import ask from "./ask"

const composer = new Composer<MyContext>()

composer.on("message").command("explore", explore)
composer.on("message").command("start", start)
composer.on("message").command("info", info)
composer.on("message").command("ask", ask)

export default composer

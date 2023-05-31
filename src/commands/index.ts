import { Composer } from "grammy"
import { MyContext } from "src/types"

import ask from "./ask"
import reset from "./reset"

const composer = new Composer<MyContext>()

composer.on("message").command("ask", ask)
composer.on("message").command("reset", reset)

export default composer

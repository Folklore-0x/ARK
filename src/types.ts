import { Context as GrammyContext } from "grammy"

export interface SessionData {
  myString?: string
}

export interface MyContext extends GrammyContext {
  session: SessionData
}

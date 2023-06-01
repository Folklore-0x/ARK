import { Context as GrammyContext } from "grammy"

export interface HistoryItem {
  prompt: string
  response: string
}

export interface Conversation {
  conversationId: string
  history: HistoryItem[]
}

export interface SessionData {
  conversations: { [chatId: string]: Conversation }
}

export interface MyContext extends GrammyContext {
  session: SessionData
}

import { Context as GrammyContext } from "grammy"

interface HistoryItem {
  prompt: string
  response: string
}

interface Conversation {
  conversationId: string
  history: HistoryItem[]
}

export interface SessionData {
  conversation: Conversation | null
}

export interface MyContext extends GrammyContext {
  session: SessionData
}

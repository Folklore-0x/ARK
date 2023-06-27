import fetch from "node-fetch"
import { hasPermissions } from "./auth"
import { Conversation, MyContext } from "src/types"

/**
 * Get the conversation from the context.
 */
const getConversation = (context: MyContext): Conversation | null => {
  const conversations = context.session?.conversations

  if (!conversations) {
    return null
  }

  return conversations[String(context.chat?.id)] ?? null
}

/**
 * A wrapper of the Mendable API.
 */
export class Mendable {
  private apiKey: string
  private includeHistory: boolean

  constructor(apiKey: string, includeHistory: boolean = false) {
    this.apiKey = apiKey
    this.includeHistory = includeHistory
  }

  /**
   * Start a new Mendable conversation.
   *
   * @returns The conversation ID.
   */
  private async _start_conversation(): Promise<Conversation> {
    const data = { api_key: this.apiKey }

    const response = await fetch("https://api.mendable.ai/v0/newConversation", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })

    const response_data = await response.json()
    return {
      conversationId: response_data["conversation_id"],
      history: [],
    }
  }

  /**
   * Call the Mendable API.
   *
   * Also updates the session history.
   *
   * @returns The formatted response, including sources.
   */
  public async call(ctx: MyContext): Promise<string> {
    const question = ctx.message?.text?.replace("/ask", "").trim()

    if (!question) {
      return "I'm sorry, I didn't understand that."
    }

    //
    // Get the conversation ID from the session, or start a new one.
    //
    let conversation = getConversation(ctx)
    console.log("Conversation: ", conversation)
    if (!conversation) {
      conversation = await this._start_conversation()
      ctx.session.conversations[String(ctx.chat?.id)] = conversation
    }

    const data = {
      question: question,
      shouldStream: false,
      conversation_id: conversation.conversationId,
      history: this.includeHistory ? conversation.history : [],
      api_key: this.apiKey,
    }

    // Call the API.
    const response = await fetch("https://api.mendable.ai/v0/mendableChat", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })

    const responseData = await response.json()
    let responseText = responseData["answer"]["text"]

    // Append the first five sources at the end of the response.
    const sources = responseData["sources"].slice(0, 5)
    let sourceAppendix = ""
    if (sources.length > 0) {
      sourceAppendix += "\n\n*Sources:*\n"
      sourceAppendix += sources
        .map((s: any) => s["link"])
        .join("\n")
        .replace(/_/g, "\\_") // Escape underscores in markdown.
    }

    // Add the result to the session history.
    conversation.history.push({
      prompt: question,
      response: responseText,
    })

    // Only keep the last item in history.
    // This is to prevent the session from growing too large,
    // and the Mendable prompt from getting too long.
    conversation.history = conversation.history.slice(-1)

    return responseText + sourceAppendix
  }
}

const ask = async (ctx: MyContext): Promise<void> => {
  // Limit the bot command to the official group chat.
  if (!(await hasPermissions(ctx))) return

  // Send the typing indicator for 10 seconds (typing indicators expire after 5 seconds).
  let isFinished = false
  await ctx.replyWithChatAction("typing")
  setTimeout(async () => {
    if (!isFinished) {
      await ctx.replyWithChatAction("typing")
    }
  }, 5000)

  // Get the response from Mendable.
  const mendable = new Mendable(String(process.env.MENDABLE_API_KEY))
  const response = await mendable.call(ctx)

  await ctx.reply(response, {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  })

  isFinished = true
}

export default ask

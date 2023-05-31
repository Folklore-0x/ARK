import fetch from "node-fetch"
import { hasPermissions } from "./auth"
import { MyContext } from "src/types"

class Mendable {
  private apiKey: string

  constructor(api_key: string) {
    this.apiKey = api_key
  }

  private async _start_conversation(): Promise<string> {
    const data = { api_key: this.apiKey }

    const response = await fetch("https://api.mendable.ai/v0/newConversation", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })

    const response_data = await response.json()
    return response_data["conversation_id"]
  }

  public async call(ctx: MyContext): Promise<string> {
    const question = ctx.message?.text?.replace("/ask", "").trim()

    if (!question) {
      return "I'm sorry, I didn't understand that."
    }

    // Get the conversation ID from the session.
    let conversationId = ctx.session?.conversation?.conversationId
    if (!conversationId) {
      conversationId = await this._start_conversation()

      // Reset the session.
      ctx.session = {
        conversation: {
          conversationId,
          history: [],
        },
      }
    }

    const data = {
      question: question,
      shouldStream: false,
      conversation_id: conversationId,
      history: ctx.session?.conversation?.history,
      api_key: this.apiKey,
    }

    const response = await fetch("https://api.mendable.ai/v0/mendableChat", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })

    const responseData = await response.json()

    let responseText = responseData["answer"]["text"]

    const sources = responseData["sources"].slice(0, 5) // first five sources
    let sourceAppendix = ""
    if (sources.length > 0) {
      sourceAppendix += "\n\n*Sources:*\n"
      sourceAppendix += sources.map((s: any) => s["link"]).join("\n")
    }

    // Add the result to the session history.
    ctx.session?.conversation?.history.push({
      prompt: question,
      response: responseText,
    })

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

  // Get the response from
  const mendable = new Mendable(String(process.env.MENDABLE_API_KEY))
  const response = await mendable.call(ctx)

  // Only keep the last 3 items in the history.
  // This is to prevent the session from growing too large,
  // and the Mendable prompt from getting too long.
  if (ctx.session?.conversation?.history) {
    ctx.session.conversation.history =
      ctx.session.conversation.history.slice(-3)
  }

  await ctx.reply(response, {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  })

  isFinished = true
}

export default ask

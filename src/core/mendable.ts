import { Context } from "grammy"
import fetch from "node-fetch"

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

  public async call(ctx: Context): Promise<string> {
    const query = ctx.message?.text

    if (!query) {
      return "I'm sorry, I didn't understand that."
    }

    const conversationId = await this._start_conversation()
    const data = {
      question: query,
      shouldStream: false,
      conversation_id: conversationId,
      history: [],
      api_key: this.apiKey,
    }

    const response = await fetch("https://api.mendable.ai/v0/mendableChat", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })

    const response_data = await response.json()
    let response_text = response_data["answer"]["text"]
    const sources = response_data["sources"].slice(0, 5) // first five sources

    if (sources.length > 0) {
      response_text += "\n\n*Sources:*\n"
      response_text += sources.map((s) => s["link"]).join("\n")
    }

    return response_text
  }
}

export default Mendable

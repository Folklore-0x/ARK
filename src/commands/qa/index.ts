import { Context } from 'grammy'
import Mendable from '../../core/mendable'

const qa = async (ctx: Context): Promise<void> => {
    // Send a typing task until the api call is done.
    let taskDone = false
    ;(async function sendTyping() {
        while (!taskDone) {
            await ctx.replyWithChatAction('typing')
            await new Promise(resolve => setTimeout(resolve, 5000))
        }
    })()

    await ctx.replyWithChatAction('typing')

    const mendable = new Mendable(String(process.env.MENDABLE_API_KEY))
    const response = await mendable.call(ctx)

    taskDone = true

    await ctx.reply(response, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
    })
}

export default qa

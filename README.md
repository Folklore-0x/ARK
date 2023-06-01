# Community Telegram Bot

This is a community telegram bot that answers questions about a community through the Mendable API.

It uses the Grammy.js Telegram bot framework and is deployed on Vercel.


## Usage

If it is the first time you use the bot in a new chat, you need to add the chat ID to ALLOWED_CHAT_IDS in .env (or in production, to Vercel settings). To log the chat ID to the console, run:

`/info`

To ask a question to the Mendable API:

`/ask {question}`


The chat history is saved in Grammy's free storage (only the three most recent messages). To reset the chat history:

`/reset`


## Development

```bash
# Copy the .env example and fill in the BOT_TOKEN, MENDABLE_API_KEY and ALLOWED_CHAT_IDS.
$ cp .env.example .env
# Install the dependencies
$ npm install
# Run the development environment
$ npm run dev
```

## Deployment

The bot is deployed as a [serverless Vercel function](https://vercel.com/folklore-0x/folklore-bot). To deploy a new version, simply push your changes to main.

### Vercel Setup

Running the following commands will create a new vercel project:

```bash
# Install vercel cli if you don't have it yet
$ npm i -g vercel
# Deploy the project
$ vercel --prod
```

On your project's page, go to Settings > Environment Variables and add the following variables:

| Name               | Value                            |
| ------------------ | -------------------------------- |
| `BOT_TOKEN`        | _your bot token_                 |
| ------------------ | -------------------------------- |
| `MENDABLE_API_KEY` | _your API key_                   |
| ------------------ | -------------------------------- |
| `ALLOWED_CHAT_IDS` | _your allowed telegram chat IDs_ |


That's it! Your bot should be ready to go.
const {Client} = require('discord.js')
const messageHandler = require('../message-handler')
const BotCommandParser = require('../bot-command-parser')

module.exports = async function () {
  // TODO: config or arg for commandChar
  const botCommandParser = new BotCommandParser('!')
  const client = new Client()

  client.on('message', messageHandler(botCommandParser))
  await client.login(process.env.DISCORD_TOKEN)
}

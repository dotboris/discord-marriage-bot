const {Client} = require('discord.js')
const messageHandler = require('../message-handler')

module.exports = async function () {
  const client = new Client()

  // TODO: config or arg for commandChar
  const handler = messageHandler(';')
  client.on('message', handler)

  await client.login(process.env.DISCORD_TOKEN)
}

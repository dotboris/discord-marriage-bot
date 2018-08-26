const {Client} = require('discord.js')
const handleMessage = require('../handle-message')

module.exports = async function () {
  const client = new Client()

  client.on('message', handleMessage)
  client.login(process.env.DISCORD_TOKEN)
}

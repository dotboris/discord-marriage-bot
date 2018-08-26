const {Client} = require('discord.js')

module.exports = async function () {
  const client = new Client()

  client.on('ready', () => {
    console.log('we are ready!')
  })
  client.on('message', message => {
    console.log(message)
  })

  client.login(process.env.DISCORD_TOKEN)
}

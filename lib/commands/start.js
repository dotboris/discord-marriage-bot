const { Client } = require('discord.js')
const messageHandler = require('../message-handler')
const Config = require('../config')
const debug = require('debug')('start-cmd')
const database = require('../database')

module.exports = async function (dir) {
  debug(`Starting bot in ${dir}`)

  debug('Loading config')
  const config = await Config.load(dir)

  debug('Validating config')
  const validation = await Config.validate(config)
  if (!validation.valid) {
    console.log(`Config for ${dir} is not valid`)
    console.log(validation.errors)
    return { code: 1 }
  }

  debug('Creating discord client')
  const client = new Client()

  debug('Registering handlers')
  const state = {
    config: config,
    db: await database.open(dir)
  }
  const handler = messageHandler(state)
  client.on('message', handler)

  debug('Logging in to discord')
  await client.login(config.discordToken)

  debug('Bot is running and accepting commands')
  return { noExit: true }
}

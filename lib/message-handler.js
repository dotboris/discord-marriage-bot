const debug = require('debug')('message-hanlder')
const botParse = require('./bot-parse')

const COMMANDS = new Map(Object.entries({
  propose: {
    args: ['user'],
    async handler (message, user) {
      await message.channel.send(`TODO: propose ${user.toString()}`)
    }
  }
}))

async function handleMessage (commandChar, message) {
  debug(`${message.author.username}> ${message.toString()}`)

  if (botParse.isCommand(commandChar, message)) {
    const command = botParse.parseCommand(message)
    debug(command)

    const commandSpec = COMMANDS.get(command.name)
    if (commandSpec) {
      if (botParse.argsMatch(command.args, commandSpec.args)) {
        await commandSpec.handler(message, ...command.args)
      } else {
        message.channel.send('TODO: bad args reply')
      }
    }
  }
}

module.exports = function (commandChar) {
  return function (message) {
    return handleMessage(commandChar, message)
      .catch(err => debug(err))
  }
}

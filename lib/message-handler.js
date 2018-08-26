const debug = require('debug')('message-hanlder')
const botParse = require('./bot-parse')

async function handleMessage (commandChar, message) {
  debug(`${message.author.username}> ${message.toString()}`)

  if (botParse.isCommand(commandChar, message)) {
    const command = botParse.parseCommand(message)
    debug(command)

    switch (command.name) {
      case 'test':
        await message.channel.send('test.... icles! HAHA!!! :rofl:')
        break
      case 'echo':
        await message.channel.send(command.args.join(' '))
        break
      case 'crash':
        throw Error('nope')
    }
  }
}

module.exports = function (commandChar) {
  return function (message) {
    return handleMessage(commandChar, message)
      .catch(err => debug(err))
  }
}

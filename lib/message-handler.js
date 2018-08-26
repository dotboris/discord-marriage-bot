const debug = require('debug')('message-hanlder')

async function handleMessage (parser, message) {
  debug(`${message.author.username}> ${message.toString()}`)

  if (parser.isCommand(message)) {
    const command = parser.parseCommand(message)
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

module.exports = function (parser) {
  return function (message) {
    return handleMessage(parser, message)
      .catch(err => debug(err))
  }
}

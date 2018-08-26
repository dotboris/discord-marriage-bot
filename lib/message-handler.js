const debug = require('debug')('message-hanlder')
const botParse = require('./bot-parse')
const CommandSpec = require('./command-spec')

const COMMANDS = {
  help: {
    aliases: ['h'],
    args: [],
    description: 'Print this help message',
    handler: handleHelp
  },
  propose: {
    aliases: ['p'],
    args: [
      {name: '@someone', type: 'user'}
    ],
    description: 'Propose to someone',
    handler: todoCommand
  }
}
const COMMANDS_INDEX = CommandSpec.makeIndex(COMMANDS)
const COMMANDS_HELP = CommandSpec.generateHelp(COMMANDS)

async function handleMessage (commandChar, message) {
  debug(`${message.author.username}> ${message.toString()}`)

  if (botParse.isCommand(commandChar, message)) {
    const command = botParse.parseCommand(message)
    debug(command)

    const commandSpec = CommandSpec.findCommand(COMMANDS_INDEX, command.name)
    if (commandSpec) {
      const specArgTypes = commandSpec.args.map(a => a.type)
      if (botParse.argsMatch(command.args, specArgTypes)) {
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

async function handleHelp (message) {
  await message.channel.send(
    [
      '```',
      COMMANDS_HELP,
      '```'
    ].join('\n')
  )
}

async function todoCommand (message) {
  await message.channel.send(`TODO: ${message.toString()}`)
}

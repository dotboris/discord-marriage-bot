const debug = require('debug')('message-hanlder')
const botParse = require('./bot-parse')
const CommandSpec = require('./command-spec')
const botCommands = require('./bot-commands')

const COMMANDS = {
  help: {
    aliases: ['h'],
    args: [],
    description: 'Print this help message',
    handler: handleHelp
  },
  relationships: {
    aliases: ['ls', 'partners'],
    args: [],
    description: 'Show your relationships',
    handler: botCommands.listRelationships
  },
  propose: {
    aliases: ['p'],
    args: [{name: '@someone', type: 'user'}],
    description: 'Propose to someone',
    handler: botCommands.propose
  },
  accept: {
    aliases: ['ido', 'yes', 'yep', 'y'],
    args: [],
    description: 'Accept a proposal, marriage, etc',
    handler: botCommands.accept
  },
  decline: {
    aliases: ['no', 'nope', 'n'],
    args: [],
    description: 'Decline a proposal, marriage, etc',
    handler: botCommands.decline
  },
  wedding: {
    aliases: [],
    args: [],
    description: 'Start the wedding (must be engaged)',
    handler: botCommands.startWedding
  },
  breakup: {
    aliases: [],
    args: [{name: '@someone', type: 'user'}],
    description: 'Break up with someone',
    handler: botCommands.breakup
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

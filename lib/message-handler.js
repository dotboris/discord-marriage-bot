const debug = require('debug')('message-hanlder')
const botParse = require('./bot-parse')
const flatMap = require('lodash.flatmap')
const zip = require('lodash.zip')

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
const COMMANDS_INDEX = makeCommandsIndex(COMMANDS)

async function handleMessage (commandChar, message) {
  debug(`${message.author.username}> ${message.toString()}`)

  if (botParse.isCommand(commandChar, message)) {
    const command = botParse.parseCommand(message)
    debug(command)

    const commandSpec = COMMANDS_INDEX.get(command.name)
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

function genrateHelp (commands) {
  const commandEntries = Object.entries(commands)
  const examples = commandEntries.map(([name, command]) => {
    const argNames = command.args.map(a => a.name)

    return [[name, command.aliases].join('|'), ...argNames].join(' ')
  })
  const descriptions = commandEntries.map(([, command]) => command.description)

  const longestExample = Math.max(...examples.map(e => e.length))
  return zip(examples, descriptions)
    .map(([example, description]) => {
      const padding = longestExample - example.length + 4
      return example + ' '.repeat(padding) + description
    })
    .join('\n')
}

async function handleHelp (message) {
  await message.channel.send(
    [
      '```',
      genrateHelp(COMMANDS),
      '```'
    ].join('\n')
  )
}

async function todoCommand (message) {
  await message.channel.send(`TODO: ${message.toString()}`)
}

function makeCommandsIndex (commandsObj) {
  const commands = Object.entries(commandsObj)
  const indexEntries = flatMap(commands, ([name, command]) => {
    const namedCommand = [name, command]
    const aliasCommands = command.aliases.map(alias => [alias, command])

    return [
      namedCommand,
      ...aliasCommands
    ]
  })

  return new Map(indexEntries)
}

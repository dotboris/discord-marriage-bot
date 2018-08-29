const flatMap = require('lodash.flatmap')
const zip = require('lodash.zip')

module.exports.findCommand = function (index, nameOrAlias) {
  return index.get(nameOrAlias)
}

module.exports.generateHelp = function (commands) {
  const commandEntries = Object.entries(commands)
  const examples = commandEntries.map(([name, command]) => {
    const argNames = command.args.map(a => a.name)

    return [[name, ...command.aliases].join('|'), ...argNames].join(' ')
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

module.exports.makeIndex = function (commandsObj) {
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

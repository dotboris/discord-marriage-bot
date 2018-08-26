const every = require('lodash.every')
const zip = require('lodash.zip')
const {User} = require('discord.js')

const USER_MENTION_REGEX = /<@!?([0-9]+)>/

function convertUserMention (arg, message) {
  const matches = USER_MENTION_REGEX.exec(arg)
  if (matches) {
    const userId = matches[1]
    return message.mentions.users.get(userId)
  } else {
    return arg
  }
}

module.exports.isCommand = function (commandChar, message) {
  return message.content[0] === commandChar &&
    !message.system &&
    message.member &&
    !message.author.bot &&
    !message.deleted
}

module.exports.parseCommand = function (message) {
  const parts = message.content
    .split(' ')
    .filter(p => p !== '')

  const args = parts
    .slice(1)
    .map(arg => convertUserMention(arg, message))

  return {
    name: parts[0].substring(1),
    args: args
  }
}

module.exports.argsMatch = function (args, spec) {
  if (args.length !== spec.length) {
    return false
  }

  const pairs = zip(args, spec)
  return every(pairs, ([arg, type]) => {
    switch (type) {
      case 'string':
        return typeof arg === 'string'
      case 'user':
        return arg instanceof User
      default:
        throw Error(`Unknown type ${type}`)
    }
  })
}

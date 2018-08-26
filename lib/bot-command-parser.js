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

module.exports = class {
  constructor (commandChar) {
    this.commandChar = commandChar
  }

  isCommand (message) {
    return message.content[0] === this.commandChar &&
      !message.system &&
      message.member &&
      !message.author.bot &&
      !message.deleted
  }

  parseCommand (message) {
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
}

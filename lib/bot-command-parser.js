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
    const parts = message.content.split(' ')
    return {
      name: parts[0].substring(1),
      args: parts.slice(1)
    }
  }
}

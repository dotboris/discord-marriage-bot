const {expect} = require('chai')
const BotCommandParser = require('../lib/bot-command-parser')
const {Collection} = require('discord.js')

function command (commandChar, name, ...args) {
  return rawCommand([commandChar + name, ...args].join(' '))
}

function rawCommand (message) {
  return {
    author: {bot: false},
    content: message,
    system: false,
    member: {}
  }
}

describe('BotCommandParser', () => {
  let parser
  beforeEach(() => {
    parser = new BotCommandParser(';')
  })

  describe('isCommand', () => {
    it('should be truthy for user message starting with commandChar', () => {
      expect(parser.isCommand(command(';', 'something')))
        .to.be.truthy()
    })

    it('should be falsy for bots', () => {
      expect(parser.isCommand({
        ...command(';', 'whatever'),
        author: {bot: true}
      })).to.be.falsy()
    })

    it('should be falsy for system message', () => {
      expect(parser.isCommand({
        ...command(';', 'whatever'),
        system: true
      })).to.be.falsy()
    })

    it('should be falsy when commandChar missing', () => {
      expect(parser.isCommand(command('!', 'whatever'))).to.be.falsy()
    })

    it('should be falsy for non guild member', () => {
      expect(parser.isCommand({
        ...command(';', 'whatever'),
        member: null
      })).to.be.falsy()
    })
  })

  describe('parseCommand', () => {
    it('should extract command name', () => {
      const res = parser.parseCommand(command(';', 'foobar', 'fi', 'fo', 'fum'))
      expect(res).to.have.property('name', 'foobar')
    })

    it('should extract args', () => {
      const res = parser.parseCommand(command(';', 'foobar', 'fi', 'fo', 'fum'))
      expect(res).to.have.property('args').deep.equal(['fi', 'fo', 'fum'])
    })

    it('should deal with redundant spaces', () => {
      const res = parser.parseCommand(rawCommand('   ;test  foo bar    baz   '))
      expect(res).to.have.property('name', 'test')
      expect(res).to.have.property('args').deep.equal(['foo', 'bar', 'baz'])
    })

    it('should convert user mentions', () => {
      const c = command(';', 'foobar', 'fi', '<@1234567890>', 'fum')
      c.mentions = {
        users: new Collection([['1234567890', {username: 'fo'}]])
      }

      const res = parser.parseCommand(c)
      expect(res).to.have.property('args').deep.equal(['fi', {username: 'fo'}, 'fum'])
    })
  })
})

const {expect} = require('chai')
const BotCommandParser = require('../lib/bot-command-parser')

function command (commandChar, name, ...args) {
  return {
    author: {bot: false},
    content: [commandChar + name, ...args].join(' '),
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
    it('should extract command name')
    it('should extract args')
    it('should convert user mentions')
  })
})

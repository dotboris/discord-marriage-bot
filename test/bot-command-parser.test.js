const {expect} = require('chai')
const BotCommandParser = require('../lib/bot-command-parser')

describe('BotCommandParser', () => {
  describe('isCommand', () => {
    let parser
    beforeEach(() => {
      parser = new BotCommandParser(';')
    })

    it('should be truthy for user message starting with commandChar', () => {
      expect(parser.isCommand({
        author: {bot: false},
        content: ';something',
        system: false,
        member: {}
      })).to.be.truthy()
    })

    it('should be falsy for bots', () => {
      expect(parser.isCommand({
        author: {bot: true},
        content: ';something',
        system: false,
        member: {}
      })).to.be.falsy()
    })

    it('should be falsy for system message', () => {
      expect(parser.isCommand({
        author: {bot: false},
        content: ';something',
        system: true,
        member: {}
      })).to.be.falsy()
    })

    it('should be falsy when commandChar missing', () => {
      expect(parser.isCommand({
        author: {bot: false},
        content: '!something',
        system: false,
        member: {}
      })).to.be.falsy()
    })

    it('should be falsy for non guild member', () => {
      expect(parser.isCommand({
        author: {bot: false},
        content: ';something',
        system: false,
        member: null
      })).to.be.falsy()
    })
  })
})

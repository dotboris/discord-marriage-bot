const {expect} = require('chai')
const botParse = require('../lib/bot-parse')
const {Collection, User} = require('discord.js')

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

describe('lib/bot-parse', () => {
  describe('isCommand', () => {
    it('should be truthy for user message starting with commandChar', () => {
      expect(botParse.isCommand(';', command(';', 'something')))
        .to.be.truthy()
    })

    it('should be falsy for bots', () => {
      expect(botParse.isCommand(';', {
        ...command(';', 'whatever'),
        author: {bot: true}
      })).to.be.falsy()
    })

    it('should be falsy for system message', () => {
      expect(botParse.isCommand(';', {
        ...command(';', 'whatever'),
        system: true
      })).to.be.falsy()
    })

    it('should be falsy when commandChar missing', () => {
      expect(botParse.isCommand(';', command('!', 'whatever'))).to.be.falsy()
    })

    it('should be falsy for non guild member', () => {
      expect(botParse.isCommand(';', {
        ...command(';', 'whatever'),
        member: null
      })).to.be.falsy()
    })
  })

  describe('parseCommand', () => {
    it('should extract command name', () => {
      const res = botParse.parseCommand(command(';', 'foobar', 'fi', 'fo', 'fum'))
      expect(res).to.have.property('name', 'foobar')
    })

    it('should extract args', () => {
      const res = botParse.parseCommand(command(';', 'foobar', 'fi', 'fo', 'fum'))
      expect(res).to.have.property('args').deep.equal(['fi', 'fo', 'fum'])
    })

    it('should deal with redundant spaces', () => {
      const res = botParse.parseCommand(rawCommand('   ;test  foo bar    baz   '))
      expect(res).to.have.property('name', 'test')
      expect(res).to.have.property('args').deep.equal(['foo', 'bar', 'baz'])
    })

    it('should convert user mentions', () => {
      const c = command(';', 'foobar', 'fi', '<@1234567890>', 'fum')
      c.mentions = {
        users: new Collection([['1234567890', {username: 'fo'}]])
      }

      const res = botParse.parseCommand(c)
      expect(res).to.have.property('args').deep.equal(['fi', {username: 'fo'}, 'fum'])
    })
  })

  describe('argsMatch', () => {
    it('should match when the planets align', () => {
      const args = ['foo', new User()]
      const spec = ['string', 'user']

      expect(botParse.argsMatch(args, spec)).to.be.true()
    })

    it('should fail when size different', () => {
      const args = ['1', '2', '3']
      const spec = ['string', 'string']

      expect(botParse.argsMatch(args, spec)).to.be.false()
    })

    it('should recognize strings', () => {
      const args = ['1', '2']
      const spec = ['string', 'string']

      expect(botParse.argsMatch(args, spec)).to.be.true()
    })

    it('should recognize user mentions', () => {
      const args = [new User(), new User()]
      const spec = ['user', 'user']

      expect(botParse.argsMatch(args, spec)).to.be.true()
    })
  })
})

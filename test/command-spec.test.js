const {expect} = require('chai')
const CommandSpec = require('../lib/command-spec')

describe('lib/command-spec', () => {
  describe('findCommand', () => {
    const COMMANDS = {
      afla: {
        _testTarget: 'alfa',
        aliases: ['a', 'al']
      },
      bravo: {
        _testTarget: 'bravo',
        aliases: []
      }
    }

    it('should find by exact command name', () => {
      const index = CommandSpec.makeIndex(COMMANDS)

      const res = CommandSpec.findCommand(index, 'bravo')

      expect(res).to.have.property('_testTarget', 'bravo')
    })

    it('should find by alias', () => {
      const index = CommandSpec.makeIndex(COMMANDS)

      const res = CommandSpec.findCommand(index, 'al')

      expect(res).to.have.property('_testTarget', 'alfa')
    })

    it('should return nothing when nothing found', () => {
      const index = CommandSpec.makeIndex(COMMANDS)

      const res = CommandSpec.findCommand(index, 'nope')

      expect(res).to.be.undefined()
    })
  })

  describe('generateHelp', () => {
    const COMMANDS = {
      foobar: {
        aliases: ['ALIAS1', 'ALIAS2'],
        args: [
          {name: 'thing'},
          {name: '@someone'},
          {name: 'stuff'}
        ],
        description: 'this is the description'
      }
    }

    it('should contain command example', () => {
      const res = CommandSpec.generateHelp(COMMANDS)

      expect(res).to.include('foobar')
      expect(res).to.include('thing @someone stuff')
    })

    it('should contain aliases', () => {
      const res = CommandSpec.generateHelp(COMMANDS)

      expect(res).to.include('ALIAS1')
      expect(res).to.include('ALIAS2')
    })

    it('should contain description', () => {
      const res = CommandSpec.generateHelp(COMMANDS)

      expect(res).to.include('this is the description')
    })
  })
})

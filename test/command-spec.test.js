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
})

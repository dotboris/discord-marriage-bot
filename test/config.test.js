const config = require('../lib/config')
const { expect } = require('chai')

describe('lib/config', () => {
  describe('validate', () => {
    it('should be happy with all fields', async () => {
      const res = await config.validate({
        discordToken: 'some-long-ass-string',
        commandChar: '?'
      })

      expect(res).to.have.property('valid', true)
    })

    it('should complain with empty object', async () => {
      const res = await config.validate({})

      expect(res).to.have.property('valid', false)
    })

    it('should complain with space in discordToken', async () => {
      const res = await config.validate({
        discordToken: 'wooo   spaces',
        commandChar: '?'
      })

      expect(res).to.have.property('valid', false)
    })

    it('should complain with spaces in commandChar', async () => {
      const res = await config.validate({
        discordToken: 'some-long-ass-string',
        commandChar: '? ?'
      })

      expect(res).to.have.property('valid', false)
    })
  })
})

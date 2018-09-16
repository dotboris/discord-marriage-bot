const yaml = require('js-yaml')
const path = require('path')
const fs = require('fs-extra')
const Ajv = require('ajv')

const SCHEMA = {
  type: 'object',
  properties: {
    discordToken: {
      type: 'string',
      pattern: '^[^\\s]+$'
    },
    commandChar: {
      type: 'string',
      pattern: '^[^\\s]+$'
    }
  },

  required: ['discordToken', 'commandChar']
}

function configFilePath (dir) {
  return path.join(dir, 'config.yml')
}

module.exports.read = async function (dir) {
  const contents = await fs.readFile(configFilePath(dir))
  return yaml.safeLoad(contents)
}

module.exports.validate = async function (config) {
  const validator = new Ajv({ allErrors: true })

  const isValid = await validator.validate(SCHEMA, config)

  return {
    valid: isValid,
    errors: validator.errors || []
  }
}

module.exports.save = async function (dir, config) {
  return fs.writeFile(
    configFilePath(dir),
    yaml.safeDump(config)
  )
}

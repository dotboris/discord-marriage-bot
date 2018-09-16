const fs = require('fs-extra')
const database = require('../database')
const prompts = require('prompts')
const config = require('../config')

function validateNotEmpty (value) {
  if (value.trim() === '') {
    return 'Must not be empty'
  } else {
    return true
  }
}

module.exports = async function (dir) {
  await fs.ensureDir(dir)
  const db = await database.open(dir)
  await database.migrate(db, dir)

  const res = await prompts([
    {
      type: 'text',
      name: 'discordToken',
      message: 'What is your discord token?',
      validate: validateNotEmpty
    },
    {
      type: 'text',
      name: 'commandChar',
      message: 'What character do you want to use for command?',
      validate: validateNotEmpty
    }
  ])

  const newConfig = {
    discordToken: res.discordToken.trim(),
    commandChar: res.commandChar.trim()
  }

  const { valid, errors } = await config.validate(newConfig)
  if (!valid) {
    console.log(errors)
    return { code: 1 }
  }

  await config.save(dir, newConfig)
}

const fs = require('fs-extra')
const Database = require('../database')

module.exports = async function (dir) {
  await fs.ensureDir(dir)
  const db = await Database.open(dir)
  await Database.migrate(db)
}

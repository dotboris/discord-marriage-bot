const database = require('../database')

module.exports = async function (dir) {
  const db = await database.open(dir)
  await database.migrate(db, dir)
}

const path = require('path')
const sqlite = require('sqlite')

module.exports.open = async function (dir) {
  return sqlite.open(path.join(dir, 'db.sqlite'))
}

module.exports.migrate = async function (db) {
  await db.migrate(path.join(__dirname, '../migrations'))
}

const { promisify } = require('util')
const path = require('path')
const { Database } = require('sqlite3')
const Migrator = require('umzug')

function createDb (file) {
  return new Promise((resolve, reject) => {
    const db = new Database(file, err => {
      if (err) {
        reject(err)
      } else {
        resolve(db)
      }
    })
  })
}

const DB_ASYNC_METHODS = [
  'close',
  'run',
  'get',
  'all',
  'exec',
  'prepare'
]
function promisifyDb (db) {
  for (const method of DB_ASYNC_METHODS) {
    const fn = db[method]
    db[`_cb_${method}`] = fn
    db[method] = promisify(fn)
  }
}

module.exports.open = async function (dir) {
  const db = await createDb(path.join(dir, 'database.sqlite'))
  promisifyDb(db)
  return db
}

module.exports.migrate = async function (db, dir) {
  const mig = new Migrator({
    storage: 'json',
    storageOptions: {
      path: path.join(dir, 'migrations.json')
    },
    migrations: {
      path: path.join(__dirname, '../migrations'),
      params: [db, dir]
    }
  })

  await mig.up()
}

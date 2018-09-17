module.exports.up = async function (db) {
  await db.exec('alter table relationships add column direction text null')
}

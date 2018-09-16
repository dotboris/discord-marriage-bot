module.exports.up = async function (db) {
  await db.run(`
    create table relationships (
      person_a integer not null,
      person_b integer not null,
      type text not null,
      primary key(person_a, person_b)
    );
  `)
}

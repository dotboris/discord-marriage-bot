module.exports.up = async function (db) {
  // We're storing dicsord ids (snowflakes) in the DB, they're max 64bit blobs
  // The issue is that JS can't represent a 64bit uint because it's numbes are
  // actually doubles.
  // To work around this whole mess we store those ids as varchar(20) in the db.
  // This lets us store the full number and it lets js read it as a string
  // without losing precision
  // See: Precision lost with bigint https://github.com/mapbox/node-sqlite3/issues/922
  await db.run(`
    create table relationships (
      person_a varchar(20) not null,
      person_b varchar(20) not null,
      type text not null,
      primary key(person_a, person_b)
    );
  `)
}

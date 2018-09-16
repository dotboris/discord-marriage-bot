module.exports.add = async function (db, aId, bId, type) {
  const [sortedAId, sortedBId] = [aId, bId].sort()

  await db.run(
    `insert into relationships (person_a, person_b, type)
    values ($a, $b, $type)`,
    { $a: sortedAId, $b: sortedBId, $type: type }
  )
}

module.exports.delete = async function (db, aId, bId) {
  const [sortedAId, sortedBId] = [aId, bId].sort()
  await db.run(
    `delete from relationships
    where person_a = $a and person_b = $b`,
    { $a: sortedAId, $b: sortedBId }
  )
}

module.exports.inRelationship = async function (db, aId, bId) {
  const [sortedAId, sortedBId] = [aId, bId].sort()

  const { count } = await db.get(
    `select count(*) as count
    from relationships
    where person_a = $a and person_b = $b`,
    { $a: sortedAId, $b: sortedBId }
  )

  return count === 1
}

module.exports.getRelationships = async function (db, personId) {
  personId = String(personId)

  const rows = await db.all(
    `select person_a, person_b, type
    from relationships
    where person_a = $person or person_b = $person`,
    { $person: personId }
  )

  return rows.map(row => {
    let otherPerson
    if (row.person_a === personId) {
      otherPerson = row.person_b
    } else {
      otherPerson = row.person_a
    }

    return { person: otherPerson, type: row.type }
  })
}

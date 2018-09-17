function inverseDirection (direction) {
  switch (direction) {
    case 'a-to-b':
      return 'b-to-a'
    case 'b-to-a':
      return 'a-to-b'
    default:
      return direction
  }
}

module.exports.add = async function (db, aId, bId, type, direction) {
  const [sortedAId, sortedBId] = [aId, bId].sort()

  if (sortedAId !== aId) {
    // We swapped the ids around, the direction is wrong now.
    // We need to inverse it to keep it consistent

    direction = inverseDirection(direction)
  }

  await db.run(
    `insert into relationships (person_a, person_b, type, direction)
    values ($a, $b, $type, $direction)`,
    { $a: sortedAId, $b: sortedBId, $type: type, $direction: direction }
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
    `select person_a, person_b, type, direction
    from relationships
    where person_a = $person or person_b = $person`,
    { $person: personId }
  )

  return rows.map(row => {
    let otherPerson
    let direction

    // Here we consider that `personId` is `person_a` in the relationship
    // In cases where `personId` is actually `person_b`, we inverse the direction
    // to keep it consistent
    if (row.person_a === personId) {
      otherPerson = row.person_b
      direction = row.direction
    } else {
      otherPerson = row.person_a
      direction = inverseDirection(row.direction)
    }

    return { person: otherPerson, type: row.type, direction }
  })
}

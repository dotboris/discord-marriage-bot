const questions = require('./questions')
const relationships = require('./relationships')

async function createRelationship (relationshipType, relationshipDirection, { db }, message, person) {
  // TODO: swap texts based on type

  const authorId = message.author.id
  const personId = person.id

  if (authorId === personId) {
    await message.reply("I'll be honest. Proposing to yourself is a little sad.")
    return
  }

  if (await relationships.inRelationship(db, authorId, personId)) {
    await message.reply(`You're already in a relationship with ${person.username}`)
    return
  }

  const questionMessage = await message.channel.send(
    `<@${personId}> do you want to be engaged to ${message.author.username}?\n` +
    'To answer, react with:    👍 for yes    👎 for no'
  )
  await questionMessage.react('👍')
  await questionMessage.react('👎')

  const question = questions.create(60 * 1000)
  const collector = questionMessage.createReactionCollector((r, user) =>
    user.id === personId &&
    (r.emoji.name === '👍' || r.emoji.name === '👎')
  )
  collector.on('collect', r => {
    questions.answer(question, r.emoji.name === '👍')
  })

  const { timeout, answer } = await question.promise
  collector.stop()
  if (timeout) {
    await message.reply('Oops, timeout')
  } else if (answer) {
    await message.reply('They said yes!')
    await relationships.add(db, authorId, personId, relationshipType, relationshipDirection)
  } else {
    await message.reply('Sorry, they said no')
  }
}

function createRelationshipCommand (relationshipType, relationshipDirection) {
  return async (...args) => createRelationship(relationshipType, relationshipDirection, ...args)
}

module.exports.marry = createRelationshipCommand('married', null)
module.exports.date = createRelationshipCommand('dating', null)
module.exports.adopt = createRelationshipCommand('parent-child', 'a-to-b')
module.exports.adoptMe = createRelationshipCommand('parent-child', 'b-to-a')

module.exports.leave = async function ({ db }, message, person) {
  const authorId = message.author.id
  const personId = person.id

  if (!await relationships.inRelationship(db, authorId, personId)) {
    await message.reply(`You're not in a relationship with ${person.username}`)
    return
  }

  await relationships.delete(db, authorId, personId)
  await message.channel.send(`<@${personId}> ${message.author.username} has left your relationship`)
}

module.exports.listRelationships = async function ({ db }, message) {
  const authorId = message.author.id

  const rels = await relationships.getRelationships(db, authorId)
  if (rels.length === 0) {
    await message.reply("Sorry, you're not in a relationship with anyone right now.")
  } else {
    let res = ''
    for (const rel of rels) {
      const person = await message.guild.fetchMember(rel.person)
      switch (rel.type) {
        case 'married':
          res += `- Married to ${person.displayName}\n`
          break
        case 'dating':
          res += `- Dating ${person.displayName}\n`
          break
        case 'parent-child':
          if (rel.direction === 'a-to-b') {
            res += `- Parent of ${person.displayName}\n`
          } else {
            res += `- Child of ${person.displayName}\n`
          }
          break
        default:
          res += `- (${res.type}) ${person.displayName}\n`
          break
      }
    }

    await message.channel.send(res)
  }
}

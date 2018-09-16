const questions = require('./questions')
const relationships = require('./relationships')

module.exports.listRelationships = async function (state, message) {
}

module.exports.propose = async function ({ db }, message, person) {
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
    await relationships.add(db, authorId, personId, 'married')
  } else {
    await message.reply('Sorry, they said no')
  }
}

module.exports.leave = async function (state, message, person) {
}

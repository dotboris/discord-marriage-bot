const questions = require('./questions')

module.exports.listRelationships = async function (state, message) {
}

module.exports.propose = async function ({questions: qdb}, message, person) {
  const authorId = message.author.id
  const personId = person.id

  if (authorId === personId) {
    await message.reply("I'll be honest. Proposing to yourself is a little sad.")
    return
  }

  if (questions.isAsking(qdb, authorId)) {
    await message.reply("You're already proposing to someone.")
    return
  }

  if (questions.isBeingAsked(qdb, authorId)) {
    await message.reply('Someone is already proposing to you.')
    return
  }

  if (questions.isAsking(qdb, personId)) {
    await message.reply(`${person.username} is already proposing to someone.`)
    return
  }

  if (questions.isBeingAsked(qdb, personId)) {
    await message.reply(`${person.username} is already being proposed to.`)
    return
  }

  questions.create(qdb, authorId, personId, 60 * 1000, {
    onAnswer (answer) {
      message.reply(`They said ${answer}!`)
    },
    onTimeout () {
      message.reply('Oops, timeout!')
    }
  })

  await message.channel.send(`<@${personId}> do you want to be engaged to <@${authorId}>?`)
}

module.exports.accept = async function ({questions: qdb}, message) {
  const authorId = message.author.id

  if (!questions.isBeingAsked(qdb, authorId)) {
    await message.reply('No one asked you anything')
    return
  }

  questions.answer(qdb, authorId, 'yes')
}

module.exports.decline = async function ({questions: qdb}, message) {
  const authorId = message.author.id

  if (!questions.isBeingAsked(qdb, authorId)) {
    await message.reply('No one asked you anything')
    return
  }

  questions.answer(qdb, authorId, 'no')
}

module.exports.startWedding = async function (state, message) {
}

module.exports.breakup = async function (state, message, person) {
}

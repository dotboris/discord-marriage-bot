const questions = require('./questions')

// TODO: this probably needs a better place to live
const QUESTIONS_DB = questions.createDb()

module.exports.listRelationships = async function (message) {
}

module.exports.propose = async function (message, person) {
  const db = QUESTIONS_DB
  const authorId = message.author.id
  const personId = person.id

  if (authorId === personId) {
    await message.reply("I'll be honest. Proposing to yourself is a little sad.")
    return
  }

  if (questions.isAsking(db, authorId)) {
    await message.reply("You're already proposing to someone.")
    return
  }

  if (questions.isBeingAsked(db, authorId)) {
    await message.reply('Someone is already proposing to you.')
    return
  }

  if (questions.isAsking(db, personId)) {
    await message.reply(`${person.username} is already proposing to someone.`)
    return
  }

  if (questions.isBeingAsked(db, personId)) {
    await message.reply(`${person.username} is already being proposed to.`)
    return
  }

  questions.create(db, authorId, personId, 60 * 1000, {
    onAnswer (answer) {
      message.reply(`They said ${answer}!`)
    },
    onTimeout () {
      message.reply('Oops, timeout!')
    }
  })

  await message.channel.send(`<@${personId}> do you want to be engaged to <@${authorId}>?`)
}

module.exports.accept = async function (message) {
  const db = QUESTIONS_DB
  const authorId = message.author.id

  if (!questions.isBeingAsked(db, authorId)) {
    await message.reply('No one asked you anything')
    return
  }

  questions.answer(db, authorId, 'yes')
}

module.exports.decline = async function (message) {
  const db = QUESTIONS_DB
  const authorId = message.author.id

  if (!questions.isBeingAsked(db, authorId)) {
    await message.reply('No one asked you anything')
    return
  }

  questions.answer(db, authorId, 'no')
}

module.exports.startWedding = async function (message) {
}

module.exports.breakup = async function (message, person) {
}

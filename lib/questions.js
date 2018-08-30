const debug = require('debug')('questions')

module.exports.createDb = function () {
  return {
    questions: new Map(),
    askedIndex: new Map()
  }
}

function remove ({questions, askedIndex}, question) {
  debug(`removing ${question.asker} => ${question.asked}`)

  clearTimeout(question.timeoutHandler)
  questions.delete(question.asker)
  askedIndex.delete(question.asked)
}

function handleTimeout (db, asker) {
  const question = db.questions.get(asker)
  debug(`timeout on ${question.asker} => ${question.asked}`)
  remove(db, question)

  setImmediate(question.events.onTimeout, question)
}

module.exports.create = function (db, asker, asked, timeout, events) {
  debug(`creating ${asker} => ${asked} (timeout: ${timeout})`)
  const timeoutHandler = setTimeout(handleTimeout, timeout, db, asker)

  db.questions.set(asker, {asked, asker, events, timeoutHandler})
  db.askedIndex.set(asked, asker)
}

module.exports.answer = function (db, asked, answer) {
  const asker = db.askedIndex.get(asked)
  debug(`answering ${answer} for ${asker} => ${asked}`)

  const question = db.questions.get(asker)
  remove(db, question)
  setImmediate(question.events.onAnswer, answer, question)
}

module.exports.isAsking = function ({questions}, asker) {
  return questions.has(asker)
}

module.exports.isBeingAsked = function ({askedIndex}, asked) {
  return askedIndex.has(asked)
}

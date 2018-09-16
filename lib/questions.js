function handleTimeout (question) {
  setImmediate(question.resolve, { timeout: true })
}

module.exports.create = function (timeout) {
  const question = {}

  question.promise = new Promise((resolve, reject) => {
    question.resolve = resolve
    question.reject = reject
  })

  question.timeoutHandler = setTimeout(handleTimeout, timeout, question)

  return question
}

module.exports.answer = function (question, answer) {
  clearTimeout(question.timeoutHandler)
  setImmediate(question.resolve, { timeout: false, answer })
}

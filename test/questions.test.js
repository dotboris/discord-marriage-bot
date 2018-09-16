const questions = require('../lib/questions')
const {expect} = require('chai')
const {promisify} = require('util')

const delay = promisify(setTimeout)

describe('lib/questions', () => {
  it('should timeout on its own', async () => {
    const q = await questions.create(20).promise

    expect(q).to.deep.equal({ timeout: true })
  })

  it('should timeout when awaited after timeout', async () => {
    const q = questions.create(20)

    await delay(21)
    const res = await q.promise
    expect(res).to.deep.equal({ timeout: true })
  })

  it('should not trigger timeout when answered', async () => {
    const q = questions.create(50)

    await delay(25)
    questions.answer(q, 'gumbo')

    await delay(30)
    const res = await q.promise
    expect(res).to.have.property('timeout', false)
  })

  it('should return answer when given in time', async () => {
    const q = questions.create(50)

    await delay(25)
    questions.answer(q, 'gumbo')

    await delay(10)
    const res = await q.promise
    expect(res).to.deep.equal({ timeout: false, answer: 'gumbo' })
  })
})

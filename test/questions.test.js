const questions = require('../lib/questions')
const {expect} = require('chai')
const {promisify} = require('util')
const sinon = require('sinon')

const delay = promisify(setTimeout)

describe('lib/questions', () => {
  let db
  beforeEach(() => {
    db = questions.createDb()
  })

  it('should exist after created', () => {
    questions.create(db, 'foo', 'bar', 1, {onTimeout: () => {}})

    expect(questions.isAsking(db, 'foo')).to.be.true()
    expect(questions.isAsking(db, 'bar')).to.be.false()
    expect(questions.isBeingAsked(db, 'foo')).to.be.false()
    expect(questions.isBeingAsked(db, 'bar')).to.be.true()
  })

  it('should trigger timeout event after specified timeout', async () => {
    const onTimeout = sinon.spy()

    questions.create(db, 'foo', 'bar', 50, {onTimeout})

    await delay(25)
    expect(onTimeout).not.to.have.been.called()

    await delay(30)
    expect(onTimeout).to.have.been.called()
  })

  it('should be gone after timeout', async () => {
    questions.create(db, 'foo', 'bar', 50, {onTimeout: () => {}})

    await delay(25)
    expect(questions.isAsking(db, 'foo')).to.be.true()
    expect(questions.isBeingAsked(db, 'bar')).to.be.true()

    await delay(30)
    expect(questions.isAsking(db, 'foo')).to.be.false()
    expect(questions.isBeingAsked(db, 'bar')).to.be.false()
  })

  it('should not trigger timeout event if answered', async () => {
    const onTimeout = sinon.spy()
    questions.create(db, 'foo', 'bar', 50, {onAnswer: () => {}, onTimeout})

    await delay(25)
    questions.answer(db, 'bar', 'gumbo')

    await delay(30)
    expect(onTimeout).to.not.have.been.called()
  })

  it('should trigger answer event after answer', async () => {
    const onAnswer = sinon.spy()
    questions.create(db, 'foo', 'bar', 50, {onAnswer})

    await delay(25)
    questions.answer(db, 'bar', 'gumbo')

    await delay(10)
    expect(onAnswer).to.have.been.calledWith('gumbo')
  })

  it('should be gone after answer', async () => {
    questions.create(db, 'foo', 'bar', 50, {onAnswer: () => {}})

    await delay(25)

    expect(questions.isAsking(db, 'foo')).to.be.true()
    expect(questions.isBeingAsked(db, 'bar')).to.be.true()
    questions.answer(db, 'bar', 'whatever')
    expect(questions.isAsking(db, 'foo')).to.be.false()
    expect(questions.isBeingAsked(db, 'bar')).to.be.false()
  })
})

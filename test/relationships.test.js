const { expect } = require('chai')
const database = require('../lib/database')
const relationships = require('../lib/relationships')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')

describe('lib/relationships', () => {
  let db
  let dir
  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'node-tests-'))
    db = await database.open(dir)
    await database.migrate(db, dir)
  })

  afterEach(async () => {
    await db.close()
    await fs.remove(dir)
  })

  describe('add', () => {
    it('should fail when adding twice', async () => {
      await relationships.add(db, 1, 2, 'foobar')

      const res = relationships.add(db, 1, 2, 'foobar')

      await expect(res).to.be.rejected()
    })

    it('should fail when adding twice in wrong order', async () => {
      await relationships.add(db, 1, 2, 'foobar')

      const res = relationships.add(db, 2, 1, 'foobar')

      await expect(res).to.be.rejected()
    })
  })

  describe('delete', () => {
    it('should remove existing relationship', async () => {
      await relationships.add(db, 1, 2, 'foobar')
      const before = await relationships.inRelationship(db, 1, 2)
      expect(before).to.be.true()

      await relationships.delete(db, 1, 2)

      const after = await relationships.inRelationship(db, 1, 2)
      expect(after).to.be.false()
    })

    it('should remove existing relationship in wrong order', async () => {
      await relationships.add(db, 1, 2, 'foobar')
      const before = await relationships.inRelationship(db, 1, 2)
      expect(before).to.be.true()

      await relationships.delete(db, 2, 1)

      const after = await relationships.inRelationship(db, 1, 2)
      expect(after).to.be.false()
    })
  })

  describe('inRelationships', () => {
    it('should return true if both people in right order', async () => {
      await relationships.add(db, 1, 2, 'foobar')

      const res = await relationships.inRelationship(db, 1, 2)

      expect(res).to.be.true()
    })

    it('should return true if both people in wrong order', async () => {
      await relationships.add(db, 1, 2, 'foobar')

      const res = await relationships.inRelationship(db, 2, 1)

      expect(res).to.be.true()
    })

    it('should return false with no relationships', async () => {
      const res = await relationships.inRelationship(db, 2, 1)

      expect(res).to.be.false()
    })

    it('should return false with different person in right order', async () => {
      await relationships.add(db, 1, 3, 'foobar')

      const res = await relationships.inRelationship(db, 1, 2)

      expect(res).to.be.false()
    })

    it('should return false with different person in wrong order', async () => {
      await relationships.add(db, 1, 3, 'foobar')

      const res = await relationships.inRelationship(db, 2, 1)

      expect(res).to.be.false()
    })
  })

  describe('getRelationships', () => {
    it('should list all relationships', async () => {
      await relationships.add(db, 1, 2, 'dating', null)
      await relationships.add(db, 1, 3, 'married', null)
      await relationships.add(db, 1, 4, 'dating', null)
      await relationships.add(db, 1, 5, 'married', null)

      const res = await relationships.getRelationships(db, 1)

      expect(res).to.deep.equal([
        { person: '2', type: 'dating', direction: null },
        { person: '3', type: 'married', direction: null },
        { person: '4', type: 'dating', direction: null },
        { person: '5', type: 'married', direction: null }
      ])
    })

    it('should consider the person as person a and keep relationships consistent', async () => {
      await relationships.add(db, 5, 2, 'parent-child', 'a-to-b')
      await relationships.add(db, 5, 3, 'parent-child', 'b-to-a')
      await relationships.add(db, 5, 6, 'parent-child', 'a-to-b')
      await relationships.add(db, 5, 7, 'parent-child', 'b-to-a')

      const res = await relationships.getRelationships(db, 5)

      expect(res).to.deep.equal([
        { person: '2', type: 'parent-child', direction: 'a-to-b' },
        { person: '3', type: 'parent-child', direction: 'b-to-a' },
        { person: '6', type: 'parent-child', direction: 'a-to-b' },
        { person: '7', type: 'parent-child', direction: 'b-to-a' }
      ])
    })

    it('should return empty list with no relationships', async () => {
      const res = await relationships.getRelationships(db, 1)

      expect(res).to.deep.equal([])
    })
  })
})

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
      await relationships.add(db, 1, 2, 'dating')
      await relationships.add(db, 1, 3, 'married')
      await relationships.add(db, 1, 4, 'dating')
      await relationships.add(db, 1, 5, 'married')

      const res = await relationships.getRelationships(db, 1)

      expect(res).to.deep.equal([
        { person: 2, type: 'dating' },
        { person: 3, type: 'married' },
        { person: 4, type: 'dating' },
        { person: 5, type: 'married' }
      ])
    })

    it('should return empty list with no relationships', async () => {
      const res = await relationships.getRelationships(db, 1)

      expect(res).to.deep.equal([])
    })
  })
})

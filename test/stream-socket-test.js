/* eslint-env node, mocha */
const assert = require('assert')

const { create: createPair } = require('stream-pair')

const StreamSocket = require('../lib/stream-socket')

describe('StreamSocket', () => {
  it('should create socket and encode/decode packets', async () => {
    const pair = createPair()

    const a = new StreamSocket(pair)
    const b = new StreamSocket(pair.other)

    await a.send(Buffer.from('hello'))
    await a.send(Buffer.from('world'))
    assert.strictEqual((await b.receive()).toString(), 'hello')
    assert.strictEqual((await b.receive()).toString(), 'world')

    await a.close()
    await assert.rejects(b.receive(), {
      name: 'Error',
      message: 'Closed'
    })
    await assert.rejects(a.receive(), {
      name: 'Error',
      message: 'Closed'
    })
  })
})

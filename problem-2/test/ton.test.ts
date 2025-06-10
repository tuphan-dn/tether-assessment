import { expect } from 'chai'
import { tonClient } from '../src/ton/client'
import { watch } from '../src/ton'

describe('Notifications of TON', () => {
  it('should get incomming transactions on TON', async () => {
    const block = await tonClient.getMasterchainInfo()
    const tonList = await watch(block.latestSeqno, tonClient)
    expect(tonList).to.be.an('object')
  })
})

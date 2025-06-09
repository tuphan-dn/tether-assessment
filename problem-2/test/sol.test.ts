import { expect } from 'chai'
import { connection } from '../src/sol/client'
import { watch } from '../src/sol'

describe('Notifications of SOL', () => {
  it('should get incomming transactions on SOL', async () => {
    const latestSolBlockNumber = await connection.getSlot()
    const solList = await watch(latestSolBlockNumber, connection)
    expect(solList).to.be.an('object')
  })
})

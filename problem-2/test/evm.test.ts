import { expect } from 'chai'
import { ethClient, tronClient } from '../src/evm/client'
import { watch } from '../src/evm'

describe('Notifications of EVM', () => {
  it('should get incomming transactions on ETH', async () => {
    const latestEthBlockNumber = await ethClient.getBlockNumber()
    const ethList = await watch(latestEthBlockNumber, ethClient)
    expect(ethList).to.be.an('object')
  })
  it('should get incomming transactions on TRON', async () => {
    const latestTronBlockNumber = await tronClient.getBlockNumber()
    const tronList = await watch(latestTronBlockNumber, tronClient)
    expect(tronList).to.be.an('object')
  })
})

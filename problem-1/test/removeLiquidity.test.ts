import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
  type LocalAccount,
  createPublicClient,
  http,
  type PublicClient,
} from 'viem'
import { mainnet } from 'viem/chains'
import { UniswapRouter, UNISWAP_V2_ROUTER_ADDRESS } from '../dist'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('Remove liquidity in Uniswap V2', () => {
  let account: LocalAccount
  let client: PublicClient
  let router: UniswapRouter

  before(() => {
    account = privateKeyToAccount(generatePrivateKey())
    client = createPublicClient({
      chain: mainnet,
      transport: http(),
    })
    router = new UniswapRouter(UNISWAP_V2_ROUTER_ADDRESS, client)
  })

  it('should remove liquidity successfully', async () => {
    // TODO
    expect(true).to.be.true
  })
})

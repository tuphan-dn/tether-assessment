import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
  type LocalAccount,
  createPublicClient,
  http,
  parseEther,
  type PublicClient,
} from 'viem'
import { mainnet } from 'viem/chains'
import {
  UniswapRouter,
  UNISWAP_V2_ROUTER_ADDRESS,
  USDT_ADDRESS,
  WETH_ADDRESS,
} from '../dist'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('Add liquidity in Uniswap V2', () => {
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

  it('should add liquidity successfully', async () => {
    const amountADesired = parseEther('1', 'wei')
    const amountBDesired = 2500000000n // $2,500
    const { simulation } = await router.addLiquidity({
      tokenA: WETH_ADDRESS,
      tokenB: USDT_ADDRESS,
      amountADesired,
      amountBDesired,
      amountAMin: parseEther('0.9', 'wei'),
      amountBMin: 2400000000n,
      to: account.address,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 60),
    })
    expect(
      simulation.amountA === amountADesired ||
        simulation.amountB === amountBDesired,
    ).to.be.true
  })
})

import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
  type LocalAccount,
  createPublicClient,
  http,
  parseEther,
  type PublicClient,
  parseGwei,
  trim,
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

describe('Swap on Uniswap V2', () => {
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

  it('should swap successfully', async () => {
    const { simulation } = await router.swapExactTokensForTokens({
      amountIn: parseEther('1', 'wei'),
      amountOutMin: 2000000000n, // $2,000
      path: [WETH_ADDRESS, USDT_ADDRESS],
      to: account.address,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 60),
    })
    expect(simulation.amounts.length).greaterThanOrEqual(2)
  })

  it('should throw UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT', async () => {
    const tx = router.swapExactTokensForTokens({
      amountIn: parseEther('1', 'wei'),
      amountOutMin: 10000000000n, // $10,000
      path: [WETH_ADDRESS, USDT_ADDRESS],
      to: account.address,
      deadline: BigInt(Math.ceil(Date.now() / 1000) + 60),
    })
    await expect(tx).to.be.rejectedWith(
      'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT',
    )
  })

  it('should create a valid signedTransaction', async () => {
    const { tx } = await router.swapExactTokensForTokens({
      amountIn: parseEther('1', 'wei'),
      amountOutMin: 2000000000n, // $2,000
      path: [WETH_ADDRESS, USDT_ADDRESS],
      to: account.address,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 60),
    })
    const signedTx = await account.signTransaction({
      ...tx,
      maxFeePerGas: parseGwei('20'),
      maxPriorityFeePerGas: parseGwei('3'),
      gas: 21000n,
      value: 0n,
      nonce: await client.getTransactionCount(account),
      chainId: mainnet.id,
      type: 'eip1559',
    })
    expect(signedTx).include(tx.data.replace(/^0x/, ''))
  })
})

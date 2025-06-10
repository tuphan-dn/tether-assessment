import {
  type Address,
  encodeFunctionData,
  getContract,
  type GetContractReturnType,
  type PublicClient,
} from 'viem'
import { UNISWAP_V2_FACTORY_ADDRESS } from '@/config'
import { UniswapLibrary } from '@/uniswapLibrary'
import { ERC20_ABI, UNISWAP_V2_ROUTER_ABI } from '@/abi'

export class UniswapRouter {
  private readonly library: UniswapLibrary
  public readonly contract: GetContractReturnType<
    typeof UNISWAP_V2_ROUTER_ABI,
    PublicClient,
    Address
  >

  constructor(
    public readonly routerAddress: Address,
    private readonly client: PublicClient,
  ) {
    this.library = new UniswapLibrary(UNISWAP_V2_FACTORY_ADDRESS, this.client)
    this.contract = getContract({
      address: this.routerAddress,
      abi: UNISWAP_V2_ROUTER_ABI,
      client,
    })
  }

  addLiquidity = async ({
    tokenA,
    tokenB,
    amountADesired,
    amountBDesired,
    amountAMin,
    amountBMin,
    to,
    deadline,
  }: {
    tokenA: Address
    tokenB: Address
    amountADesired: bigint
    amountBDesired: bigint
    amountAMin: bigint
    amountBMin: bigint
    to: Address
    deadline: bigint
  }): Promise<{
    simulation: {
      amountA: bigint
      amountB: bigint
      liquidity: bigint
    }
    tx: { to: Address; data: `0x${string}` }
  }> => {
    if (BigInt(Date.now()) > deadline * 1000n)
      throw new Error('UniswapV2Router: EXPIRED')

    const pair = await this.library.pairFor([tokenA, tokenB])
    // Because `addLiquidity` transaction is monotonic, then always reserveA = balanceA, reserverB = balanceB on chain
    const [reserve0, reserve1] = await this.library.getReserves(pair)
    const [reserveA, reserveB] =
      tokenA === UniswapLibrary.sortTokens([tokenA, tokenB])[0]
        ? [reserve0, reserve1]
        : [reserve1, reserve0]
    const totalSupply = await getContract({
      abi: ERC20_ABI,
      address: pair,
      client: this.client,
    }).read.totalSupply()

    let amountA = 0n
    let amountB = 0n

    if (!reserveA && !reserveB) {
      amountA = amountADesired
      amountB = amountBDesired
    } else {
      const amountBOptimal = UniswapLibrary.quote(
        amountADesired,
        reserveA,
        reserveB,
      )
      if (amountBOptimal <= amountBDesired) {
        if (amountBOptimal < amountBMin)
          throw new Error('UniswapV2Router: INSUFFICIENT_B_AMOUNT')
        amountA = amountADesired
        amountB = amountBOptimal
      } else {
        const amountAOptimal = UniswapLibrary.quote(
          amountBDesired,
          reserveB,
          reserveA,
        )
        if (amountAOptimal > amountADesired || amountAOptimal < amountAMin)
          throw new Error('UniswapV2Router: INSUFFICIENT_A_AMOUNT')
        amountA = amountAOptimal
        amountB = amountBDesired
      }
    }

    const data = encodeFunctionData({
      abi: UNISWAP_V2_ROUTER_ABI,
      functionName: 'addLiquidity',
      args: [
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        to,
        deadline,
      ],
    })

    return {
      simulation: {
        amountA,
        amountB,
        liquidity: await this.library.mint({
          amountA,
          amountB,
          reserveA,
          reserveB,
          totalSupply,
        }),
      },
      tx: { to: this.contract.address, data },
    }
  }

  removeLiquidity = async () => {
    // TODO
  }

  swapExactTokensForTokens = async ({
    amountIn,
    amountOutMin,
    path,
    to,
    deadline,
  }: {
    amountIn: bigint
    amountOutMin: bigint
    path: Address[]
    to: Address
    deadline: bigint
  }): Promise<{
    simulation: {
      amounts: bigint[]
      fee: number
    }
    tx: { to: Address; data: `0x${string}` }
  }> => {
    if (BigInt(Date.now()) > deadline * 1000n)
      throw new Error('UniswapV2Router: EXPIRED')

    const amounts = await this.library.getAmountsOut({ amountIn, path })
    if (amounts[amounts.length - 1] < amountOutMin)
      throw new Error('UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT')

    const data = encodeFunctionData({
      abi: UNISWAP_V2_ROUTER_ABI,
      functionName: 'swapExactTokensForTokens',
      args: [amountIn, amountOutMin, path, to, deadline],
    })

    return {
      simulation: {
        amounts,
        fee: 0.003, // Fee is fixed at 0.3% in Uniswap V2
      },
      tx: { to: this.contract.address, data },
    }
  }
}

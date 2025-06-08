import {
  type Address,
  encodeFunctionData,
  getContract,
  type GetContractReturnType,
  type PublicClient,
} from 'viem'
import { UNISWAP_V2_FACTORY_ADDRESS } from '@/config'
import { UniswapLibrary } from '@/uniswapLibrary'
import { UNISWAP_V2_ROUTER_ABI } from '@/abi'

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
      tx: {
        to: this.contract.address,
        data,
      },
    }
  }
}

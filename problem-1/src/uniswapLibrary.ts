import {
  type Address,
  getContract,
  type GetContractReturnType,
  type PublicClient,
  zeroAddress,
} from 'viem'
import { UNISWAP_V2_FACTORY_ABI, UNISWAP_V2_PAIR_ABI } from '@/abi'

export class UniswapLibrary {
  public readonly contract: GetContractReturnType<
    typeof UNISWAP_V2_FACTORY_ABI,
    PublicClient,
    Address
  >

  constructor(
    public readonly factoryAddress: Address,
    private readonly client: PublicClient,
  ) {
    this.contract = getContract({
      address: factoryAddress,
      abi: UNISWAP_V2_FACTORY_ABI,
      client,
    })
  }

  static sortTokens = ([tokenA, tokenB]: [Address, Address]): [
    Address,
    Address,
  ] => {
    if (tokenA.toLowerCase() === tokenB.toLocaleLowerCase())
      throw new Error('UniswapV2Library: IDENTICAL_ADDRESSES')
    const [token0, token1] =
      tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA] // The comparison is equivalent in both JS and Solidity for the case of address string
    if (token0 === zeroAddress)
      throw new Error('UniswapV2Library: ZERO_ADDRESS')
    return [token0, token1]
  }

  pairFor = async ([tokenA, tokenB]: [Address, Address]): Promise<Address> => {
    const [token0, token1] = UniswapLibrary.sortTokens([tokenA, tokenB])
    const poolAddress = await this.contract.read.getPair([token0, token1])
    return poolAddress
  }

  getAmountOut({
    amountIn,
    reserveIn,
    reserveOut,
  }: {
    amountIn: bigint
    reserveIn: bigint
    reserveOut: bigint
  }) {
    if (amountIn <= 0)
      throw new Error('UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT')
    if (reserveIn <= 0 || reserveOut <= 0)
      throw new Error('UniswapV2Library: INSUFFICIENT_LIQUIDITY')
    const amountInWithFee = amountIn * 997n
    const numerator = amountInWithFee * reserveOut
    const denominator = reserveIn * 1000n + amountInWithFee
    const amountOut = numerator / denominator
    return amountOut
  }

  getAmountsOut = async ({
    amountIn,
    path,
  }: {
    amountIn: bigint
    path: Address[]
  }) => {
    if (path.length < 2) throw new Error('UniswapV2Library: INVALID_PATH')
    const amounts = new Array<bigint>(path.length)
    amounts[0] = amountIn
    for (let i = 0; i < path.length - 1; i++) {
      const pair = await this.pairFor([path[i], path[i + 1]])
      const [reserveIn, reserveOut] = await getContract({
        address: pair,
        abi: UNISWAP_V2_PAIR_ABI,
        client: this.client,
      }).read.getReserves()

      amounts[i + 1] = this.getAmountOut({
        amountIn: amounts[i],
        reserveIn,
        reserveOut,
      })
    }
    return amounts
  }
}

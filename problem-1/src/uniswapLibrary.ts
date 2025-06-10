import {
  type Address,
  getContract,
  type GetContractReturnType,
  type PublicClient,
  zeroAddress,
} from 'viem'
import { UNISWAP_V2_FACTORY_ABI, UNISWAP_V2_PAIR_ABI } from '@/abi'

export class SafeMath {
  static sqrt = (y: bigint) => {
    if (y < 0n) throw new Error('Negative square root')
    if (y < 4n) return 1n
    let z = y
    let x = y / 2n + 1n
    while (x < z) {
      z = x
      x = (y / x + x) / 2n
    }
    return z
  }

  static min = (a: bigint, b: bigint) => {
    if (a >= b) return b
    return a
  }
}

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

  static MINIMUM_LIQUIDITY = 1000n

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

  static quote = (
    amountA: bigint,
    reserveA: bigint,
    reserveB: bigint,
  ): bigint => {
    if (amountA <= 0n) throw new Error('UniswapV2Library: INSUFFICIENT_AMOUNT')
    if (reserveA <= 0n || reserveB <= 0n)
      throw new Error('UniswapV2Library: INSUFFICIENT_LIQUIDITY')
    return (amountA * reserveB) / reserveA
  }

  pairFor = async ([tokenA, tokenB]: [Address, Address]): Promise<Address> => {
    const [token0, token1] = UniswapLibrary.sortTokens([tokenA, tokenB])
    const poolAddress = await this.contract.read.getPair([token0, token1])
    return poolAddress
  }

  getReserves = async (pair: Address) => {
    const [reserve0, reserve1] = await getContract({
      address: pair,
      abi: UNISWAP_V2_PAIR_ABI,
      client: this.client,
    }).read.getReserves()
    return [reserve0, reserve1]
  }

  getAmountOut = ({
    amountIn,
    reserveIn,
    reserveOut,
  }: {
    amountIn: bigint
    reserveIn: bigint
    reserveOut: bigint
  }) => {
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
      const [reserve0, reserve1] = await this.getReserves(pair)
      const [reserveIn, reserveOut] =
        path[i] === UniswapLibrary.sortTokens([path[i], path[i + 1]])[0]
          ? [reserve0, reserve1]
          : [reserve1, reserve0]
      amounts[i + 1] = this.getAmountOut({
        amountIn: amounts[i],
        reserveIn,
        reserveOut,
      })
    }
    return amounts
  }

  mint = async ({
    amountA,
    amountB,
    reserveA,
    reserveB,
    totalSupply,
  }: {
    amountA: bigint
    amountB: bigint
    reserveA: bigint
    reserveB: bigint
    totalSupply: bigint
  }) => {
    if (!totalSupply)
      return SafeMath.sqrt(amountA * amountB) - UniswapLibrary.MINIMUM_LIQUIDITY
    return SafeMath.min(
      (amountA * totalSupply) / reserveA,
      (amountB * totalSupply) / reserveB,
    )
  }
}

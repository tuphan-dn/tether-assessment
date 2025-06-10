import { createPublicClient, http } from 'viem'
import { mainnet, tron } from 'viem/chains'

export const ethClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const tronClient = createPublicClient({
  chain: tron,
  transport: http('https://tron-evm-rpc.publicnode.com'),
})

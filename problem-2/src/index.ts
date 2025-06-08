import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

async function main() {
  const { transactions } = await client.getBlock({
    blockTag: 'latest',
    includeTransactions: true,
  })
  console.log(transactions)
}

main()

import { Address, decodeEventLog, Hex } from 'viem'
import { client } from './client'
import { Erc1155TransferSingleEvent, Erc20TransferEvent } from './events'

class RecordedTxs {
  public readonly txs: Record<Address, Hex[]> = {}

  push = (from: Address, to: Address, hash: Hex) => {
    // From
    this.txs[from] = this.txs[from] || []
    if (!this.txs[from].includes(hash)) this.txs[from].push(hash)
    // To
    this.txs[to] = this.txs[to] || []
    if (!this.txs[to].includes(hash)) this.txs[to].push(hash)
  }
}

export const watch = async (blockNumber: bigint) => {
  const { transactions } = await client.getBlock({
    blockNumber,
    includeTransactions: true,
  })

  const transferringTxs = new RecordedTxs()
  for (const tx of transactions) {
    if (!tx.to) {
      // Contract creation
    } else if (tx.input !== '0x') {
      // Call contract
      const { logs } = await client.getTransactionReceipt(tx)
      for (const log of logs) {
        for (const TransferEvent of [
          Erc20TransferEvent,
          Erc1155TransferSingleEvent,
        ]) {
          try {
            const { args } = decodeEventLog({
              abi: [TransferEvent],
              data: log.data,
              topics: log.topics,
            })
            transferringTxs.push(args.from, args.to, tx.hash)
            break
          } catch {}
        }
      }
    } else if (tx.value > 0n) {
      // Transfer ETH
      transferringTxs.push(tx.from, tx.to, tx.hash)
    } else {
      // Unknown
    }
  }
  return transferringTxs.txs
}

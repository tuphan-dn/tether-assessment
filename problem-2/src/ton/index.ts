import { type Maybe } from '@ton/ton/dist/utils/maybe'
import { type TonClient } from '@ton/ton'

class RecordedTxs {
  public readonly txs: Record<string, string[]> = {}

  push = (addrs: Maybe<string>[], hash: string) => {
    addrs.forEach((addr) => {
      if (!addr) return
      this.txs[addr] = this.txs[addr] || []
      if (!this.txs[addr].includes(hash)) this.txs[addr].push(hash)
    })
  }
}

export const watch = async (seqno: number, tonClient: TonClient) => {
  const transferringTxs = new RecordedTxs()
  // Get all shards in BaseChain
  const shards = await tonClient.getWorkchainShards(seqno)
  for (const { workchain, seqno, shard } of shards) {
    // Get all transactions in a shards
    const txs = await tonClient.getShardTransactions(workchain, seqno, shard)
    for (const { account, lt, hash } of txs) {
      // Flat all messages into an array
      const { inMessage, outMessages = [] } =
        (await tonClient.getTransaction(account, lt, hash)) || {}
      const msgs = !inMessage ? [] : [inMessage]
      for (const [, outMessage] of outMessages) msgs.push(outMessage)
      // Filter messages
      for (const { info, body } of msgs) {
        if (body.toString().toLowerCase().startsWith('x{0f8a7ea5')) {
          // Transfer Jettons
          transferringTxs.push(
            [info.src?.toString(), info.dest?.toString()],
            hash,
          )
        } else if ('value' in info) {
          // Transfer TON
          transferringTxs.push(
            [info.src.toString(), info.dest.toString()],
            hash,
          )
        } else {
          // Unknown
        }
      }
    }
  }
  return transferringTxs.txs
}

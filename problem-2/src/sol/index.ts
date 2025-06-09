import { Connection, type ParsedMessage } from '@solana/web3.js'

class RecordedTxs {
  public readonly txs: Record<string, string[]> = {}

  push = (source: string, destination: string, signature: string) => {
    // Source
    this.txs[source] = this.txs[source] || []
    if (!this.txs[source].includes(signature)) this.txs[source].push(signature)
    // Destination
    this.txs[destination] = this.txs[destination] || []
    if (!this.txs[destination].includes(signature))
      this.txs[destination].push(signature)
  }
}

export const watch = async (slot: number, connection: Connection) => {
  const { transactions = [] } =
    (await connection.getParsedBlock(slot, {
      maxSupportedTransactionVersion: 0,
      transactionDetails: 'full',
      rewards: false,
    })) || {}

  const transferringTxs = new RecordedTxs()
  for (const { transaction } of transactions) {
    const {
      // @ts-ignore: Mistype in @solana/web3.js
      message,
      signatures: [signature],
    } = transaction
    const { instructions } = message as ParsedMessage
    for (const ix of instructions) {
      if (!('parsed' in ix) || !('program' in ix)) continue
      const { parsed, program } = ix
      if (program === 'system' && parsed.type === 'transfer') {
        // Transfer SOL
        transferringTxs.push(
          parsed.info.source,
          parsed.info.destination,
          signature,
        )
      } else if (program === 'spl-token') {
        // Transfer SPL Tokens
        if (parsed.type === 'transfer' || parsed.type === 'transferChecked')
          transferringTxs.push(
            parsed.info.source,
            parsed.info.destination,
            signature,
          )
      } else {
        // Unknown
      }
    }
  }

  return transferringTxs.txs
}

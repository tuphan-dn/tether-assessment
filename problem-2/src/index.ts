import { watch as watchEVM } from './evm'
import { ethClient, tronClient } from './evm/client'
import { watch as watchSOL } from './sol'
import { connection } from './sol/client'

async function main() {
  // ETH
  // const latestEthBlockNumber = await ethClient.getBlockNumber()
  // const ethList = await watchEVM(latestEthBlockNumber, ethClient)

  // TRON
  // const latestTronBlockNumber = await tronClient.getBlockNumber()
  // const tronList = await watchEVM(latestTronBlockNumber, tronClient)
  // console.log(tronList)

  // SOL
  const latestSolBlockNumber = await connection.getSlot()
  const solList = await watchSOL(latestSolBlockNumber, connection)
  console.log(solList)

  // joint addresses in ethList with database to get FCM tokens and send notifications
}

main()

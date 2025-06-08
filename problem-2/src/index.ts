import { watch as watchEth } from './eth'
import { client as ethClient } from './eth/client'

async function main() {
  const latestEthBlockNumber = await ethClient.getBlockNumber()
  const ethList = await watchEth(latestEthBlockNumber)
  // joint addresses in ethList with database to get FCM tokens and send notifications
}

main()

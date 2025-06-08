# Task 1

Choose one DeFi protocol on any EVM chain of your choice and create a simple javascript module with the following capabilities.

1. Transaction Simulation

- Create functions that calculate the expected outcome of transactions
- This may involve:
  - Querying current on-chain state
  - Using protocol-specific math formulas to calculate expected results
  - Accounting for potential slippage, fees, etc.
- Return detailed information about expected outcomes without actually executing the transaction

2. Transaction Data Generation

- Create functions that return properly formatted transaction data
- This should include:
  - Target contract address
  - Function signature/selector
  - Properly encoded function parameters
- The returned data should be in a format ready to be used in a transaction

For example, if you were to choose to implement a lending protocol, the main relevant actions would be

- Supply
- Withdraw
- Borrow

## How to run?

```bash
npm start
```

## Justification

Although the task is named Transaction Simulation, the requirement askes for developing a function that calculates outputs based on the current contract states and protocol understaning. Therefore, instead of using `simulateTransaction`, which is available in `web3js`, `etherjs`, and `viem`, I'll build a custom function to assess a `swapExactTokensForTokens` for Uniswap V2 on the pool of ETH-USDT.

### (1) Transaction Simulation

To implement `swapExactTokensForTokens`, I have posted the relevant functions in `UniswapV2Factory` and `UniswapV2Router02` to off-chain assess the inputs and outputs. However, there are some side conditions, which is not effective to validate all of them like "Did the address approve tokens to the router?", "Is the balance sufficient?", "Does the pair of token exist?", etc.

In order to fully cover all cases, I highly recommend to run

```ts
await this.contract.simulate.swapExactTokensForTokens([
  amountIn,
  amountOutMin,
  path,
  to,
  deadline,
])
```

The function `swapExactTokensForTokens` in `uniswapRouter.ts` returns `result.simulation` containing the detailed output of a swap.

### (2) Transaction Data Generation

Not only `result.simulation`, The function `swapExactTokensForTokens` also returns `result.tx` including `to` address and `data`. To consume that output, we can do like this:

```ts
const client = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
})
const { tx } = await uniswapRouter.swapExactTokensForTokens({
  amountIn,
  amountOutMin,
  path,
  to,
  deadline,
})
const transaction = {
  ...tx,
  gasLimit: 4000000,
  value: 0,
  nonce: await client.getTransactionCount(account),
  chainId: mainnet.id,
}
const signedTx = await account.signTransaction({
  ...tx,
  maxFeePerGas: parseGwei('20'),
  maxPriorityFeePerGas: parseGwei('3'),
  gas: 21000n,
  value: 0n,
  nonce: await client.getTransactionCount(account),
  chainId: mainnet.id,
  type: 'eip1559',
})
```

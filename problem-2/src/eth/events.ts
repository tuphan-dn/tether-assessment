// ERC20 and ERC721 share the same Transfer signature so it's good to go with ERC20 only
export const Erc20TransferEvent = {
  type: 'event',
  name: 'Transfer',
  inputs: [
    { name: 'from', type: 'address', indexed: true },
    { name: 'to', type: 'address', indexed: true },
    { name: 'value', type: 'uint256' },
  ],
} as const

export const Erc1155TransferSingleEvent = {
  type: 'event',
  name: 'TransferSingle',
  inputs: [
    { name: 'operator', type: 'address', indexed: true },
    { name: 'from', type: 'address', indexed: true },
    { name: 'to', type: 'address', indexed: true },
    { name: 'id', type: 'uint256' },
    { name: 'value', type: 'uint256' },
  ],
} as const

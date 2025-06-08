# Problem 2

How would you implement real time notifications about incoming transactions in a mobile wallet that needs to support EVM, TON, Solana and Tron? Describe what you would do for each one.

## How to run?

```bash
npm test
```

## Justification

Effectively, we monitor every new block and catch which addresses have state changes. After that, we query those addresses in our database to get their Firebase Cloud Messaging (FCM) tokens and send them notifications with the corresponding transaction data.

### Firebase Cloud Messaging

> We might recall the overall system here without implementing it in source.

FCM works like a bridge between your server and users' devices to deliver push notifications even when the application is closed, which makes it a perfect fit to the mobile crypto wallet.

```mermaid
sequenceDiagram
    User Device->>FCM: Auth
    FCM->>User Device: FCM Token
    User Device->>Notification Server: Record to database
    Notification Server-->>FCM: Incoming transaction
    FCM->>User Device: Incoming transaction
```

### Block monitoring

To feed data to the Notification Server, the block monitoring must observe all account with state changes and filter them by the FCM token in database, where stores pairs of address and FCM token.

```mermaid
sequenceDiagram
    Block Monitoring->>Blockchain: Query new blocks
    Blockchain->>Block Monitoring: New Blocks
    Block Monitoring->>FCM Token Database: Query addresses
    FCM Token Database->>Block Monitoring: Matched addresses
    Block Monitoring-->>Block Monitoring: Parse corresponding transaction data
    Block Monitoring->>Notification Server: Feed the list of addresses and their incoming transaction
```

## References

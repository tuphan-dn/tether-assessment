# Problem 3

https://www.npmjs.com/package/@ton/crypto This module has been created by Ton Org. Are you able to import and make it work within a React Native application? Create a simple minimal app that allows the user to generate a keyPair starting from a mnemonic phrase. If for any reason you do not manage to complete the task, write a brief message about the reasons and the approaches you have tried.

## How to run?

First, you need to prepare the environment by follow this guide [Set up your environment](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated#set-up-an-ios-simulator-with-expo-go).

- XCode
- Expo CLI

Then, let's start Expo

```bash
# For iOS
npm run ios
# For Android
npm run android
```

## Justification

`@ton/crypto`, or `NaCl` precisely, is heavily relying on NodeJs modules (i.e. `crypto`) and global variable (i.e. `Buffer`), which are not always available in Hermes engine. One way to make it possible is by using `buffer` and `expo-crypto`. However, it's really slow and impractical.

An effective solution is to use `react-native-quick-crypto` and `@craftzdog/react-native-buffer` for `crypto` and `buffer` respectively. To set up, we create `polyfill.ts`.

```ts
import { install } from 'react-native-quick-crypto'

install()
```

Then auto run the file in `_layout.tsx`.

```ts
import '@/polyfill'
// ...
```

Furthermore, for any further usage of `crypto` and `buffer`, we resolve both module to `react-native-quick-crypto` and `@craftzdog/react-native-buffer` in `metro.config.js`

```ts
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

const aliases = [
  ['crypto', 'react-native-quick-crypto'],
  ['buffer', '@craftzdog/react-native-buffer'],
]

config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const [name, package] of aliases)
    if (moduleName === name) {
      return context.resolveRequest(context, package, platform)
    }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
```

## References

1. [https://www.npmjs.com/package/@ton/crypto](https://www.npmjs.com/package/@ton/crypto)
2. [https://www.npmjs.com/package/react-native-quick-crypto](https://www.npmjs.com/package/react-native-quick-crypto)
3. [https://www.npmjs.com/package/@craftzdog/react-native-buffer](https://www.npmjs.com/package/@craftzdog/react-native-buffer)

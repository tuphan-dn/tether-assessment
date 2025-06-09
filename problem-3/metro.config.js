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

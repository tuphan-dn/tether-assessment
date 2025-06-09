import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 700,
  },
  text: {
    opacity: 0.6,
    width: '100%',
  },
})

export default function Help() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to use?</Text>
      <Text style={styles.text}>
        1. You can input your mnemonic or Create new one with the "Random"
        button.
      </Text>
      <Text style={styles.text}>
        2. Choose "Reveal" to show Public Key & Secret Key.
      </Text>
    </View>
  )
}

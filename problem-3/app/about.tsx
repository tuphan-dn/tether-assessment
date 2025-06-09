import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 700,
  },
})

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About</Text>
    </View>
  )
}

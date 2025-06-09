import { Link, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 18,
  },
  text: {
    opacity: 0.6,
  },
  button: {
    fontWeight: 700,
    padding: 16,
    color: '#ffffff',
    backgroundColor: '#353434',
    borderRadius: 8,
    marginTop: 8,
  },
})

export default function About() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>problem/404 :(</Text>
        <Text style={styles.subtitle}>Not Found</Text>
        <Text style={styles.text}>
          Sorry, we could not find the requested resource.
        </Text>
        <Link href={'/'} style={styles.button}>
          Return Home
        </Link>
      </View>
    </>
  )
}

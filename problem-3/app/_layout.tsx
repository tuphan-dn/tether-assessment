import '@/polyfill'

import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Welcome',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          headerTitle: 'Help',
        }}
      />
    </Stack>
  )
}

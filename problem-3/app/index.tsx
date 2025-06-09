import { MyButton } from '@/components/button'
import { MyTextInput } from '@/components/input'
import { MyModal } from '@/components/modal'
import { Link } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 24,
  },
  link: {
    padding: 16,
    borderRadius: 8,
    fontWeight: 700,
    color: '#ffffff',
    backgroundColor: '#353434',
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 700,
  },
})

export default function Index() {
  const [open, setOpen] = useState(false)
  const [mnemonic, setMnemonic] = useState('')

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <View style={{ flexDirection: 'column', width: '100%', gap: 8 }}>
        <MyTextInput
          text={mnemonic}
          onChangeText={setMnemonic}
          placeholder="Mnemonic"
        />
        <MyButton title="Save" onPress={() => setOpen(true)} />
        <MyModal open={open} onClose={() => setOpen(false)}>
          <Text>{mnemonic}</Text>
        </MyModal>
      </View>
      <Link style={styles.link} href={'/about'}>
        About
      </Link>
    </View>
  )
}

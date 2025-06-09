import { MyButton } from '@/components/button'
import { MyTextInput } from '@/components/input'
import { MyModal } from '@/components/modal'
import { mnemonicNew, mnemonicToWalletKey, mnemonicValidate } from '@ton/crypto'
import { Link } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 700,
  },
  subtitle: {
    fontWeight: 700,
    opacity: 0.6,
  },
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
    color: '#353434f',
    backgroundColor: '#35343422',
    width: '100%',
    textAlign: 'center',
  },
})

export default function Index() {
  const [open, setOpen] = useState(false)
  const [mnemonic, setMnemonic] = useState('')
  const [keypair, setKeypair] = useState(['', ''])
  const [loading, setLoading] = useState(false)

  const onRandom = useCallback(async () => {
    setLoading(true)
    const dict = await mnemonicNew()
    setMnemonic(dict.join(' '))
    setLoading(false)
  }, [])

  const onMnemonic = useCallback(async () => {
    const dict = mnemonic.split(' ')
    const isValid = await mnemonicValidate(dict)
    if (!isValid) return setKeypair(['', ''])
    const { publicKey, secretKey } = await mnemonicToWalletKey(dict)
    return setKeypair([publicKey.toString('hex'), secretKey.toString('hex')])
  }, [mnemonic])

  useEffect(() => {
    onMnemonic()
  }, [onMnemonic])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <View style={{ flexDirection: 'column', width: '100%', gap: 8 }}>
        <MyTextInput
          text={mnemonic}
          onChangeText={setMnemonic}
          placeholder="Mnemonic"
        />
        <View style={{ flexDirection: 'row', width: '100%', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <MyButton title="Random" onPress={onRandom} disabled={loading} />
          </View>
          <View style={{ flex: 1 }}>
            <MyButton
              title="Reveal"
              onPress={() => setOpen(true)}
              disabled={!keypair[0]}
            />
          </View>
        </View>
        <MyModal open={open} onClose={() => setOpen(false)}>
          <View style={{ width: '100%', justifyContent: 'flex-start', gap: 4 }}>
            <Text style={styles.subtitle}>Public Key</Text>
            <Text style={{ marginBottom: 8 }}>{keypair[0]}</Text>
            <Text style={styles.subtitle}>Secret Key</Text>
            <Text style={{ marginBottom: 8 }}>{keypair[1]}</Text>
            <MyButton title="Close" onPress={() => setOpen(false)} />
          </View>
        </MyModal>
      </View>
      <Link style={styles.link} href={'/help'}>
        Help?
      </Link>
    </View>
  )
}

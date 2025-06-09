import {
  type GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native'

const styles = StyleSheet.create({
  pressable: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#353434',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { color: '#ffffff', fontWeight: 700 },
})

export type MyButtonProps = {
  title?: string
  onPress?: (e: GestureResponderEvent) => void
}

export function MyButton({ title, onPress }: MyButtonProps) {
  return (
    <Pressable style={styles.pressable} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  )
}

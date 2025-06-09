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
  disabled: {
    opacity: 0.6,
  },
  text: { color: '#ffffff', fontWeight: 700 },
})

export type MyButtonProps = {
  title?: string
  onPress?: (e: GestureResponderEvent) => void
  disabled?: boolean
}

export function MyButton({ title, onPress, disabled = false }: MyButtonProps) {
  return (
    <Pressable
      style={[styles.pressable, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  )
}

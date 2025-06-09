import { StyleSheet, TextInput } from 'react-native'

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#353434',
    borderRadius: 12,
    padding: 16,
  },
})

export type MyTextInputProps = {
  text?: string
  onChangeText?: (text: string) => void
  placeholder?: string
}

export function MyTextInput({
  text,
  onChangeText,
  placeholder,
}: MyTextInputProps) {
  return (
    <TextInput
      value={text}
      onChangeText={onChangeText}
      placeholder={placeholder}
      style={styles.input}
    />
  )
}

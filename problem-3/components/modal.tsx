import { ReactNode } from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    elevation: 5,
  },
})

export type MyModalProps = {
  open?: boolean
  onClose?: () => void
  children?: ReactNode
}

export function MyModal({ open, onClose, children }: MyModalProps) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={open}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.content}>{children}</View>
      </Pressable>
    </Modal>
  )
}

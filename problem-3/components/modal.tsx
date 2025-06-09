import { ReactNode } from 'react'
import { Modal, StyleSheet, View } from 'react-native'

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
    margin: 16,
    borderRadius: 16,
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
      <View style={styles.overlay}>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  )
}

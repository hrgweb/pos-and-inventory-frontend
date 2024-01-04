import { usePosStore } from '@/store/pos'

export default function useKeyboardShortcuts() {
  const pos = usePosStore()

  const itemLookup = () => {
    console.log('item lookup pressed')
    pos.openLookup()
  }

  const openPay = () => {
    console.log('pay pressed');
    pos.openPay()
  }

  const setupKeyboardShortcuts = () => {
    window.addEventListener('keydown', (event) => {
      if (event.altKey && event.code === 'Digit1') {
        itemLookup()
      }

      if (event.altKey && event.code === 'Enter') {
        openPay()
      }
    })
  }

  onMounted(() => {
    setupKeyboardShortcuts()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', itemLookup)
    // Remove other event listeners as needed
  })

  return {
    itemLookup, openPay
  }
}

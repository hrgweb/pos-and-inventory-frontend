import { usePosStore } from '@/store/pos'
import { usePageStore } from '@/store/page'

export default function useKeyboardShortcuts() {
  const pos = usePosStore()
  const page = usePageStore()

  const itemLookup = () => {
    console.log('item lookup pressed')
    pos.openLookup()
  }

  const openPay = () => {
    console.log('pay pressed')
    pos.openPay()
  }

  const openVoid = () => {
    console.log('void transaction pressed')
    pos.openVoid(page.transactionSession?.session_no)
  }

  const setupKeyboardShortcuts = () => {
    window.addEventListener('keydown', (event) => {
      // alt+1
      if (event.altKey && event.code === 'Digit1') {
        itemLookup()
      }
      // alt+enter
      if (event.altKey && event.code === 'Enter') {
        openPay()
      }
      // alt+backspace
      if (event.altKey && event.code === 'Backspace') {
        openVoid()
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
    itemLookup,
    openPay,
    openVoid
  }
}

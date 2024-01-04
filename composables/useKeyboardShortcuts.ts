import { usePosStore } from '@/store/pos'

export default function useKeyboardShortcuts() {
  const pos = usePosStore()

  const itemLookup = () => {
    console.log('item lookup pressed')
    pos.showLookup = !pos.showLookup
  }

  const setupKeyboardShortcuts = () => {
    window.addEventListener('keydown', (event) => {
        console.log('keydown listener...');

      if (event.altKey && event.code === 'Digit1') {
        itemLookup()
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
    itemLookup
  }
}

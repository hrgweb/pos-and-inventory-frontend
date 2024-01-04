export default function useKeyboardShortcuts() {
  const saveHandler = () => {
    // Your save logic
    console.log('Save function called')
  }

  const setupKeyboardShortcuts = () => {
    window.addEventListener('keydown', (event) => {
      console.log('keydown listener...')

      // Example: Ctrl + S for Save
      //   if (event.shiftKey && event.key === 'f') {
      //     saveHandler()
      //   }

      if (event.altKey && event.code === 'Digit1') {
        saveHandler()
      }
    })
  }

  onMounted(() => {
    setupKeyboardShortcuts()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', saveHandler)
    // Remove other event listeners as needed
  })

  return {
    saveHandler
  }
}

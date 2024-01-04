import { defineStore } from 'pinia'

export const usePosStore = defineStore('pos', () => {
  const showLookup = ref(false)

  async function openLookup(): Promise<void> {
    showLookup.value = !showLookup.value
    await nextTick()
    document.getElementById('search')?.focus()
  }

  return { showLookup, openLookup }
})

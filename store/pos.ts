import { defineStore } from 'pinia'

export const usePosStore = defineStore('pos', () => {
  const showLookup = ref(false)

  return { showLookup }
})

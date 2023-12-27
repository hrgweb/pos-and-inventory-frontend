import { defineStore } from 'pinia'
import type { Inventory } from '@/types/interface/inventory'

export const useInventoryStore = defineStore('inventory', () => {
  const form = reactive<Inventory[]>([])
  const formEdit = reactive<Inventory[]>([])
  const contact = reactive<Inventory[]>([])
})

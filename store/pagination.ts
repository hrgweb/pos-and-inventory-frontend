import { defineStore } from 'pinia'
import type { Pagination } from '@/types/pagination'

export const usePaginationStore = defineStore('pagination', () => {
  const result = ref<Pagination | null | undefined>(null)
  const curPage = ref(1)

  function create(payload: Pagination | null | undefined): void {
    result.value = payload
  }

  return { result, curPage, create }
})

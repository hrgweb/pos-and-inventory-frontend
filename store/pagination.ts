import { defineStore } from 'pinia'
import type { Pagination } from '@/types/pagination'

export const usePaginationStore = defineStore('pagination', () => {
  let result: {} | null | undefined = reactive({})
  const curPage = ref(1)

  function create<T>(payload: Pagination | null | undefined): void {
    result = payload
  }

  return { result, curPage, create }
})

import { defineStore } from 'pinia'
import type { Pagination } from '@/types/pagination'

export const usePaginationStore = defineStore('pagination', () => {
  let result: Pagination = reactive({
    data: [],
    meta: { total: 0 },
    links: []
  })
  const curPage = ref(1)

  function create(payload: Pagination) {
    result = payload
  }

  return { result, curPage, create }
})

import { defineStore } from 'pinia'
import type { Pagination } from '@/types/pagination'
import type { Product } from '@/types/interface/inventory'
import { usePaginationStore } from '@/store/pagination'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[] | null | undefined>([])
  const loading = ref(false)
  const search = ref('')
  const pagination = usePaginationStore()

  async function fetch(): Promise<void> {
    loading.value = true

    try {
      const paginate = (await $fetch(`${useBackendUrl()}/api/products`, {
        query: { page: pagination.curPage, search: search.value }
      })) as Pagination<Product>

      pagination.create(paginate)
      products.value = paginate?.data
    } catch (error) {
      console.log(error)
    }

    loading.value = false
  }

  return { products, loading, search, fetch }
})

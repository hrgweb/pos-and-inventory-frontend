import { defineStore } from 'pinia'
import type { Product, Inventory } from '@/types/interface/inventory'
import { TransactionType } from '@/types/enum/transactionType'
import { usePaginationStore } from '@/store/pagination'
import type { Pagination } from '@/types/pagination'

export const useInventoryStore = defineStore('inventory', () => {
  const pagination = usePaginationStore()

  const form = reactive<Inventory>(formData())
  const formEdit = reactive<Inventory>(formData())
  const contact = reactive<Inventory>(formData())
  const products = reactive<Product[]>([])
  const loading = ref(false)
  const search = ref('')
  const list = ref<Inventory[] | null | undefined>([])

  function formData() {
    return {
      product: {
        id: null,
        name: '',
        description: '',
        selling_price: 0,
        stock_qty: 0,
        reorder_level: 0,
        barcode: ''
      },
      transaction_type: TransactionType.PURCHASE,
      qty: 0,
      cost_price: 0,
      selling_price: 0,
      subtotal: 0,
      notes: ''
    }
  }

  async function fetch(): Promise<Pagination | null | undefined> {
    loading.value = true

    try {
      const paginate = (await $fetch<unknown>(
        `${useBackendUrl()}/api/transactions`,
        {
          query: { page: pagination.curPage, search: search.value }
        }
      )) as Pagination

      list.value = paginate?.data

      return paginate
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    formEdit,
    contact,
    products,
    fetch
  }
})

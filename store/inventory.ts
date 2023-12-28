import { defineStore } from 'pinia'
import type { Product, Inventory } from '@/types/interface/inventory'
import { TransactionType } from '@/types/enum/transactionType'
import { usePaginationStore } from '@/store/pagination'
import type { Pagination } from '@/types/pagination'
import type { Errors } from '@/types/errors'

export const useInventoryStore = defineStore('inventory', () => {
  const pagination = usePaginationStore()

  const form = reactive<Inventory>(formData())
  const formEdit = reactive<Inventory>(formData())
  const contact = reactive<Inventory>(formData())
  const products = ref<Product[]>([])
  const loading = ref(false)
  const search = ref('')
  const list = ref<Inventory[] | null | undefined>([])
  const loadingForm = ref(false)
  const showDialog = ref(false)
  let err: Errors = reactive({
    errors: {},
    message: ''
  })
  const isAdd = ref(false)
  const isEdit = ref(false)
  const selectedIndex = ref(0)
  const selectedProduct = ref<Product | null | undefined>()
  const removing = ref(false)

  function formData(): Inventory {
    return {
      id: null,
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

  interface Data {
    products: Product[]
  }

  async function data(): Promise<void> {
    loading.value = true

    try {
      const data = (await $fetch<unknown>(
        `${useBackendUrl()}/api/transactions/data`
      )) as Data

      products.value = data?.products
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
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

  async function save(): Promise<void> {
    loadingForm.value = true

    try {
      const inventory = (await $fetch<unknown>(
        `${useBackendUrl()}/api/transactions`,
        {
          method: 'POST',
          body: contact
        }
      )) as Inventory

      if (inventory) {
        list.value?.unshift(inventory)
        showDialog.value = false
        reset()
        resetError()
      }
    } catch (error: any) {
      Object.assign(err, error?.data)
    } finally {
      loadingForm.value = false
    }
  }

  async function update(): Promise<void> {
    loadingForm.value = true

    try {
      const updated = (await $fetch<unknown>(
        `${useBackendUrl()}/api/transactions/${contact.id}`,
        {
          method: 'PUT',
          body: contact
        }
      )) as Inventory

      if (updated) {
        if (list.value?.length) {
          Object.assign(list.value[selectedIndex.value], contact)
        }

        showDialog.value = false
        reset()
        resetError()
      }
    } catch (error: any) {
      Object.assign(err, error?.data)
    } finally {
      loadingForm.value = false
    }
  }

  async function removed(data: any, index: any): Promise<void> {
    removing.value = true

    try {
      const deleted = (await $fetch<unknown>(
        `${useBackendUrl()}/api/products/${data?.id}`,
        { method: 'DELETE', body: { name: data?.name } }
      )) as Product

      if (deleted) {
        if (list.value?.length) {
          list.value.splice(index, 1)
        }
      }
    } catch (error: any) {
      Object.assign(err, error?.data)
    } finally {
      removing.value = false
    }
  }

  function reset(): void {
    // contact.selling_price = 0
    // contact.name = ''
    // contact.description = ''
    // contact.selling_price = 0
    // contact.stock_qty = 0
    // contact.reorder_level = 0
    // contact.barcode = ''
  }

  function resetError(): void {
    err.errors = {}
    err.message = ''
  }

  function add(): void {
    showDialog.value = true
    Object.assign(form, formData())
    Object.assign(contact, form)
    isAdd.value = true
    isEdit.value = false
  }

  function edit(payload: any, index: number): void {
    selectedIndex.value = index
    selectedProduct.value = payload
    showDialog.value = true
    Object.assign(formEdit, payload)
    Object.assign(contact, formEdit)
    isAdd.value = false
    isEdit.value = true
  }

  return {
    loadingForm,
    isAdd,
    isEdit,
    showDialog,
    loading,
    search,
    err,
    list,
    form,
    formEdit,
    contact,
    products,
    data,
    fetch,
    save,
    add,
    edit,
    update,
    removed
  }
})

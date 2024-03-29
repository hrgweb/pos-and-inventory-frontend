import { defineStore } from 'pinia'
import type { Pagination } from '@/types/pagination'
import type { Product } from '@/types/interface/inventory'
import { usePaginationStore } from '@/store/pagination'
import type { Errors } from '@/types/errors'

export const useProductStore = defineStore('product', () => {
  const list = ref<Product[] | null | undefined>([])
  const loading = ref(false)
  const loadingForm = ref(false)
  const search = ref('')
  const pagination = usePaginationStore()
  let form = reactive<Product>(formData())
  let formEdit = reactive<Product>(formData())
  let contact = reactive<Product>(formData())
  const showDialog = ref(false)
  let err: Errors = reactive({
    errors: {},
    message: ''
  })
  const isAdd = ref(false)
  const isEdit = ref(false)
  const selectedProduct = ref<Product | null>(null)
  const selectedIndex = ref(0)
  const removing = ref(false)

  async function fetch(): Promise<Pagination | undefined | null> {
    loading.value = true

    try {
      const paginate = (await $fetch<unknown>(
        `${useBackendUrl()}/api/products`,
        {
          query: { page: pagination.curPage, search: search.value }
        }
      )) as Pagination

      list.value = paginate?.data
      loading.value = false

      return paginate
    } catch (error) {
      console.log(error)
      loading.value = false
    }
  }

  async function save(): Promise<void> {
    loadingForm.value = true

    try {
      const product = (await $fetch<unknown>(
        `${useBackendUrl()}/api/products`,
        {
          method: 'POST',
          body: contact
        }
      )) as Product

      if (product) {
        list.value?.unshift(product)
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
        `${useBackendUrl()}/api/products/${contact.id}`,
        {
          method: 'PUT',
          body: contact
        }
      )) as Product

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
    contact.selling_price = 0
    contact.name = ''
    contact.description = ''
    contact.cost_price = 0
    contact.selling_price = 0
    contact.stock_qty = 0
    contact.reorder_level = 0
    contact.barcode = ''
  }

  function resetError(): void {
    err.errors = {}
    err.message = ''
  }

  function formData() {
    return {
      id: null,
      name: '',
      description: '',
      cost_price: 0,
      selling_price: 0,
      stock_qty: 0,
      reorder_level: 0,
      reorder_level_danger: 0,
      barcode: ''
    }
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

  function errorHandler() {
    Object.assign(err, {
      errors: {},
      message: ''
    })
  }

  return {
    selectedIndex,
    form,
    formEdit,
    contact,
    selectedProduct,
    err,
    showDialog,
    isAdd,
    isEdit,
    list,
    loading,
    search,
    errorHandler,
    fetch,
    save,
    add,
    edit,
    update,
    removed
  }
})

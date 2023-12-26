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

  watchImmediate([() => isAdd.value, () => isEdit.value], ([add, edit]) => {
    console.log('add: ', add, ' edit: ', edit)

    if (add) Object.assign(contact, form)
    if (edit) Object.assign(contact, formEdit)
  })

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
        list.value?.push(product)
        showDialog.value = false
        reset()
        resetError()
      }
    } catch (error: any) {
      err = error?.data
    }

    loadingForm.value = false
  }

  async function update(): Promise<void> {
    loadingForm.value = true

    try {
      const product = (await $fetch<unknown>(
        `${useBackendUrl()}/api/products/${contact}`,
        {
          method: 'POST',
          body: contact
        }
      )) as Product

      if (product) {
        list.value?.push(product)
        showDialog.value = false
        reset()
        resetError()
      }
    } catch (error: any) {
      err = error?.data
    }

    loadingForm.value = false
  }

  function reset(): void {
    contact.selling_price = 0
    contact.name = ''
    contact.description = ''
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
      selling_price: 0,
      stock_qty: 0,
      reorder_level: 0,
      barcode: ''
    }
  }

  function add(): void {
    showDialog.value = true
    Object.assign(form, formData())
    isAdd.value = true
    isEdit.value = false
  }

  function edit(payload: any): void {
    selectedProduct.value = payload
    showDialog.value = true
    Object.assign(formEdit, payload)
    isAdd.value = false
    isEdit.value = true
  }

  return {
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
    fetch,
    save,
    add,
    edit,
    update
  }
})

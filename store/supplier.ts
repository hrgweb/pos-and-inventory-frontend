import { defineStore } from 'pinia'
import type { Pagination } from '@/types/pagination'
import type { Supplier } from '@/types/interface/supplier'
import { usePaginationStore } from '@/store/pagination'
import type { Errors } from '@/types/errors'

export const useSupplierStore = defineStore('supplier', () => {
  const list = ref<Supplier[] | null | undefined>([])
  const loading = ref(false)
  const loadingForm = ref(false)
  const search = ref('')
  const pagination = usePaginationStore()
  let form = reactive<Supplier>(formData())
  let formEdit = reactive<Supplier>(formData())
  let contact = reactive<Supplier>(formData())
  const showDialog = ref(false)
  let err: Errors = reactive({
    errors: {},
    message: ''
  })
  const isAdd = ref(false)
  const isEdit = ref(false)
  const selectedProduct = ref<Supplier | null>(null)
  const selectedIndex = ref(0)
  const removing = ref(false)

  async function fetch(): Promise<Pagination | undefined | null> {
    loading.value = true

    try {
      const paginate = (await $fetch<unknown>(
        `${useBackendUrl()}/api/suppliers`,
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
      const supplier = (await $fetch<unknown>(
        `${useBackendUrl()}/api/suppliers`,
        {
          method: 'POST',
          body: contact
        }
      )) as Supplier

      if (supplier) {
        list.value?.unshift(supplier)
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
        `${useBackendUrl()}/api/suppliers/${contact.id}`,
        {
          method: 'PUT',
          body: contact
        }
      )) as Supplier

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
        `${useBackendUrl()}/api/suppliers/${data?.id}`,
        { method: 'DELETE', body: { name: data?.name } }
      )) as Supplier

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
    contact.name = ''
    contact.description = ''
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
    fetch,
    save,
    add,
    edit,
    update,
    removed
  }
})

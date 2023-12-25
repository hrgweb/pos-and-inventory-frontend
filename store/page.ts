import { defineStore } from 'pinia'
import type { TransactionSession } from './../types/interface/transactionSession'
import type { Order } from './../types/interface/order'
import type { Supplier } from './../types/interface/supplier'

interface State {
  transactionSession: TransactionSession | null
  orders: Order[]
  suppliers: Supplier[]
}

export const usePageStore = defineStore('page', {
  state: (): State => {
    return {
      transactionSession: null,
      orders: [],
      suppliers: []
    }
  }
})

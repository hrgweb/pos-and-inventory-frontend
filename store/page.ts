import { defineStore } from 'pinia'
import type { TransactionSession } from './../types/interface/transactionSession'
import type { Order } from './../types/interface/order'
import type { Supplier } from './../types/interface/supplier'
import type { Pay } from './../types/interface/sale'

interface State {
  transactionSession: TransactionSession | null
  orders: Order[]
  suppliers: Supplier[]
  pay: Pay
}

export const usePageStore = defineStore('page', {
  state: (): State => {
    return {
      transactionSession: null,
      orders: [],
      suppliers: [],
      pay: {
        grandTotal: 0,
        amount: 0,
        change: 0
      }
    }
  }
})

import type { TransactionSession } from '@/types/interface/transactionSession'
import type { Order } from '@/types/interface/order'
import type { Supplier } from '@/types/interface/supplier'
import { usePageStore } from '@/store/page'

type Data = {
  transaction_session: TransactionSession
  orders: Order[]
  suppliers: Supplier[]
}

export default async function (): Promise<void> {
  const config = useRuntimeConfig()
  const page = usePageStore()

  try {
    const data = (await $fetch(`${config.public.backendUrl}/api/data`, {
      query: {
        transaction_session_no: localStorage.getItem('transaction_session_no')
      }
    })) as Data

    page.transactionSession = data?.transaction_session
    page.orders = data?.orders
    page.suppliers = data?.suppliers
    page.pay = {
      grandTotal: Number(page.transactionSession.grand_total),
      amount: Number(page.transactionSession.amount),
      change: Number(page.transactionSession.change)
    }
  } catch (error: any) {
    console.log(error?.data)
  }
}

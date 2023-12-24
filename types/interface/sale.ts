import { type Order } from '@/types/interface/order'

interface Sale {
  transaction_session_no: string
  orders: Order[]
}

type SaleResult = {
  success: boolean
  msg: string
}

export type { Sale, SaleResult }

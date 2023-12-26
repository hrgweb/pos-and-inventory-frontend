import { type Order } from '@/types/interface/order'

type Pay = {
  grandTotal: number
  amount: number
  change: number
}

interface Sale {
  transaction_session_no: string | undefined
  orders: Order[]
}

type SaleResult = {
  success: boolean
  msg: string
}

export type { Pay, Sale, SaleResult }

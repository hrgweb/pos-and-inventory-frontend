import { type Order } from '@/types/interface/order'

type Pay = {
  grandTotal: number
  amount: number
  change: number
}

interface Sale {
  transaction_session_no: string | undefined
  orders: Order[]
  grand_total: number
  amount: number
  change?: number
  product_count_occurences: any[]
}

type SaleResult = {
  success: boolean
  msg: string
}

export type { Pay, Sale, SaleResult }

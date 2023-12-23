import type { Product } from '@/types/interface/inventory'

enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed'
}

interface Order {
  id?: number
  transaction_session_no: string
  product: Product
  selling_price: number
  qty: number
  subtotal: number
  status: OrderStatus
  notes?: string
}

export { type Order, OrderStatus }

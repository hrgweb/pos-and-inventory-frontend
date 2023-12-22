import type { Product } from '@/types/interface/inventory'

enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed'
}

interface Order {
  id?: number
  product: Product
  status: OrderStatus
}

export { type Order, OrderStatus }

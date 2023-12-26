import { TransactionType } from '@/types/enum/transactionType'

interface Product {
  name: string
  description: string
  // category_id?: number
  // brand_id: number
  // supplier_id?: number
  // cost_price: number
  selling_price: number
  stock_qty: number
  reorder_level: number
  barcode: string
  is_available?: boolean
  created_at?: Date
}

interface Inventory {
  product: Product
  transaction_type: TransactionType
  qty: number
  cost_price: number
  selling_price: number
  subtotal: number
  notes: string
}

export type { Product, Inventory }

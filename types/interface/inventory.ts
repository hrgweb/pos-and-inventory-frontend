import { TransactionType } from '@/types/enum/transactionType'

interface Product {
  id?: number | null
  name: string
  description: string
  // category_id?: number
  // brand_id: number
  // supplier_id?: number
  cost_price: number
  selling_price: number
  stock_qty: number
  reorder_level: number
  reorder_level_danger?: number
  barcode: string
  is_available?: boolean
  created_at?: Date
  // [prop: string]: any
}

interface Inventory {
  id?: number | null
  product: Product
  transaction_type: TransactionType
  qty: number
  // cost_price: number
  // selling_price: number
  // subtotal: number
  notes: string
}

export type { Product, Inventory }

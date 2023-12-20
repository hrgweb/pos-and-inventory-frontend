import { TransactionType } from '@/types/enum/transactionType'

interface Product {
  name: string
  description: string
  // category_id: number
  // brand_id: number
  supplier_id: number
  cost_price: number
  selling_price: number
  stock_qty: number
  reorder_level: number
  barcode: string
  created_at?: Date
}

interface Inventory {
  transaction_type: TransactionType
  qty_change: number
  unit_cost: number
  total_cost: number
  notes: string
  product: Product
}

export type { Product, Inventory }

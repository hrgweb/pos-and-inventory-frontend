import type { Product } from '@/types/interface/inventory'

type Pagination = {
  data: Product[]
  meta: { total: number }
  links: []
}

export type { Pagination }

import type { Inventory } from '@/types/interface/inventory'

type Pagination = {
  data: Inventory[]
  meta: { total: number }
  links: []
}

export type { Pagination }

type Pagination<T = {}> = {
  data: T[] | undefined | null
  meta: { total: number }
  links: []
}

export type { Pagination }

import type { Order } from '@/types/interface/order'

function countOccurrences(orders: Order[]) {
  type Result = {
    id: number
    name: string
    count: number
    [prop: string]: any
  }

  const newObj = [] as Result[]

  for (let index = 0; index < orders.length; index++) {
    const product = orders[index].product
    const prevId =
      index === 0 ? 0 : (orders[index - 1].product.id as number | undefined)
    const currentId = orders[index].product.id

    if (index > 0 && prevId === currentId) {
      continue
    }

    const count = orders.filter(
      (order: Order) => order.product['id'] === currentId
    ).length

    newObj.push({
      id: Number(product['id']),
      name: product['name'],
      count: Number(count)
    })
  }

  return newObj
}

export const util = {
  countOccurrences
}

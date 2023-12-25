import type { TransactionSession } from '@/types/interface/transactionSession';
import type { Order } from '@/types/interface/order';
import type { Supplier } from '@/types/interface/supplier';

type Data = {
    transaction_session: TransactionSession
    orders: Order[]
    suppliers: Supplier[]
}

export default async function (): Promise<Data | undefined> {
    const config = useRuntimeConfig()

    try {
        return await $fetch(`${config.public.backendUrl}/api/data`, {
            query: { transaction_session_no: localStorage.getItem('transaction_session_no') }
        }) as Data
    } catch (error: any) {
        console.log(error.data)
    }
}
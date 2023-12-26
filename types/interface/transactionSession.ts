interface TransactionSession {
    session_no: string
    status: string
    grand_total?: number
    amount?: number
    change?: number
}

export type { TransactionSession }
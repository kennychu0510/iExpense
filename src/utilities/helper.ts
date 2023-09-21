export function parseAmount(amount: number) {
  return Number(amount.toFixed(2))
}

export function transactionMapToAmountArray(map: Map<string, Transaction>) {
  return Array.from(map, ([name, transaction]) => (transaction.amount))
}
export function parseAmount(amount: number) {
  return Number(amount.toFixed(2))
}

export function transactionMapToAmountArray(map: Map<string, Transaction>) {
  return Array.from(map, ([_, transaction]) => (transaction.amount))
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
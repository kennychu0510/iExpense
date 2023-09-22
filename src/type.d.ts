interface Transaction {
  amount: number;
  event?: string;
}

type CostSummary = {
  name: string;
  amountToPay: number;
}[];

interface IPerson {
  id: string;
  name: string;
  amountToPay: number;
  receiveActions: Map<string, Transaction>;
  payActions: Map<string, Transaction>;
  paid: number;
  getTotalToReceive: () => number;
  getTotalToPay: () => number;
  settled: boolean;
  updateSettlement: () => void;
}

type ExpenseSummary = {
  id: string;
  expenseName: string;
  summary: IPerson[];
  date: string;
};

type PeopleAction = {
  action: 'pay' | 'receive';
  amount: number;
  toPerson: string;
};

interface PeopleExpense {
  name: string;
  actions: PeopleAction[];
}
type ExpenseMap = PeopleExpense[];

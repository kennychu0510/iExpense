interface Transaction {
  amount: number;
  event?: string;
}

type CostSummary = {
  name: string;
  amountToPay: number;
}[];

type IAction = {
  name: string;
  amount: number
}

interface IPerson {
  id: string;
  name: string;
  amountToPay: number;
  receives: IAction[]
  payments: IAction[]
  paid: number;
  totalReceive: number;
  totalPay: number;
  settled: boolean;
}

type ExpenseSummary = {
  id: string;
  expenseName: string;
  summary: IPerson[];
  date: string;
  isArchived: boolean;
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

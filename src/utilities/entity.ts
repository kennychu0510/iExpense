import { parseAmount, transactionMapToAmountArray } from './helper';
import { v4 as uuidv4 } from 'uuid';

export class Person implements IPerson {
  private receiveActionsMap: Map<string, Transaction> = new Map();
  private payActionsMap: Map<string, Transaction> = new Map();
  public amountToPay: number = 0;
  public totalReceive = 0;
  public totalPay = 0;
  public id: string;
  public payments: IAction[] = [];
  public receives: IAction[] = [];

  constructor(public name: string, public readonly paid: number, public settled = false) {
    this.id = uuidv4();
  }

  addAmountToPay(amount: number) {
    this.amountToPay = amount - this.paid;
  }

  pay(amount: number, person: string) {
    let payAmount = amount;
    if (amount <= this.amountToPay) {
      payAmount = amount;
    } else {
      payAmount = this.amountToPay
    }
    this.payActionsMap.set(person, {
      amount: parseAmount(payAmount),
    });
    this.amountToPay -= payAmount;
    return payAmount;
  }

  receive(amount: number, person: string) {
    this.amountToPay += amount;
    this.receiveActionsMap.set(person, {
      amount: parseAmount(amount),
    });
  }

  getAmountToPay() {
    return Number(this.amountToPay.toFixed(2));
  }

  sumUp() {
    this.totalPay = transactionMapToAmountArray(this.payActionsMap).reduce((prev, cur) => prev + cur, 0);
    this.totalReceive = transactionMapToAmountArray(this.receiveActionsMap).reduce((prev, cur) => prev + cur, 0);
    this.receives = Array.from(this.receiveActionsMap, ([name, transaction]) => ({ name, amount: transaction.amount }));
    this.payments = Array.from(this.payActionsMap, ([name, transaction]) => ({ name, amount: transaction.amount }));
  }
}

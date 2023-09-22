import { parseAmount, transactionMapToAmountArray } from "./helper";

export class Person implements IPerson {
  public receiveActions: Map<string, Transaction> = new Map();
  public payActions: Map<string, Transaction> = new Map();
  public amountToPay: number = 0;

  constructor(public name: string, public readonly paid: number) {
    if (paid > 0) {
      this.amountToPay = -paid;
    }
  }

  addAmountToPay(amount: number) {
    this.amountToPay = amount;
  }

  pay(amount: number, person: string) {
    let payAmount = amount;
    if (this.amountToPay < amount) {
      payAmount = amount - this.amountToPay;
    }
    this.payActions.set(person, {
      amount: parseAmount(payAmount),
    });
    this.amountToPay -= payAmount;
    return payAmount;
  }

  receive(amount: number, person: string) {
    this.amountToPay += amount;
    this.receiveActions.set(person, {
      amount: parseAmount(amount),
    });
  }

  getAmountToPay() {
    return Number(this.amountToPay.toFixed(2))
  }

  getTotalToReceive() {
    return transactionMapToAmountArray(this.receiveActions).reduce((prev, cur) => prev + cur, 0)
  }

  getTotalToPay() {
    return transactionMapToAmountArray(this.payActions).reduce((prev, cur) => prev + cur, 0)
  }
}


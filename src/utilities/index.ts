import { Person } from './entity';

export function getTotalCost(people: Person[]) {
  return people.reduce((prev, cur) => {
    return prev + cur.paid;
  }, 0);
}

export function splitCost(people: Person[]): CostSummary {
  const peopleCount = people.length;
  const total = getTotalCost(people);
  const costPerPerson = total / peopleCount;
  return people.map((person) => ({
    name: person.name,
    amountToPay: getAmountToPayForPerson(costPerPerson, person.paid),
  }));
}

/* 
Positive = Receive
Negative = Pay
*/
export function getAmountToPayForPerson(costPerPerson: number, paidAmount: number) {
  if (paidAmount < costPerPerson) {
    return costPerPerson - paidAmount;
  } else {
    return (paidAmount - costPerPerson) * -1;
  }
}

export function calculateExpenseSplitSummary(people: Person[]) {
  const costPerPerson = getTotalCost(people) / people.length;
  for (const person of people) {
    person.addAmountToPay(costPerPerson);
  }
  const payers = people.filter((person) => person.amountToPay > 0);
  const receivers = people.filter((person) => person.amountToPay < 0);

  for (const receiver of receivers) {
    for (const payer of payers) {
      const amountToPay = (receiver.amountToPay * -1)
      const amountPaid = payer.pay(amountToPay, receiver.name);
      console.log({payer: payer.name, amount: amountPaid})
      if (amountPaid > 0) {
        receiver.receive(amountPaid, payer.name);
      }
    }
  }
  people.forEach((person) => person.sumUp());

  return people;
}

export function getCostPerPerson(people: Person[]): number {
  return people.reduce((prev, cur) => prev + cur.paid, 0)/people.length
}
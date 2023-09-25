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
    person.addAmountToPay(getAmountToPayForPerson(costPerPerson, person.paid));
  }
  const payers = people.filter((person) => person.amountToPay > 0);
  const receivers = people.filter((person) => person.amountToPay < 0);

  for (const receiver of receivers) {
    const costPerPayer = (receiver.amountToPay * -1) / payers.length;
    for (const payer of payers) {
      const amountPaid = payer.pay(costPerPayer, receiver.name);
      if (amountPaid > 0) {
        receiver.receive(amountPaid, payer.name);
      }
    }
  }
  people.forEach((person) => person.sumUp());

  return people;
}

import { describe, expect, test } from 'vitest';
import { calculateExpenseSplitSummary, splitCost } from '../';
import { Person } from '../entity';

describe('split cost function', () => {
  const people: Person[] = [new Person('john', 60), new Person('ben', 0), new Person('mark', 0)];
  test('returns an array', () => {
    expect(Array.isArray(splitCost(people))).toBeTruthy();
  });
  test('content is correct', () => {
    expect(splitCost(people)).toEqual([
      {
        name: 'john',
        amountToPay: -40,
      },
      {
        name: 'ben',
        amountToPay: 20,
      },
      {
        name: 'mark',
        amountToPay: 20,
      },
    ]);
  });
});

describe('scenario 3', () => {
  const people: Person[] = [new Person('john', 30), new Person('ben', 30), new Person('mark', 0)];

  test('amount is settled', () => {
    expect(calculateExpenseSplitSummary(people).every((person) => person.amountToPay === 0)).toBeTruthy();
  });

  test("john and ben don't need to pay", () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.payments).toEqual([]);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.payments).toEqual([]);
  });

  test('mark pays john and ben $10', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.payments).toEqual([
      { name: 'john', amount: 10 },
      { name: 'ben', amount: 10 },
    ]);
  });

  test('john and ben each receive $10 from mark', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.receives).toEqual([]);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.receives).toEqual([{ name: 'mark', amount: 10 }]);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.receives).toEqual([{ name: 'mark', amount: 10 }]);
  });
});

describe('Scenario 4', () => {
  const people: Person[] = [new Person('john', 30), new Person('ben', 0), new Person('mark', 0)];
  test('amount is settled', () => {
    expect(calculateExpenseSplitSummary(people).every((person) => person.amountToPay === 0)).toBeTruthy();
  });

  test('ben pays john $10', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.payments).toEqual([{ name: 'john', amount: 10 }]);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.receives).toEqual([]);
  });

  test('mark pays john $10', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.payments).toEqual([{ name: 'john', amount: 10 }]);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.receives).toEqual([]);
  });

  test('john receives $10 from ben and mark', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.receives).toEqual([
      { name: 'ben', amount: 10 },
      { name: 'mark', amount: 10 },
    ]);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.payments).toEqual([]);
  });
});

describe('Scenario 5', () => {
  const people: Person[] = [new Person('john', 10), new Person('ben', 0), new Person('mark', 0)];
  test('amount is settled', () => {
    expect(calculateExpenseSplitSummary(people).every((person) => Math.round(person.amountToPay) === 0)).toBeTruthy();
  });

  test('ben pays john $3.33', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.payments).toEqual([{ name: 'john', amount: 3.33 }]);
    // expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.receives).toBeEmpty()
  });

  test('mark pays john $3.33', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.payments).toEqual([{ name: 'john', amount: 3.33 }]);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.receives).toEqual([]);
  });

  test('john receives $6.66 from ben and mark', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.receives).toEqual([
      { name: 'ben', amount: 3.33 },
      { name: 'mark', amount: 3.33 },
    ]);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.payments).toEqual([]);
  });
});

describe('Scenario 6: Payers with different amount', () => {
  const people: Person[] = [new Person('john', 10), new Person('ben', 20), new Person('mark', 0)];
  test('amount is settled', () => {
    expect(calculateExpenseSplitSummary(people).every((person) => Math.round(person.amountToPay) === 0)).toBeTruthy();
  });

  test('john pays and receives $0', () => {
    const name = 'john';
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === name)?.payments).toEqual([]);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === name)?.receives).toEqual([]);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === name)?.totalPay).toBe(0);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === name)?.totalPay).toBe(0);
  });

  test('ben pays $0 and receives $10', () => {
    const name = 'ben';
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === name)?.payments).toEqual([]);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === name)?.totalReceive).toBe(10);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === name)?.totalPay).toBe(0);
  });

  test('mark pays $10 to ben', () => {
    const name = 'mark';
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === name)?.payments).toEqual([{ name: 'ben', amount: 10 }]);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === name)?.totalReceive).toBe(0);
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === name)?.totalPay).toBe(10);
  });
});

describe('Scenario 7: Payers with different amount', () => {
  const people: Person[] = [new Person('john', 500), new Person('ben', 20), new Person('mark', 0), new Person('dave', 0)];
  test('amount is settled', () => {
    expect(calculateExpenseSplitSummary(people).every((person) => Math.round(person.amountToPay) === 0)).toBeTruthy();
  });
  test('ben pays john $110', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.payments).toEqual([{name: 'john', amount: 110}])
  });
  test('dave pays john $130', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'dave')?.payments).toEqual([{name: 'john', amount: 130}])
  });
  test('mark pays john $130', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.payments).toEqual([{name: 'john', amount: 130}])
  });
  test('john receives total of $370', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.payments).toEqual([])
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.receives).toEqual([
      {name: 'ben', amount: 110},
      {name: 'mark', amount: 130},
      {name: 'dave', amount: 130},
    ])
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.totalReceive).toEqual(370)
  });
});
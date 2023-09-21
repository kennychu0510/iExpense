import { test, expect, describe } from 'bun:test';
import { transactionMapToAmountArray } from '../helper';

describe('transactionMapToAmountArray', () => {
  test('converts a map to an array', () => {
    const input = new Map([
      ['john', { amount: 20 }],
      ['ben', { amount: 10 }],
      ['mark', { amount: 50 }],
    ]);
    expect(transactionMapToAmountArray(input)).toBeArray();
  });

  test('array is correct', () => {
    const input = new Map([
      ['john', { amount: 20 }],
      ['ben', { amount: 10 }],
      ['mark', { amount: 50 }],
    ]);
    expect(transactionMapToAmountArray(input)).toEqual([20, 10, 50])
  });
});

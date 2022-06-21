const Fuzz = require('jest-fuzz');

import { Stack } from 'immutable';
import API from '../src/lib/rpn';
import Op from '../src/lib/rpn/operation';
import Internal from '../src/lib/rpn/internal';

// FUZZERS

const stackFuzzer = Fuzz.array({
  type: Fuzz.float({
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
  }),
});

// TESTS

describe('Reverse Polish Notation library', () => {
  describe('Parser', () => {
    // OPERATORS

    test('"+" parses as addition', () => {
      expect(Internal.parse('+')).toEqual(Stack.of(Op.Add));
    });

    test('"-" parses as subtraction', () => {
      expect(Internal.parse('-')).toEqual(Stack.of(Op.Subtract));
    });

    test('"*" parses as multiplication', () => {
      expect(Internal.parse('*')).toEqual(Stack.of(Op.Multiply));
    });

    test('"/" parses as division', () => {
      expect(Internal.parse('/')).toEqual(Stack.of(Op.Divide));
    });

    // NUMBERS

    test('NaN is not a parsable number', () => {
      expect(Internal.parse('NaN')).toBeNull();
    });

    test('Positive infinity is not a parsable number', () => {
      expect(Internal.parse('Infinity')).toBeNull();
    });

    test('Negative infinity is not a parsable number', () => {
      expect(Internal.parse('-Infinity')).toBeNull();
    });

    Fuzz.test(
      'Number parses correctly',
      Fuzz.float,
      (n: number) => {
        const stringyN = n.toString();

        if (Number.isFinite(n)) {
          expect(Internal.parse(stringyN)).toBe(n);
        }
        else {
          expect(Internal.parse(stringyN)).toBeNull();
        }
      },
    );
  });

  describe('Evaluator', () => {
    test('No operations on the initial model produces no changes', () => {
      // TODO: Stacks are converted, so they aren't the same reference yet
      const stack = Stack(API.initialModel);
      expect(Internal.evaluate(Stack(), stack)).toBe(stack);
    });

    Fuzz.test(
      'No operations on arbitrary stacks produces no changes',
      stackFuzzer,
      (arr: Array<number>) => {
        const stack = Stack(arr);
        expect(Internal.evaluate(Stack(), stack)).toBe(stack);
      },
    );

    Fuzz.test(
      'Push operation pushes a number on the stack',
      Fuzz.float(),
      (n: number) => {
        expect(Internal.evaluatePush(n, Stack(API.initialModel)).toArray())
          .toEqual([n, ...API.initialModel]);
      },
    );

    Fuzz.test(
      'Add operation pushes the sum of the top two numbers from the stack',
      Fuzz.float,
      (floatGenerator: () => number) => {
        const augend = floatGenerator();
        const addend = floatGenerator();
        const sum = augend + addend;

        let stack = Stack(API.initialModel);
        stack = Internal.evaluatePush(augend, stack);
        stack = Internal.evaluatePush(addend, stack);

        let newStack = Stack(API.initialModel);
        newStack = Internal.evaluatePush(sum, newStack);

        expect(Internal.evaluateAdd(stack)).toEqual(newStack);
      },
    );

    Fuzz.test(
      'Subtract operation pushes the difference of the top two numbers from the stack',
      Fuzz.float,
      (floatGenerator: () => number) => {
        const minuend = floatGenerator();
        const subtrahend = floatGenerator();
        const difference = minuend - subtrahend;

        let stack = Stack(API.initialModel);
        stack = Internal.evaluatePush(minuend, stack);
        stack = Internal.evaluatePush(subtrahend, stack);

        let newStack = Stack(API.initialModel);
        newStack = Internal.evaluatePush(difference, newStack);

        expect(Internal.evaluateSubtract(stack)).toEqual(newStack);
      },
    );

    Fuzz.test(
      'Multiply operation pushes the product of the top two numbers from the stack',
      Fuzz.float,
      (floatGenerator: () => number) => {
        const multiplier = floatGenerator();
        const multiplicand = floatGenerator();
        const product = multiplier * multiplicand;

        let stack = Stack(API.initialModel);
        stack = Internal.evaluatePush(multiplier, stack);
        stack = Internal.evaluatePush(multiplicand, stack);

        let newStack = Stack(API.initialModel);
        newStack = Internal.evaluatePush(product, newStack);

        expect(Internal.evaluateMultiply(stack)).toEqual(newStack);
      },
    );

    Fuzz.test(
      'Divide operation pushes the quotient of the top two numbers from the stack',
      Fuzz.float,
      (floatGenerator: () => number) => {
        const dividend = floatGenerator();
        const divisor = floatGenerator();
        const quotient = dividend / divisor;

        let stack = Stack(API.initialModel);
        stack = Internal.evaluatePush(dividend, stack);
        stack = Internal.evaluatePush(divisor, stack);

        let newStack = Stack(API.initialModel);
        newStack = Internal.evaluatePush(quotient, newStack);

        expect(Internal.evaluateDivide(stack)).toEqual(newStack);
      },
    );
  });
});

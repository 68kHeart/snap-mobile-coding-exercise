import { Stack } from 'immutable';
import Internal from '../src/lib/rpn/internal';

const Fuzz = require('jest-fuzz');

// TYPES

type StackArithmeticInput = {
  stack: Array<number>,
  lhs: number,
  rhs: number,
};

type StackPushInput = {
  stack: Array<number>,
  value: number,
};

// FUZZERS

// jest-fuzz's float fuzzer includes NaN and Infinity; we do not.
const floatFuzzer = Fuzz.float({
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
});

const stackFuzzer = Fuzz.array({
  type: floatFuzzer,
});

const stackArithmeticFuzzer = Fuzz.Fuzzer({
  stack: stackFuzzer,
  lhs: floatFuzzer,
  rhs: floatFuzzer,
});

const stackPushFuzzer = Fuzz.Fuzzer({
  stack: stackFuzzer,
  value: floatFuzzer,
});

// REFERENCE IMPLEMENTATIONS

function referenceEvaluateAdd(stack: Readonly<Array<number>>): Readonly<Array<number>> {
  const augend = stack[1] ?? 0;
  const addend = stack[0] ?? 0;

  return [augend + addend, ...stack.slice(2)];
}

function referenceEvaluateSubtract(stack: Readonly<Array<number>>): Readonly<Array<number>> {
  const minuend = stack[1] ?? 0;
  const subtrahend = stack[0] ?? 0;

  return [minuend - subtrahend, ...stack.slice(2)];
}

function referenceEvaluateMultiply(stack: Readonly<Array<number>>): Readonly<Array<number>> {
  const multiplier = stack[1] ?? 0;
  const multiplicand = stack[0] ?? 0;

  return [multiplier * multiplicand, ...stack.slice(2)];
}

function referenceEvaluateDivide(stack: Readonly<Array<number>>): Readonly<Array<number>> {
  const dividend = stack[1] ?? 0;
  const divisor = stack[0] ?? 0;

  // We could throw an error on division by zero, but just using zero is fine.
  if (divisor === 0) {
    return [0, ...stack.slice(2)];
  }
  else {
    return [dividend / divisor, ...stack.slice(2)];
  }
}

function referenceEvaluatePush(n: number, stack: Readonly<Array<number>>): Readonly<Array<number>> {
  return [n, ...stack];
}

// TESTS

describe('Migrations', () => {
  describe('Evaluator', () => {
    describe('evaluateAdd()', () => {
      Fuzz.test(
        'matches original implementation',
        stackArithmeticFuzzer(),
        ({ stack, lhs: augend, rhs: addend }: StackArithmeticInput) => {
          const input = Array.from(stack);
          input.unshift(augend);
          input.unshift(addend);

          expect(Internal.evaluateAdd(input))
            .toEqual(referenceEvaluateAdd(input));
        },
      );
    });

    describe('evaluateSubtract()', () => {
      Fuzz.test(
        'matches original implementation',
        stackArithmeticFuzzer(),
        ({ stack, lhs: minuend, rhs: subtrahend }: StackArithmeticInput) => {
          const input = Array.from(stack);
          input.unshift(minuend);
          input.unshift(subtrahend);

          expect(Internal.evaluateSubtract(input))
            .toEqual(referenceEvaluateSubtract(input));
        },
      );
    });

    describe('evaluateMultiply()', () => {
      Fuzz.test(
        'matches original implementation',
        stackArithmeticFuzzer(),
        ({ stack, lhs: multiplier, rhs: multiplicand }: StackArithmeticInput) => {
          const input = Array.from(stack);
          input.unshift(multiplier);
          input.unshift(multiplicand);

          expect(Internal.evaluateMultiply(input))
            .toEqual(referenceEvaluateMultiply(input));
        },
      );
    });

    describe('evaluateDivide()', () => {
      Fuzz.test(
        'matches original implementation',
        stackArithmeticFuzzer(),
        ({ stack, lhs: dividend, rhs: divisor }: StackArithmeticInput) => {
          const input = Array.from(stack);
          input.unshift(dividend);
          input.unshift(divisor);

          expect(Internal.evaluateDivide(input))
            .toEqual(referenceEvaluateDivide(input));
        },
      );
    });

    describe('evaluatePush()', () => {
      Fuzz.test(
        'matches original implementation',
        stackPushFuzzer(),
        ({ stack, value }: StackPushInput) => {
          const input = Array.from(stack);
          input.unshift(value);

          expect(Internal.evaluatePush(value, input))
            .toEqual(referenceEvaluatePush(value, input));
        },
      );
    });
  });
});

import { Stack } from 'immutable';
import API from '../src/lib/rpn';
import Op from '../src/lib/rpn/operation';
import Internal from '../src/lib/rpn/internal';
import { Fuzzer, fuzz, fuzz2, fuzz3 } from './jest-fuzzer';

// FUZZERS

const stackFuzzer = Fuzzer.array(Fuzzer.float).map(Stack);

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

    fuzz(Fuzzer.float, 'reads random numbers correctly', (n: number) => {
      expect(Internal.parse(n.toString()))
        .toEqual(Stack.of(Op.Push(n)));
    });
  });

  describe('Evaluator', () => {
    test('No operations on the initial model produces no changes', () => {
      // TODO: Stacks are converted, so they aren't the same reference yet
      const stack = Stack(API.initialModel);
      expect(Internal.evaluate(Stack(), stack)).toBe(stack);
    });

    fuzz(
      stackFuzzer,
      'returns same random stack if no operations are performed',
      (stack) => {
        expect(Internal.evaluate(Stack(), stack))
          .toBe(stack);
      },
    );

    fuzz2(
      stackFuzzer,
      Fuzzer.float,
      'pushes a number on the stack when a Push is received',
      (stack, n) => {
        expect(Internal.evaluatePush(n, stack).toArray())
          .toEqual([n, ...stack]);
      },
    );

    fuzz3(
      stackFuzzer,
      Fuzzer.float,
      Fuzzer.float,
      'replaces the top two numbers with their sum on an Add operation',
      (stack, augend, addend) => {
        const sum = augend + addend;

        let expectedStack = stack;
        expectedStack = Internal.evaluatePush(sum, expectedStack);

        let actualStack = stack;
        actualStack = Internal.evaluatePush(augend, actualStack);
        actualStack = Internal.evaluatePush(addend, actualStack);
        actualStack = Internal.evaluateAdd(actualStack);

        expect(actualStack).toEqual(expectedStack);
      },
    );

    fuzz3(
      stackFuzzer,
      Fuzzer.float,
      Fuzzer.float,
      'replaces the top two numbers with their difference on a Subtract operation',
      (stack, minuend, subtrahend) => {
        const difference = minuend - subtrahend;

        let expectedStack = stack;
        expectedStack = Internal.evaluatePush(difference, expectedStack);

        let actualStack = stack;
        actualStack = Internal.evaluatePush(minuend, actualStack);
        actualStack = Internal.evaluatePush(subtrahend, actualStack);
        actualStack = Internal.evaluateSubtract(actualStack);

        expect(actualStack).toEqual(expectedStack);
      },
    );

    fuzz3(
      stackFuzzer,
      Fuzzer.float,
      Fuzzer.float,
      'replaces the top two numbers with their product on a Multiply operation',
      (stack, multiplier, multiplicand) => {
        const product = multiplier * multiplicand;

        let expectedStack = stack;
        expectedStack = Internal.evaluatePush(product, expectedStack);

        let actualStack = stack;
        actualStack = Internal.evaluatePush(multiplier, actualStack);
        actualStack = Internal.evaluatePush(multiplicand, actualStack);
        actualStack = Internal.evaluateMultiply(actualStack);

        expect(actualStack).toEqual(expectedStack);
      },
    );

    fuzz3(
      stackFuzzer,
      Fuzzer.float,
      Fuzzer.float,
      'replaces the top two numbers with their quotient on a Divide operation',
      (stack, dividend, divisor) => {
        const quotient = divisor === 0
          ? 0
          : dividend / divisor;

        let expectedStack = stack;
        expectedStack = Internal.evaluatePush(quotient, expectedStack);

        let actualStack = stack;
        actualStack = Internal.evaluatePush(dividend, actualStack);
        actualStack = Internal.evaluatePush(divisor, actualStack);
        actualStack = Internal.evaluateDivide(actualStack);

        expect(actualStack).toEqual(expectedStack);
      },
    );
  });
});

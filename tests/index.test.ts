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

    describe('Inferred tests from coding exercise', () => {
      test('"-3" parses as the number -3.0', () => {
        expect(Internal.parse('-3')).toEqual(Stack.of(Op.Push(-3.0)));
      });

      test('"-2" parses as the number -2.0', () => {
        expect(Internal.parse('-2')).toEqual(Stack.of(Op.Push(-2.0)));
      });

      test('"1" parses as the number 1', () => {
        expect(Internal.parse('1')).toEqual(Stack.of(Op.Push(1)));
      });

      test('"5" parses as the number 5', () => {
        expect(Internal.parse('5')).toEqual(Stack.of(Op.Push(5)));
      });

      test('"8" parses as the number 8', () => {
        expect(Internal.parse('8')).toEqual(Stack.of(Op.Push(8)));
      });

      test('"9" parses as the number 9', () => {
        expect(Internal.parse('9')).toEqual(Stack.of(Op.Push(9)));
      });
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

  describe('Tests inferred from exercise document', () => {
    describe('Example Input/Output #1', () => {
      let steps = [
        API.initialModel,

        // > 5
        API.initialModel.push(5),

        // > 8
        API.initialModel.push(8, 5),

        // > +
        API.initialModel.push(5 + 8),
      ];

      test('Via evaluations', () => {
        let stack = steps[0];

        stack = Internal.evaluatePush(5, stack);
        expect(stack).toEqual(steps[1]);

        stack = Internal.evaluatePush(8, stack);
        expect(stack).toEqual(steps[2]);

        stack = Internal.evaluateAdd(stack);
        expect(stack).toEqual(steps[3]);
      });

      test('Via parsing', () => {
        let stack = steps[0];

        stack = API.update('5', stack);
        expect(stack).toEqual(steps[1]);

        stack = API.update('8', stack);
        expect(stack).toEqual(steps[2]);

        stack = API.update('+', stack);
        expect(stack).toEqual(steps[3]);
      });
    });

    describe('Example Input/Output #2', () => {
      let steps = [
        API.initialModel,

        // > 5 5 5 8 + + -
        API.initialModel.push(5 - (5 + (5 + 8))),

        // > 13 +
        API.initialModel.push((5 - (5 + (5 + 8))) + 13),
      ];

      test('Via evaluations', () => {
        let stack = steps[0];

        stack = Internal.evaluatePush(5, stack);
        stack = Internal.evaluatePush(5, stack);
        stack = Internal.evaluatePush(5, stack);
        stack = Internal.evaluatePush(8, stack);
        stack = Internal.evaluateAdd(stack);
        stack = Internal.evaluateAdd(stack);
        stack = Internal.evaluateSubtract(stack);
        expect(stack).toEqual(steps[1]);

        stack = Internal.evaluatePush(13, stack);
        stack = Internal.evaluateAdd(stack);
        expect(stack).toEqual(steps[2]);
      });

      test('Via parsing', () => {
        let stack = steps[0];

        stack = API.update('5 5 5 8 + + -', stack);
        expect(stack).toEqual(steps[1]);

        stack = API.update('13 +', stack);
        expect(stack).toEqual(steps[2]);
      });
    });

    describe('Example Input/Output #3', () => {
      let steps = [
        API.initialModel,

        // > -3
        API.initialModel.push(-3.0),

        // > -2
        API.initialModel.push(-2.0, -3.0),

        // > *
        API.initialModel.push(-3.0 * -2.0),

        // > 5
        API.initialModel.push(5.0, -3.0 * -2.0),

        // > +
        API.initialModel.push((-3.0 * -2.0) + 5.0),
      ];

      test('Via evaluations', () => {
        let stack = steps[0];

        stack = Internal.evaluatePush(-3, stack);
        expect(stack).toEqual(steps[1]);

        stack = Internal.evaluatePush(-2, stack);
        expect(stack).toEqual(steps[2]);

        stack = Internal.evaluateMultiply(stack);
        expect(stack).toEqual(steps[3]);

        stack = Internal.evaluatePush(5, stack);
        expect(stack).toEqual(steps[4]);

        stack = Internal.evaluateAdd(stack);
        expect(stack).toEqual(steps[5]);
      });

      test('Via parsing', () => {
        let stack = steps[0];

        stack = API.update('-3', stack);
        expect(stack).toEqual(steps[1]);

        stack = API.update('-2', stack);
        expect(stack).toEqual(steps[2]);

        stack = API.update('*', stack);
        expect(stack).toEqual(steps[3]);

        stack = API.update('5', stack);
        expect(stack).toEqual(steps[4]);

        stack = API.update('+', stack);
        expect(stack).toEqual(steps[5]);
      });
    });

    describe('Example Input/Output #4', () => {
      let steps = [
        API.initialModel,

        // > 5
        API.initialModel.push(5),

        // > 9
        API.initialModel.push(9, 5),

        // > 1
        API.initialModel.push(1, 9, 5),

        // > -
        API.initialModel.push(9 - 1, 5),

        // > /
        API.initialModel.push(5 / (9 - 1)),
      ];

      test('Via evaluations', () => {
        let stack = steps[0];

        stack = Internal.evaluatePush(5, stack);
        expect(stack).toEqual(steps[1]);

        stack = Internal.evaluatePush(9, stack);
        expect(stack).toEqual(steps[2]);

        stack = Internal.evaluatePush(1, stack);
        expect(stack).toEqual(steps[3]);

        stack = Internal.evaluateSubtract(stack);
        expect(stack).toEqual(steps[4]);

        stack = Internal.evaluateDivide(stack);
        expect(stack).toEqual(steps[5]);
      });

      test('Via parsing', () => {
        let stack = steps[0];

        stack = API.update('5', stack);
        expect(stack).toEqual(steps[1]);

        stack = API.update('9', stack);
        expect(stack).toEqual(steps[2]);

        stack = API.update('1', stack);
        expect(stack).toEqual(steps[3]);

        stack = API.update('-', stack);
        expect(stack).toEqual(steps[4]);

        stack = API.update('/', stack);
        expect(stack).toEqual(steps[5]);
      });
    });
  });
});

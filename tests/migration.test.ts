import { Stack } from 'immutable';
import Op, { type Operation } from '../src/lib/rpn/operation';
import Internal from '../src/lib/rpn/internal';
import { Fuzzer, fuzz } from './jest-fuzzer';

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

type EvaluatorInput = {
  operations: Array<Operation>,
  stack: Array<number>,
};

// FUZZERS

// jest-fuzz's float fuzzer includes NaN and Infinity; we do not.
const floatFuzzer = Fuzz.float({
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
});

const operationFuzzer = Fuzz.Fuzzer(() => {
  const kindFuzzer = Fuzz.int({ min: 1, max: 5 });
  switch (kindFuzzer()) {
    case 1:
      return Op.Add;

    case 2:
      return Op.Subtract;

    case 3:
      return Op.Multiply;

    case 4:
      return Op.Divide;

    case 5:
      return Op.Push(floatFuzzer());
  }
})

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

const evaluatorFuzzer = Fuzz.Fuzzer({
  operations: Fuzz.array({
    type: operationFuzzer,
    minLength: 1,
  }),
  stack: stackFuzzer,
});

// PARSER FUZZERS

const symbolFuzzer = Fuzzer.intRange(1, 5).map((kind) => {
  switch (kind) {
    case 1: return '+';
    case 2: return '-';
    case 3: return '*';
    case 4: return '/';
    case 5: return Fuzzer.float.generate().toString();
    default: throw('Impossible state');
  }
});

const parsableStringFuzzer = Fuzzer.map2(
  Fuzzer.array(symbolFuzzer),
  Fuzzer.intRange(1, 20).map((n) => ' '.repeat(n)),
  (array, padding) => array
    .map((symbol) => padding + symbol + padding)
    .join(''),
);

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

function referenceEvaluate(
  operations: Readonly<Array<Operation>>,
  stack: Readonly<Array<number>>,
): Readonly<Array<number>> {
  return operations.reduce((newStack, op) => {
    switch (op.kind) {
      case 'Op/Add':
        return referenceEvaluateAdd(newStack);

      case 'Op/Subtract':
        return referenceEvaluateSubtract(newStack);

      case 'Op/Multiply':
        return referenceEvaluateMultiply(newStack);

      case 'Op/Divide':
        return referenceEvaluateDivide(newStack);

      case 'Op/Push':
        return referenceEvaluatePush(op.value, newStack);

      // An impossible state, but the style checker demands it. :(
      default:
        return newStack;
    }
  }, stack);
}

// PARSER

function referenceParseSymbol(input: string): Operation | null {
  switch (input) {
    case '+':
      return Op.Add;

    case '-':
      return Op.Subtract;

    case '*':
      return Op.Multiply;

    case '/':
      return Op.Divide;

    default:
      // inlined `validNumberRegex`
      if (/^-?(\d+|\d*\.\d+)$/.test(input)) {
        return Op.Push(parseFloat(input));
      }
      else {
        return null;
      }
  }
}

function referenceParse(input: string): Array<Operation> | null {
  const operations = input.split(' ')
    .filter((s) => s !== '')
    .map(referenceParseSymbol);

  if (operations.includes(null)) {
    return null;
  }
  else {
    // We have to unsafely assert the type of `result`. :(
    return operations as Array<Operation>;
  }
}

// HELPERS

// Transform Stacks into arrays for testing against reference versions.
function migrated<A>(value: Stack<A> | null): Array<A> | null {
  return value?.toArray() ?? null;
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

          expect(Internal.evaluateAdd(Stack(input)).toArray())
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

          expect(Internal.evaluateSubtract(Stack(input)).toArray())
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

          expect(Internal.evaluateMultiply(Stack(input)).toArray())
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

          expect(Internal.evaluateDivide(Stack(input)).toArray())
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

          expect(Internal.evaluatePush(value, Stack(input)).toArray())
            .toEqual(referenceEvaluatePush(value, input));
        },
      );
    });

    describe('evaluate()', () => {
      Fuzz.test(
        'matches original implementation',
        evaluatorFuzzer(),
        ({ operations, stack: arr }: EvaluatorInput) => {
          const stack = Stack(arr);
          const ops = Stack(operations);

          expect(migrated(Internal.evaluate(ops, stack)))
            .toEqual(referenceEvaluate(operations, stack.toArray()));
        },
      );

      Fuzz.test(
        'matches original implementation when given no operations',
        stackFuzzer,
        (arr: Array<number>) => {
          const stack = Stack(arr);
          expect(Internal.evaluate(Stack(), stack).toArray())
            .toEqual(referenceEvaluate([], stack.toArray())); 
        },
      );
    });
  });

  describe('Parser', () => {
    test('matches original implementation when given empty input', () => {
      expect(migrated(Internal.parse('')))
        .toEqual(referenceParse(''));
    });

    fuzz(
      parsableStringFuzzer,
      'matches original implementation with parsable strings',
      (symbols: string) => {
        expect(migrated(Internal.parse(symbols)))
          .toEqual(referenceParse(symbols));
      },
    );

    fuzz(
      Fuzzer.string,
      'matches original implementation with random strings',
      (s) => {
        expect(migrated(Internal.parse(s)))
          .toEqual(referenceParse(s));
      },
    );
  })
});

import Op, { type Operation } from './operation';

// TYPE ALIASES

type Stack = Readonly<Array<number>>;

// CONSTANTS

/*
 * Breakdown of the `validNumberRegex` pattern:
 *
 *   ^ -?
 *     Number may have a negative sign.
 *
 *   ( \d+ | \d* \. \d+ )
 *     Matches one of two cases:
 *       1. The number is a whole number. One or more digits.
 *       2. The number is a fractional decimal. It may start with zero or more
 *          digits; the leading zero is implied if it does not have any leading
 *          digits. Next is the decimal point, then one or more digits following
 *          that.
 *
 *   $
 *     Ensure there's no remaining characters after the number. Otherwise this
 *     would just match `parseFloat()`'s behavior!
 *
 * Since `parseFloat()` will still successfully parse a number even if it has
 * invalid characters in it, we have to do a check to make sure it's actually
 * valid. `parseFloat()` will parse up to the first invalid character, e.g.,
 * `0.2f2` will parse as `0.2`, even though the input is not a number.
 */
const validNumberRegex = /^-?(\d+|\d*\.\d+)$/;

// PARSER

function parseSymbol(input: string): Operation | null {
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
      if (validNumberRegex.test(input)) {
        return Op.Push(parseFloat(input));
      }
      else {
        return null;
      }
  }
}

function parse(input: string): Array<Operation> | null {
  const operations = input.split(' ')
    .filter((s) => s !== '')
    .map(parseSymbol);

  if (operations.includes(null)) {
    return null;
  }
  else {
    // We have to unsafely assert the type of `result`. :(
    return operations as Array<Operation>;
  }
}

// EVALUATOR

function evaluateAdd(stack: Stack): Stack {
  const augend = stack[1] ?? 0;
  const addend = stack[0] ?? 0;

  return [augend + addend, ...stack.slice(2)];
}

function evaluateSubtract(stack: Stack): Stack {
  const minuend = stack[1] ?? 0;
  const subtrahend = stack[0] ?? 0;

  return [minuend - subtrahend, ...stack.slice(2)];
}

function evaluateMultiply(stack: Stack): Stack {
  const multiplier = stack[1] ?? 0;
  const multiplicand = stack[0] ?? 0;

  return [multiplier * multiplicand, ...stack.slice(2)];
}

function evaluateDivide(stack: Stack): Stack {
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

function evaluatePush(n: number, stack: Stack): Stack {
  return [n, ...stack];
}

function evaluate(operations: Readonly<Array<Operation>>, stack: Stack): Stack {
  return operations.reduce((newStack, op) => {
    switch (op.kind) {
      case 'Op/Add':
        return evaluateAdd(newStack);

      case 'Op/Subtract':
        return evaluateSubtract(newStack);

      case 'Op/Multiply':
        return evaluateMultiply(newStack);

      case 'Op/Divide':
        return evaluateDivide(newStack);

      case 'Op/Push':
        return evaluatePush(op.value, newStack);

      // An impossible state, but the style checker demands it. :(
      default:
        return newStack;
    }
  }, stack);
}

// EXPORTS

export default {
  evaluate,
  evaluateAdd,
  evaluateDivide,
  evaluateMultiply,
  evaluatePush,
  evaluateSubtract,
  parse,
  parseSymbol,
};

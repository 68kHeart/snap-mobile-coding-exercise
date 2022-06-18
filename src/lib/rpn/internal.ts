import { Stack } from 'immutable';
import Op, { type Operation } from './operation';

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

function evaluateAdd(stack: Stack<number>): Stack<number> {
  const [addend = 0, augend = 0] = stack.take(2);

  return stack.skip(2).push(augend + addend);
}

function evaluateSubtract(stack: Stack<number>): Stack<number> {
  const [subtrahend = 0, minuend = 0] = stack.take(2);

  return stack.skip(2).push(minuend - subtrahend);
}

function evaluateMultiply(stack: Stack<number>): Stack<number> {
  const [multiplicand = 0, multiplier = 0] = stack.take(2);

  return stack.skip(2).push(multiplier * multiplicand);
}

function evaluateDivide(stack: Stack<number>): Stack<number> {
  const [divisor = 0, dividend = 0] = stack.take(2);

  // We could throw an error on division by zero, but just using zero is fine.
  if (divisor === 0) {
    return stack.skip(2).push(0);
  }
  else {
    return stack.skip(2).push(dividend / divisor);
  }
}

function evaluatePush(n: number, stack: Stack<number>): Stack<number> {
  return stack.push(n);
}

function evaluate(
  operations: Readonly<Array<Operation>>,
  stack: Stack<number>,
): Stack<number> {
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
  }, Stack(stack));
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

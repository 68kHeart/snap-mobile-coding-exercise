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

function parse(input: string): Operation | null {
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

// EXPORTS

export default {
  parse,
};

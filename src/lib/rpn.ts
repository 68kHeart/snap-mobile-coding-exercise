import Internal from './rpn/internal';
import { type Operation } from './rpn/operation';

// EVALUATOR

function evaluate(input: string): Readonly<Array<Operation>> | null {
  const parts = input.split(' ').filter((s) => s !== '');
  const result = parts.map(Internal.parse);

  if (result.includes(null)) {
    return null;
  }
  else {
    // We have to unsafely assert the type of `result`.
    return Object.freeze(result as Array<Operation>);
  }
}

// EXPORTS

export default {
  evaluate,
};

import Internal from './rpn/internal';

// EVALUATOR

function evaluate(input: string): Readonly<Array<number>> | null {
  const parts = input.split(' ').filter((s) => s !== '');
  const result = parts.map(Internal.parse);

  if (result.includes(null)) {
    return null;
  }
  else {
    // We have to unsafely assert the type of `result`.
    return Object.freeze(result as Array<number>);
  }
}

// EXPORTS

export default {
  evaluate,
};

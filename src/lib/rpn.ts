import { Stack } from 'immutable';
import Internal from './rpn/internal';

// MODEL

const initialModel = Object.freeze([0]);

// UPDATE

function update(input: string, stack: Readonly<Array<number>>): Readonly<Array<number>> {
  const maybeOperations = Internal.parse(input);

  if (maybeOperations === null) {
    return stack;
  }
  else {
    return Object.freeze(Internal.evaluate(maybeOperations, Stack(stack)).toArray());
  }
}

// EXPORTS

export default {
  initialModel,
  update,
};

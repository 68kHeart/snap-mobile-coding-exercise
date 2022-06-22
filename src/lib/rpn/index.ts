import { Stack } from 'immutable';
import Internal from './internal';

// MODEL

const initialModel = Stack.of(0);

// UPDATE

function update(input: string, stack: Stack<number>): Stack<number> {
  const maybeOperations = Internal.parse(input);

  if (maybeOperations === null) {
    return stack;
  }
  else {
    return Internal.evaluate(maybeOperations, stack);
  }
}

// EXPORTS

export default {
  initialModel,
  update,
};

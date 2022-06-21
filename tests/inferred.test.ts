import { Stack } from 'immutable';
import API from '../src/lib/rpn';
import Op from '../src/lib/rpn/operation';
import Internal from '../src/lib/rpn/internal';

// TESTS

describe('Inferred tests from coding exercise', () => {
  describe('Parser', () => {
    test('interprets "-3" as the number -3.0', () => {
      expect(Internal.parse('-3'))
        .toEqual(Stack.of(Op.Push(-3.0)));
    });

    test('interprets "-2" as the number -2.0', () => {
      expect(Internal.parse('-2'))
        .toEqual(Stack.of(Op.Push(-2.0)));
    });

    test('interprets "1" as the number 1', () => {
      expect(Internal.parse('1'))
        .toEqual(Stack.of(Op.Push(1)));
    });

    test('interprets "5" as the number 5', () => {
      expect(Internal.parse('5'))
        .toEqual(Stack.of(Op.Push(5)));
    });

    test('interprets "8" as the number 8', () => {
      expect(Internal.parse('8'))
        .toEqual(Stack.of(Op.Push(8)));
    });

    test('interprets "9" as the number 9', () => {
      expect(Internal.parse('9'))
        .toEqual(Stack.of(Op.Push(9)));
    });
  });

  describe('Examples', () => {
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

      test('works using the parser', () => {
        let stack = steps[0];

        stack = API.update('5', stack);
        expect(stack).toEqual(steps[1]);

        stack = API.update('8', stack);
        expect(stack).toEqual(steps[2]);

        stack = API.update('+', stack);
        expect(stack).toEqual(steps[3]);
      });

      test('works using direct evaluator manipulation', () => {
        let stack = steps[0];

        stack = Internal.evaluatePush(5, stack);
        expect(stack).toEqual(steps[1]);

        stack = Internal.evaluatePush(8, stack);
        expect(stack).toEqual(steps[2]);

        stack = Internal.evaluateAdd(stack);
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

      test('works using the parser', () => {
        let stack = steps[0];

        stack = API.update('5 5 5 8 + + -', stack);
        expect(stack).toEqual(steps[1]);

        stack = API.update('13 +', stack);
        expect(stack).toEqual(steps[2]);
      });

      test('works using direct evaluator manipulation', () => {
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

      test('works using the parser', () => {
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

      test('works using direct evaluator manipulation', () => {
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

      test('works using the parser', () => {
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

      test('works using direct evaluator manipulation', () => {
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
    });
  });
});

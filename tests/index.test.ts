import RPN from '../src/lib/rpn';

// TESTS

describe('Reverse Polish Notation library', () => {
  describe('Evaluator', () => {
    test('Empty string produces no commands', () => {
      expect(RPN.evaluate('')).toEqual([]);
    });
  });
});

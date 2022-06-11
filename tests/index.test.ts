const Fuzz = require('jest-fuzz');

import API from '../src/lib/rpn';
import Op from '../src/lib/rpn/operation';
import Internal from '../src/lib/rpn/internal';

// TESTS

describe('Reverse Polish Notation library', () => {
  describe('Parser', () => {
    // OPERATORS

    test('"+" parses as addition', () => {
      expect(Internal.parse('+')).toEqual(Op.Add);
    });

    test('"-" parses as subtraction', () => {
      expect(Internal.parse('-')).toEqual(Op.Subtract);
    });

    test('"*" parses as multiplication', () => {
      expect(Internal.parse('*')).toEqual(Op.Multiply);
    });

    test('"/" parses as division', () => {
      expect(Internal.parse('/')).toEqual(Op.Divide);
    });

    // NUMBERS

    test('NaN is not a parsable number', () => {
      expect(Internal.parse('NaN')).toBeNull();
    });

    test('Positive infinity is not a parsable number', () => {
      expect(Internal.parse('Infinity')).toBeNull();
    });

    test('Negative infinity is not a parsable number', () => {
      expect(Internal.parse('-Infinity')).toBeNull();
    });

    describe('Inferred tests from coding exercise', () => {
      test('"-3" parses as the number -3.0', () => {
        expect(Internal.parse('-3')).toEqual(Op.Push(-3.0));
      });

      test('"-2" parses as the number -2.0', () => {
        expect(Internal.parse('-2')).toEqual(Op.Push(-2.0));
      });

      test('"1" parses as the number 1', () => {
        expect(Internal.parse('1')).toEqual(Op.Push(1));
      });

      test('"5" parses as the number 5', () => {
        expect(Internal.parse('5')).toEqual(Op.Push(5));
      });

      test('"8" parses as the number 8', () => {
        expect(Internal.parse('8')).toEqual(Op.Push(8));
      });

      test('"9" parses as the number 9', () => {
        expect(Internal.parse('9')).toEqual(Op.Push(9));
      });
    });

    Fuzz.test(
      'Number parses correctly',
      Fuzz.float,
      (n: number) => {
        const stringyN = n.toString();

        if (Number.isFinite(n)) {
          expect(Internal.parse(stringyN)).toBe(n);
        }
        else {
          expect(Internal.parse(stringyN)).toBeNull();
        }
      },
    );
  });

  describe('Evaluator', () => {
    test('Empty string produces no commands', () => {
      expect(API.evaluate('')).toEqual([]);
    });

    Fuzz.test(
      'Single number produces same result as parser',
      Fuzz.float,
      (n: number) => {
        const stringyN = n.toString();

        expect(API.evaluate(stringyN)).toBe(Internal.parse(stringyN));
      },
    );
  });
});

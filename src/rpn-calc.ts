#!/usr/bin/env node

import Readline from 'node:readline';
import RPN from './lib/rpn';

// Initialize data model

let stack = RPN.initialModel;

// Initialize the REPL interface

const repl = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

// Transform possibly messy numbers into nice strings for the REPL

const DECIMAL_PLACES = 2;
const DECIMAL_SHIFT_FACTOR = 10 ** DECIMAL_PLACES;

function toPrettyPrintNumber(n: number): string {
  const shiftedN = n * DECIMAL_SHIFT_FACTOR;
  const remainder = shiftedN % 1;

  if (remainder === 0) {
    return n.toString();
  }
  else {
    const digits = Math.round(shiftedN).toString();
    const whole = digits.slice(0, -DECIMAL_PLACES);
    const fraction = digits.slice(-DECIMAL_PLACES).replace(/0+$/, '');

    const printedWhole = whole !== ''
      ? whole
      : '0';

    const printedFraction = fraction !== ''
      ? `.${fraction}`
      : '';

    return `${printedWhole}${printedFraction}`;
  }
}

// Process input as we get it, line by line

repl.on('line', (commands: string) => {
  if (commands === 'q') {
    repl.close();
  }

  const newStack = RPN.update(commands, stack);

  if (stack === newStack) {
    console.error('Invalid input');
  }
  else {
    stack = newStack;
    console.log(toPrettyPrintNumber(stack.first() ?? 0));
  }

  repl.prompt();
});

// Give a nice little send off :)

repl.on('close', () => {
  console.log('\nHave a nice day!');
  process.exit(0);
});

// Kick off the REPL

repl.prompt();

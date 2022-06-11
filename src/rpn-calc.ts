#!/usr/bin/env node

import Readline from 'node:readline';
import RPN from './lib/rpn';

// Initialize the REPL interface

const repl = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

// Process input as we get it, line by line

repl.on('line', (commands: string) => {
  const ops = RPN.evaluate(commands);

  if (ops === null) {
    console.error('Invalid input');
  }
  else {
    const output = ops.map((op) => {
      switch (op.kind) {
        case 'Op/Add':
          return '+';

        case 'Op/Subtract':
          return '-';

        case 'Op/Multiply':
          return '*';

        case 'Op/Divide':
          return '/';

        case 'Op/Push':
          return op.value.toString();

        // Impossible state, but the style checker demands it. :(
        default:
          return '';
      }
    });

    console.log(output);
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

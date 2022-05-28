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
  const output = RPN.evaluate(commands);
  console.log('[', output.join(', '), ']');
  repl.prompt();
});

// Give a nice little send off :)

repl.on('close', () => {
  console.log('\nHave a nice day!');
  process.exit(0);
});

// Kick off the REPL

repl.prompt();

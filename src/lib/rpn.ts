function evaluate(input: string): Readonly<Array<string>> {
  const parts = input.split(' ').filter((s) => s !== '');
  return Object.freeze(parts);
}

// EXPORTS

export default {
  evaluate,
};

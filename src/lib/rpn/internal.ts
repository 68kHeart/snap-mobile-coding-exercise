// PARSER

function parse(input: string): number | null {
  const maybeN = parseFloat(input);

  if (Number.isFinite(maybeN)) {
    return maybeN;
  }
  else {
    return null;
  }
}

// EXPORTS

export default {
  parse,
};

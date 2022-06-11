// TYPES

interface AddOp {
  kind: 'Op/Add',
}

interface SubtractOp {
  kind: 'Op/Subtract',
}

interface MultiplyOp {
  kind: 'Op/Multiply',
}

interface DivideOp {
  kind: 'Op/Divide',
}

interface PushOp {
  kind: 'Op/Push',
  value: number,
}

export type Operation = AddOp | SubtractOp | MultiplyOp | DivideOp | PushOp;

// CONSTRUCTORS

const Add = Object.freeze({
  kind: 'Op/Add',
});

const Subtract = Object.freeze({
  kind: 'Op/Subtract',
});

const Multiply = Object.freeze({
  kind: 'Op/Multiply',
});

const Divide = Object.freeze({
  kind: 'Op/Divide',
});

const Push = (n: number): Operation | null => {
  if (Number.isFinite(n)) {
    return Object.freeze({
      kind: 'Op/Push',
      value: n,
    });
  }
  else {
    return null;
  }
};

// EXPORTS

export default {
  Add,
  Divide,
  Multiply,
  Push,
  Subtract,
};

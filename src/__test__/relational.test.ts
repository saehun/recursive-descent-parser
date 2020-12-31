import { parseTest } from './common';

parseTest('parse gt', 'x > 0;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'BinaryExpression',
    operator: '>',
    left: {
      type: 'Identifier',
      name: 'x',
    },
    right: {
      type: 'NumericLiteral',
      value: 0,
    },
  },
});

parseTest('parse gte', 'x >= 0;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'BinaryExpression',
    operator: '>=',
    left: {
      type: 'Identifier',
      name: 'x',
    },
    right: {
      type: 'NumericLiteral',
      value: 0,
    },
  },
});

parseTest('parse lt', 'x < 0;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'BinaryExpression',
    operator: '<',
    left: {
      type: 'Identifier',
      name: 'x',
    },
    right: {
      type: 'NumericLiteral',
      value: 0,
    },
  },
});

parseTest('parse lte', 'x <= 0;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'BinaryExpression',
    operator: '<=',
    left: {
      type: 'Identifier',
      name: 'x',
    },
    right: {
      type: 'NumericLiteral',
      value: 0,
    },
  },
});

parseTest('lower presedence than additive', 'x + 5 <= 0;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'BinaryExpression',
    operator: '<=',
    left: {
      type: 'BinaryExpression',
      operator: '+',
      left: {
        type: 'Identifier',
        name: 'x',
      },
      right: {
        type: 'NumericLiteral',
        value: 5,
      },
    },
    right: {
      type: 'NumericLiteral',
      value: 0,
    },
  },
});

parseTest('lower presedence than additive #2', 'x > 1 + 3;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'BinaryExpression',
    operator: '>',
    left: {
      type: 'Identifier',
      name: 'x',
    },
    right: {
      type: 'BinaryExpression',
      operator: '+',
      left: {
        type: 'NumericLiteral',
        value: 1,
      },
      right: {
        type: 'NumericLiteral',
        value: 3,
      },
    },
  },
});

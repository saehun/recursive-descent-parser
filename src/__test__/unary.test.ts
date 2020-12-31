import { parseTest } from './common';

parseTest('-x', '-x;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'UnaryExpression',
    operator: '-',
    argument: {
      type: 'Identifier',
      name: 'x',
    },
  },
});

parseTest('!x', '!x;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'UnaryExpression',
    operator: '!',
    argument: {
      type: 'Identifier',
      name: 'x',
    },
  },
});

parseTest('unary has higher presedence than multiplicative', '3 * -x;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'BinaryExpression',
    operator: '*',
    left: {
      type: 'NumericLiteral',
      value: 3,
    },
    right: {
      type: 'UnaryExpression',
      operator: '-',
      argument: {
        type: 'Identifier',
        name: 'x',
      },
    },
  },
});

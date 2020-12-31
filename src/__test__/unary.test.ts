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

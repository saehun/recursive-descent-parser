import { parseTest } from './common';

parseTest('Simple function call', `foo(x);`, {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: { type: 'Identifier', name: 'foo' },
    arguments: [{ type: 'Identifier', name: 'x' }],
  },
});

parseTest('Chained function call', `foo()();`, {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'foo' },
      arguments: [],
    },
    arguments: [],
  },
});

parseTest('console.log', `console.log(x, y);`, {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      object: { type: 'Identifier', name: 'console' },
      property: { type: 'Identifier', name: 'log' },
    },
    arguments: [
      { type: 'Identifier', name: 'x' },
      { type: 'Identifier', name: 'y' },
    ],
  },
});

parseTest('callee can be assignment expression', `foo(x = 3);`, {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: { type: 'Identifier', name: 'foo' },
    arguments: [
      {
        type: 'AssignmentExpression',
        operator: '=',
        left: { type: 'Identifier', name: 'x' },
        right: { type: 'NumericLiteral', value: 3 },
      },
    ],
  },
});

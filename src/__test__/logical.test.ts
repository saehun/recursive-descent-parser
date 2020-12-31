import { parseTest } from './common';

parseTest('parse AND', 'x && 0;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'LogicalExpression',
    operator: '&&',
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

parseTest('parse OR', 'x || 0;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'LogicalExpression',
    operator: '||',
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

parseTest('lower presedence than equality', 'x == true || x == false;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'LogicalExpression',
    operator: '||',
    left: {
      type: 'BinaryExpression',
      operator: '==',
      left: {
        type: 'Identifier',
        name: 'x',
      },
      right: {
        type: 'BooleanLiteral',
        value: true,
      },
    },
    right: {
      type: 'BinaryExpression',
      operator: '==',
      left: {
        type: 'Identifier',
        name: 'x',
      },
      right: {
        type: 'BooleanLiteral',
        value: false,
      },
    },
  },
});

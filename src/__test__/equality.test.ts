import { parseTest } from './common';

parseTest('parse equal', 'x == 0;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'BinaryExpression',
    operator: '==',
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

parseTest('parse not equal', 'x != 0;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'BinaryExpression',
    operator: '!=',
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

parseTest('lower presedence than relational', 'x > 0 == true;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'BinaryExpression',
    operator: '==',
    left: {
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
    right: {
      type: 'BooleanLiteral',
      value: true,
    },
  },
});

parseTest('lower presedence than relational#2', 'x > 0 == false;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'BinaryExpression',
    operator: '==',
    left: {
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
    right: {
      type: 'BooleanLiteral',
      value: false,
    },
  },
});

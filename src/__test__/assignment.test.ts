import { parseTest, parseThrow } from './common';

parseTest('Simple assignment', `x = 2;`, {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: 'x',
        },
        right: {
          type: 'NumericLiteral',
          value: 2,
        },
      },
    },
  ],
});

parseTest('Chaned assignment', `x = y = 2;`, {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: 'x',
        },
        right: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'Identifier',
            name: 'y',
          },
          right: {
            type: 'NumericLiteral',
            value: 2,
          },
        },
      },
    },
  ],
});

parseThrow('SyntaxError', `42 = 2;`, 'Invalid left-hand side in assignment expression');

parseTest('Complex assignment', `x += 2;`, {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '+=',
        left: {
          type: 'Identifier',
          name: 'x',
        },
        right: {
          type: 'NumericLiteral',
          value: 2,
        },
      },
    },
  ],
});

parseTest('Chaned assignment', `x + y;`, {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'Identifier',
          name: 'x',
        },
        right: {
          type: 'Identifier',
          name: 'y',
        },
      },
    },
  ],
});

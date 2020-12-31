import { parseTest } from './common';

parseTest('Binary operation', `2 + 2;`, {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'NumericLiteral',
          value: 2,
        },
        right: {
          type: 'NumericLiteral',
          value: 2,
        },
      },
    },
  ],
});

parseTest('Nested Binary operation', `3 + 2 - 2;`, {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'BinaryExpression',
        operator: '-',
        left: {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'NumericLiteral',
            value: 3,
          },
          right: {
            type: 'NumericLiteral',
            value: 2,
          },
        },
        right: {
          type: 'NumericLiteral',
          value: 2,
        },
      },
    },
  ],
});

parseTest('Binary operation with presedence', `3 + 2 * 1;`, {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'NumericLiteral',
          value: 3,
        },
        right: {
          type: 'BinaryExpression',
          operator: '*',
          left: {
            type: 'NumericLiteral',
            value: 2,
          },
          right: {
            type: 'NumericLiteral',
            value: 1,
          },
        },
      },
    },
  ],
});

parseTest('Binary operation with presedence 2', `3 * 2 * 1;`, {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'BinaryExpression',
        operator: '*',
        left: {
          type: 'BinaryExpression',
          operator: '*',
          left: {
            type: 'NumericLiteral',
            value: 3,
          },
          right: {
            type: 'NumericLiteral',
            value: 2,
          },
        },
        right: {
          type: 'NumericLiteral',
          value: 1,
        },
      },
    },
  ],
});

parseTest('Binary operation with parenthesis', `3 - (2 + 1);`, {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'BinaryExpression',
        operator: '-',
        left: {
          type: 'NumericLiteral',
          value: 3,
        },
        right: {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'NumericLiteral',
            value: 2,
          },
          right: {
            type: 'NumericLiteral',
            value: 1,
          },
        },
      },
    },
  ],
});

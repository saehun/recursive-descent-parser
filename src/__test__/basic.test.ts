import { parseTest } from './common';

parseTest('can parse number', '42;', {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'NumericLiteral',
        value: 42,
      },
    },
  ],
});

parseTest('can parse string', '"hello world";', {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'StringLiteral',
        value: 'hello world',
      },
    },
  ],
});

parseTest('can parse string with single quote', `'hello world';`, {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'StringLiteral',
        value: 'hello world',
      },
    },
  ],
});

parseTest('can ignore white space', '   "1234"   ;', {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'StringLiteral',
        value: '1234',
      },
    },
  ],
});

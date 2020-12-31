import { parseTest } from './common';

parseTest(
  'can parse multiple statement',
  `
// BlockStatement

{
  42;
  'hello world';
}

`,
  {
    type: 'BlockStatement',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'NumericLiteral',
          value: 42,
        },
      },
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'StringLiteral',
          value: 'hello world',
        },
      },
    ],
  }
);

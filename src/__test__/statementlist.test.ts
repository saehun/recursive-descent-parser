import { parseTest } from './common';

parseTest(
  'can parse multiple statement',
  `42;
'hello world';
`,
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
  }
);

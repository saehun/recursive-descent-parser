import { parseTest } from './common';

parseTest(
  'Simple function declaration',
  `
def square(x) {
  return x * x;
}
`,
  {
    type: 'FunctionDeclaration',
    name: {
      type: 'Identifier',
      name: 'square',
    },
    params: [
      {
        type: 'Identifier',
        name: 'x',
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ReturnStatement',
          argument: {
            type: 'BinaryExpression',
            operator: '*',
            left: { type: 'Identifier', name: 'x' },
            right: { type: 'Identifier', name: 'x' },
          },
        },
      ],
    },
  }
);

parseTest(
  'Simple function declaration with empty parameters',
  `
def empty() {}
`,
  {
    type: 'FunctionDeclaration',
    name: {
      type: 'Identifier',
      name: 'empty',
    },
    params: [],
    body: {
      type: 'BlockStatement',
      body: [],
    },
  }
);

parseTest(
  'Simple function declaration with multiple parameters',
  `
def multiple(x, y) {}
`,
  {
    type: 'FunctionDeclaration',
    name: {
      type: 'Identifier',
      name: 'multiple',
    },
    params: [
      {
        type: 'Identifier',
        name: 'x',
      },
      {
        type: 'Identifier',
        name: 'y',
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
    },
  }
);

import { parseTest } from './common';

parseTest(
  'if statement',
  `
if (x) {
  x = 1;
} else {
  x = 2;
}
`,
  {
    type: 'IfStatement',
    test: {
      type: 'Identifier',
      name: 'x',
    },
    consequent: {
      type: 'BlockStatement',
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
              value: 1,
            },
          },
        },
      ],
    },
    alternate: {
      type: 'BlockStatement',
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
    },
  }
);

parseTest(
  'if statement without alternate',
  `
if (x) {
  x = 1;
}
`,
  {
    type: 'IfStatement',
    test: {
      type: 'Identifier',
      name: 'x',
    },
    consequent: {
      type: 'BlockStatement',
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
              value: 1,
            },
          },
        },
      ],
    },
    alternate: null,
  }
);

parseTest('nested if statement', 'if (x) if (y) {} else {}', {
  type: 'IfStatement',
  test: {
    type: 'Identifier',
    name: 'x',
  },
  consequent: {
    type: 'IfStatement',
    test: {
      type: 'Identifier',
      name: 'y',
    },
    consequent: {
      type: 'BlockStatement',
      body: [],
    },
    alternate: {
      type: 'BlockStatement',
      body: [],
    },
  },
  alternate: null,
});

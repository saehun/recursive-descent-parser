import { parseTest } from './common';

parseTest(
  'while statement',
  `
while (x > 10) {
  x -= 1;
}`,
  {
    type: 'WhileStatement',
    test: {
      type: 'BinaryExpression',
      operator: '>',
      left: { type: 'Identifier', name: 'x' },
      right: { type: 'NumericLiteral', value: 10 },
    },
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '-=',
            left: { type: 'Identifier', name: 'x' },
            right: { type: 'NumericLiteral', value: 1 },
          },
        },
      ],
    },
  }
);

parseTest(
  'do-while statement',
  `
do {
  x -= 1;
} while(x > 10) `,
  {
    type: 'DoWhileStatement',
    test: {
      type: 'BinaryExpression',
      operator: '>',
      left: { type: 'Identifier', name: 'x' },
      right: { type: 'NumericLiteral', value: 10 },
    },
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '-=',
            left: { type: 'Identifier', name: 'x' },
            right: { type: 'NumericLiteral', value: 1 },
          },
        },
      ],
    },
  }
);

parseTest(
  'for statement',
  `
for (let i = 0; i < 10; i += 1) {
  x += i;
}
`,
  {
    type: 'ForStatement',
    init: {
      type: 'VariableStatement',
      declarations: [
        {
          type: 'VariableDeclaration',
          id: {
            type: 'Identifier',
            name: 'i',
          },
          init: {
            type: 'NumericLiteral',
            value: 0,
          },
        },
      ],
    },
    test: {
      type: 'BinaryExpression',
      operator: '<',
      left: { type: 'Identifier', name: 'i' },
      right: { type: 'NumericLiteral', value: 10 },
    },
    update: {
      type: 'AssignmentExpression',
      operator: '+=',
      left: { type: 'Identifier', name: 'i' },
      right: { type: 'NumericLiteral', value: 1 },
    },
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '+=',
            left: { type: 'Identifier', name: 'x' },
            right: { type: 'Identifier', name: 'i' },
          },
        },
      ],
    },
  }
);

parseTest(
  'for statement is nullable',
  `
for (;;) {}
`,
  {
    type: 'ForStatement',
    init: null,
    test: null,
    update: null,
    body: {
      type: 'BlockStatement',
      body: [],
    },
  }
);

parseTest(
  'for statement with multiple variable declarations',
  `
for (let i = 0, x = 0; i < 10; i += 1) {
  x += i;
}
`,
  {
    type: 'ForStatement',
    init: {
      type: 'VariableStatement',
      declarations: [
        {
          type: 'VariableDeclaration',
          id: {
            type: 'Identifier',
            name: 'i',
          },
          init: {
            type: 'NumericLiteral',
            value: 0,
          },
        },
        {
          type: 'VariableDeclaration',
          id: {
            type: 'Identifier',
            name: 'x',
          },
          init: {
            type: 'NumericLiteral',
            value: 0,
          },
        },
      ],
    },
    test: {
      type: 'BinaryExpression',
      operator: '<',
      left: { type: 'Identifier', name: 'i' },
      right: { type: 'NumericLiteral', value: 10 },
    },
    update: {
      type: 'AssignmentExpression',
      operator: '+=',
      left: { type: 'Identifier', name: 'i' },
      right: { type: 'NumericLiteral', value: 1 },
    },
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '+=',
            left: { type: 'Identifier', name: 'x' },
            right: { type: 'Identifier', name: 'i' },
          },
        },
      ],
    },
  }
);

parseTest(
  'for statement with assignment expression',
  `
for (i = 0; i < 10; i += 1) {}
`,
  {
    type: 'ForStatement',
    init: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'Identifier',
        name: 'i',
      },
      right: {
        type: 'NumericLiteral',
        value: 0,
      },
    },
    test: {
      type: 'BinaryExpression',
      operator: '<',
      left: { type: 'Identifier', name: 'i' },
      right: { type: 'NumericLiteral', value: 10 },
    },
    update: {
      type: 'AssignmentExpression',
      operator: '+=',
      left: { type: 'Identifier', name: 'i' },
      right: { type: 'NumericLiteral', value: 1 },
    },
    body: {
      type: 'BlockStatement',
      body: [],
    },
  }
);

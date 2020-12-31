import { parseTest } from './common';

parseTest('declare variable', 'let x = 42;', {
  type: 'VariableStatement',
  declarations: [
    {
      type: 'VariableDeclaration',
      id: {
        type: 'Identifier',
        name: 'x',
      },
      init: {
        type: 'NumericLiteral',
        value: 42,
      },
    },
  ],
});

parseTest('declare variable without initializer', 'let x;', {
  type: 'VariableStatement',
  declarations: [
    {
      type: 'VariableDeclaration',
      id: {
        type: 'Identifier',
        name: 'x',
      },
      init: null,
    },
  ],
});

parseTest('declare multiple variable', 'let x, y;', {
  type: 'VariableStatement',
  declarations: [
    {
      type: 'VariableDeclaration',
      id: {
        type: 'Identifier',
        name: 'x',
      },
      init: null,
    },
    {
      type: 'VariableDeclaration',
      id: {
        type: 'Identifier',
        name: 'y',
      },
      init: null,
    },
  ],
});

parseTest('declare multiple variable, one has initializer', 'let x, y = 42;', {
  type: 'VariableStatement',
  declarations: [
    {
      type: 'VariableDeclaration',
      id: {
        type: 'Identifier',
        name: 'x',
      },
      init: null,
    },
    {
      type: 'VariableDeclaration',
      id: {
        type: 'Identifier',
        name: 'y',
      },
      init: {
        type: 'NumericLiteral',
        value: 42,
      },
    },
  ],
});

parseTest('declare variable with assignment expression', 'let x = y = 42;', {
  type: 'VariableStatement',
  declarations: [
    {
      type: 'VariableDeclaration',
      id: {
        type: 'Identifier',
        name: 'x',
      },
      init: {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: 'y',
        },
        right: {
          type: 'NumericLiteral',
          value: 42,
        },
      },
    },
  ],
});

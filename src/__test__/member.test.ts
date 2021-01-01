import { parseTest } from './common';

parseTest('property access', 'x.y;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'MemberExpression',
    computed: false,
    object: { type: 'Identifier', name: 'x' },
    property: { type: 'Identifier', name: 'y' },
  },
});

parseTest('assign value to property', 'x.y = 1;', {
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    operator: '=',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: { type: 'Identifier', name: 'x' },
      property: { type: 'Identifier', name: 'y' },
    },
    right: { type: 'NumericLiteral', value: 1 },
  },
});

parseTest('computed property access', 'x[0];', {
  type: 'ExpressionStatement',
  expression: {
    type: 'MemberExpression',
    computed: true,
    object: { type: 'Identifier', name: 'x' },
    property: { type: 'NumericLiteral', value: 0 },
  },
});

parseTest('chaned property access', `a.b.c['d'];`, {
  type: 'ExpressionStatement',
  expression: {
    type: 'MemberExpression',
    computed: true,
    object: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'Identifier',
          name: 'a',
        },
        property: {
          type: 'Identifier',
          name: 'b',
        },
      },
      property: {
        type: 'Identifier',
        name: 'c',
      },
    },
    property: { type: 'StringLiteral', value: 'd' },
  },
});

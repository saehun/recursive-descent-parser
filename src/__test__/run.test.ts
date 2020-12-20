import { Parser } from '../Parser';

const parser = new Parser();

describe('Parser', () => {
  it('can parse number', () => {
    const source = '42';
    const ast = parser.parse(source);
    expect(ast).toEqual({
      type: 'Program',
      body: {
        type: 'NumericLiteral',
        value: 42,
      },
    });
  });

  it('can parse string', () => {
    const source = '"hello"';
    const ast = parser.parse(source);
    expect(ast).toEqual({
      type: 'Program',
      body: {
        type: 'StringLiteral',
        value: 'hello',
      },
    });
  });
});

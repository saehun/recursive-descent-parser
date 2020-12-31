import { Parser } from '../Parser';
const parser = new Parser();
export const parseTest = (name: string, source: string, ...expected: any[]): void => {
  return test(name, () =>
    expect(parser.parse(source)).toEqual({
      type: 'Program',
      body: expected,
    })
  );
};

export const parseThrow = (name: string, source: string, expected: any): void => {
  return test(name, () => expect(() => parser.parse(source)).toThrowError(expected));
};

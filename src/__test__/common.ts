import { Parser } from '../Parser';
const parser = new Parser();
export const parseTest = (name: string, source: string, expected: any): void => {
  return test(name, () => expect(parser.parse(source)).toEqual(expected));
};

import { Nullable } from './helperType';
/**
 * Token type
 */
export type Token = {
  type: string;
  value: string;
};

/**
 * Tokenizer spec.
 */
const Spec: Array<[RegExp, Nullable<string>]> = [
  // Whiespace:
  [/^\s+/, null],

  // Single Comment:
  [/^\/\/.*/, null],

  // Multiline Comment:
  [/^\/\*[\s\S]*?\*\//, null],

  // Symbols, delimiters:
  [/^;/, ';'],
  [/^{/, '{'],
  [/^}/, '}'],
  [/^\(/, '('],
  [/^\)/, ')'],
  [/^,/, ','],
  [/^\./, '.'],
  [/^\[/, '['],
  [/^\]/, ']'],

  // Keywords:
  [/^\blet\b/, 'let'],
  [/^\bif\b/, 'if'],
  [/^\belse\b/, 'else'],
  [/^\btrue\b/, 'true'],
  [/^\bfalse\b/, 'false'],
  [/^\bnull\b/, 'null'],
  [/^\bwhile\b/, 'while'],
  [/^\bdo\b/, 'do'],
  [/^\bfor\b/, 'for'],
  [/^\bdef\b/, 'def'],
  [/^\breturn\b/, 'return'],
  [/^\bclass\b/, 'class'],
  [/^\bextends\b/, 'extends'],
  [/^\bsuper\b/, 'super'],
  [/^\bnew\b/, 'new'],
  [/^\bthis\b/, 'this'],

  // Numbers:
  [/^\d+/, 'NUMBER'],

  // Identifiers:
  [/^\w+/, 'IDENTIFIER'],

  // Equality operators: ==, !=
  [/^[=!]=/, 'EQUALITY_OPERATOR'],

  // Assignment operators: =, *=, /=, +=, -=
  [/^=/, 'SIMPLE_ASSIGN'],
  [/^[-+*/]=/, 'COMPLEX_ASSIGN'],

  // Math operators: +, -
  [/^[+-]/, 'ADDITIVE_OPERATOR'],
  [/^[*/]/, 'MULTIPLICATIVE_OPERATOR'],

  // Relational operators: >, >=, <, <=
  [/^[<>]=?/, 'RELATIONAL_OPERATOR'],

  // Logical operators: &&, ||
  [/^&&/, 'LOGICAL_AND'],
  [/^\|\|/, 'LOGICAL_OR'],
  [/^!/, 'LOGICAL_NOT'],

  // Strings:
  [/^['"][^'"]*['"]/, 'STRING'],
];

/**
 * Tokenizer class
 *
 * Lazily pulls a token from a stream.
 */
export class Tokeninzer {
  source: string;
  cursor: number;

  /**
   * Initialize the string;
   */
  init(source: string): void {
    this.source = source;
    this.cursor = 0;
  }

  /**
   * Whether the tokenizer reached EOF.
   */
  private isEOF() {
    return this.cursor === this.source.length;
  }

  /**
   * Whether we still have more tokens
   */
  private hasMoreToken(): boolean {
    return this.cursor < this.source.length;
  }

  /**
   * Obtains next token.
   */
  getNextToken(): Nullable<Token> {
    if (!this.hasMoreToken()) return null;

    const source = this.source.slice(this.cursor);

    for (const [pattern, type] of Spec) {
      const value = this.match(pattern, source);
      if (value == null) continue;
      if (type == null) return this.getNextToken();
      return { type, value };
    }

    throw new SyntaxError(`Unexpected token: "${source[0]}"`);
  }

  private match(pattern: RegExp, source: string): Nullable<string> {
    const matched = pattern.exec(source);
    if (matched !== null) {
      this.cursor += matched[0].length;
      return matched[0];
    } else {
      return null;
    }
  }
}

import { Nullable } from './helperType';
import { Tokeninzer, Token } from './Tokenizer';
/**
 * Parser: recursive decent implementation.
 */
export class Parser {
  source: string;
  tokenizer: Tokeninzer;
  lookahead: Nullable<Token>;

  constructor() {
    this.source = '';
    this.tokenizer = new Tokeninzer();
  }

  /**
   * Parses a string into an AST.
   */
  parse(source: string) {
    this.source = source;
    this.tokenizer.init(source);

    // Prime the tokenizer to obtain the first token
    // which is our lookahead. The lookahead is
    // used for predictive parsing.
    this.lookahead = this.tokenizer.getNextToken();

    // Parse recurively starting from the main entry point
    // the Program:
    return this.Program();
  }

  /**
   * Main entry point.
   *
   * Program
   *   ; Numericliteral
   *   ;
   */
  private Program() {
    return {
      type: 'Program',
      body: this.Literal(),
    };
  }

  /**
   * Literal
   *   : NumericLiteral
   *   | StringLiteral
   *   ;
   */
  private Literal() {
    switch (this.lookahead?.type) {
      case 'NUMBER':
        return this.NumericLiteral();
      case 'STRING':
        return this.StringLiteral();
    }
    throw new SyntaxError(`Literal: unexpected literal production`);
  }

  /**
   * StringLiteral
   *   : STRING
   *   ;
   */
  private StringLiteral() {
    const token = this.eat('STRING');
    return {
      type: 'StringLiteral',
      value: token.value.slice(1, -1),
    };
  }

  /**
   * NumericLiteral
   *   : NUMBER
   *   ;
   */
  private NumericLiteral() {
    const token = this.eat('NUMBER');
    return {
      type: 'NumericLiteral',
      value: Number(token.value),
    };
  }

  /**
   * Expects a token of a given type.
   */
  private eat(tokenType: string) {
    const token = this.lookahead;
    if (token == null) {
      throw new SyntaxError(`Unexpected end of input, expected: "${tokenType}"`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(`Unexpected token: "${token.value}", expect: "${tokenType}"`);
    }

    this.lookahead = this.tokenizer.getNextToken();
    return token;
  }
}

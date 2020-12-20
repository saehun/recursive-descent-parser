/**
 * Parser: recursive decent implementation.
 */
export class Parser {
  source: string;

  /**
   * Parses a string into an AST.
   */
  parse(source: string) {
    this.source = source;
    //
    return this.program();
  }

  /**
   * Main entry point.
   */
  program() {
    return this.numericLiteral();
  }

  /**
   * NumericLiteral
   *   ; NUMBER
   *   ;
   */
  numericLiteral() {
    return {
      type: 'NumericLiteral',
      value: Number(this.source),
    };
  }
}

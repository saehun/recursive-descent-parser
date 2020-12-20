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
    return this.Program();
  }

  /**
   * Main entry point.
   *
   * Program
   *   ; Numericliteral
   *   ;
   */
  Program() {
    return {
      type: 'Program',
      body: this.NumericLiteral(),
    };
  }

  /**
   * NumericLiteral
   *   ; NUMBER
   *   ;
   */
  NumericLiteral() {
    return {
      type: 'NumericLiteral',
      value: Number(this.source),
    };
  }
}

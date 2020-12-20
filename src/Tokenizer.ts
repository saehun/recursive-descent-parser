import { Nullable } from './helperType';
/**
 * Token type
 */
export type Token = {
  type: string;
  value: string;
};

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
    if (!this.hasMoreToken()) {
      return null;
    }

    const source = this.source.slice(this.cursor);

    // Number:
    if (!Number.isNaN(Number(source[0]))) {
      let number = '';
      while (!Number.isNaN(Number(source[this.cursor]))) {
        number += source[this.cursor++];
      }

      return {
        type: 'NUMBER',
        value: number,
      };
    }

    // String:
    if (source[0] === '"') {
      let s = '';
      do {
        s += source[this.cursor++];
      } while (source[this.cursor] !== '"' && !this.isEOF());
      s += source[this.cursor++];
      return {
        type: 'STRING',
        value: s,
      };
    }

    return null;
  }
}

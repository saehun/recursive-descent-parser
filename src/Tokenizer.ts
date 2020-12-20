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
   * Whether we still have more tokens
   */
  hasMoreToken(): boolean {
    return this.cursor < this.source.length;
  }

  getNextToken(): Nullable<Token> {
    if (!this.hasMoreToken()) {
      return null;
    }

    const source = this.source.slice(this.cursor);

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

    return null;
  }
}

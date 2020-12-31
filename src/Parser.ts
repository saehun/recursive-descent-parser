import { Nullable } from './helperType';
import { Tokeninzer, Token } from './Tokenizer';

type Node = {
  type: string;
};

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
      body: this.StatementList(),
    };
  }

  /**
   * StatementList
   *   : Statement
   *   | StatementList Statement
   *   ;
   */
  private StatementList(stopLookahead: Nullable<string> = null): Node[] {
    const statementList = [this.Statement()];
    while (this.lookahead != null && this.lookahead?.type !== stopLookahead) {
      statementList.push(this.Statement());
    }
    return statementList;
  }

  /**
   * Statement
   *   : ExpressionStatement
   *   | BlockStatement
   *   | EmptyStatement
   *   ;
   */
  private Statement() {
    if (this.lookahead?.type === ';') return this.EmptyStatement();
    if (this.lookahead?.type === '{') return this.BlockStatement();
    return this.ExpressionStatement();
  }

  /**
   * EmptyStatement
   *   : ';'
   *   ;
   */
  private EmptyStatement() {
    this.eat(';');
    return {
      type: 'EmptyStatement',
    };
  }

  /**
   * BlockStatement
   *   : '{' OptStatementList '}'
   *   ;
   */
  private BlockStatement() {
    this.eat('{');
    const body = this.lookahead?.type !== '}' ? this.StatementList('}') : [];
    this.eat('}');

    return {
      type: 'BlockStatement',
      body,
    };
  }

  /**
   * ExpressionStatement
   *   : Expression ';'
   *   ;
   */
  private ExpressionStatement() {
    const expression = this.Expression();
    this.eat(';');
    return {
      type: 'ExpressionStatement',
      expression,
    };
  }

  /**
   * Expression
   *   : Literal
   *   ;
   */
  private Expression() {
    return this.AdditiveExpression();
  }

  /**
   * AdditiveExpression
   *   : MultiplicativeExpression
   *   | AdditiveExpression ADDITIVE_OPERATOR MultiplicativeExpression
   *   ;
   */
  private AdditiveExpression() {
    return this.BinaryExpression('MultiplicativeExpression', 'ADDITIVE_OPERATOR');
  }

  /**
   * MultiplicativeExpression
   *   : PrimaryExpression
   *   | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
   *   ;
   */
  private MultiplicativeExpression() {
    return this.BinaryExpression('PrimaryExpression', 'MULTIPLICATIVE_OPERATOR');
  }

  private BinaryExpression(builderName: 'PrimaryExpression' | 'MultiplicativeExpression', operatorToken: string) {
    let left: any = this[builderName]();

    while (this.lookahead?.type === operatorToken) {
      const operator = this.eat(operatorToken).value;
      const right = this[builderName]();

      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  /**
   * PrimaryExpression
   *   : Literal
   *   | ParenthesizedExpression
   *   ;
   */
  private PrimaryExpression() {
    switch (this.lookahead?.type) {
      case '(':
        return this.ParenthesizedExpression();
      default:
        return this.Literal();
    }
  }

  /**
   * ParenthesizedExpression
   *   : '(' Expression ')'
   *   ;
   */
  private ParenthesizedExpression() {
    this.eat('(');
    const expression = this.Expression();
    this.eat(')');
    return expression;
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

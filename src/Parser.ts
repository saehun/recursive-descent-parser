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
   *   | VariableStatement
   *   | IfStatement
   *   | IterationStatement
   *   | FunctionDeclaration
   *   | ReturnStatement
   *   | ClassDeclaration
   *   ;
   */
  private Statement(): Node {
    switch (this.lookahead?.type) {
      case ';':
        return this.EmptyStatement();
      case '{':
        return this.BlockStatement();
      case 'let':
        return this.VariableStatement();
      case 'if':
        return this.IfStatement();
      case 'while':
      case 'do':
      case 'for':
        return this.IterationStatement();
      case 'def':
        return this.FunctionDeclaration();
      case 'return':
        return this.ReturnStatement();
      case 'class':
        return this.ClassDeclaration();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * ClassDeclaration
   *   : 'class' Identifier OptClassExtends BlockStatement
   *   ;
   */
  private ClassDeclaration() {
    this.eat('class');
    const id = this.Identifier();
    let superClass = null;
    if (this.lookahead?.type === 'extends') {
      this.eat('extends');
      superClass = this.Identifier();
    }
    const body = this.BlockStatement();
    return {
      type: 'ClassDeclaration',
      id,
      superClass,
      body,
    };
  }

  /**
   * FunctionDeclaration
   *   : 'def' Identifier '(' OptFormalParameterList ')' BlockStatement
   *   ;
   */
  private FunctionDeclaration() {
    this.eat('def');
    const name = this.Identifier();
    this.eat('(');
    const params = this.lookahead?.type === ')' ? [] : this.FormalParameterList();
    this.eat(')');
    const body = this.BlockStatement();
    return {
      type: 'FunctionDeclaration',
      name,
      params,
      body,
    };
  }

  /**
   * FormalParameterList
   *   : Identifier
   *   | FormalParameterList ',' Identifier
   *   ;
   */
  private FormalParameterList() {
    const params = [];
    do {
      params.push(this.Identifier());
    } while (this.lookahead?.type === ',' && this.eat(','));
    return params;
  }

  /**
   * ReturnStatement
   *   : 'return' OptExpression
   *   ;
   */
  private ReturnStatement() {
    this.eat('return');
    const argument = this.lookahead?.type === ';' ? null : this.Expression();
    this.eat(';');
    return {
      type: 'ReturnStatement',
      argument,
    };
  }

  /**
   * IterationStatement
   *   : WhileStatement
   *   | DoWhileStatement
   *   | ForStatement
   *   ;
   */
  private IterationStatement() {
    switch (this.lookahead?.type) {
      case 'while':
        return this.WhileStatement();
      case 'do':
        return this.DoWhileStatement();
      default:
        // case 'for':
        return this.ForStatement();
    }
  }

  /**
   * WhileStatement
   *   : 'while' '(' Expression ')' Statement
   *   ;
   */
  private WhileStatement() {
    this.eat('while');
    this.eat('(');
    const test = this.Expression();
    this.eat(')');
    const body = this.Statement();
    return {
      type: 'WhileStatement',
      test,
      body,
    };
  }

  /**
   * DoWhileStatement
   *   : 'do' Statement 'while' '(' Expression ')'
   *   ;
   */
  private DoWhileStatement() {
    this.eat('do');
    const body = this.Statement();
    this.eat('while');
    this.eat('(');
    const test = this.Expression();
    this.eat(')');
    return {
      type: 'DoWhileStatement',
      test,
      body,
    };
  }

  /**
   * ForStatement
   *   : 'for' '(' OptForStatementInit ';' OptExpression ';' OptExpression ')' Statement
   *   ;
   */
  private ForStatement() {
    this.eat('for');
    this.eat('(');
    const init = this.lookahead?.type === ';' ? null : this.ForStatementInit();
    this.eat(';');
    const test = this.lookahead?.type === ';' ? null : this.Expression();
    this.eat(';');
    const update = this.lookahead?.type === ')' ? null : this.Expression();
    this.eat(')');
    const body = this.Statement();
    return {
      type: 'ForStatement',
      init,
      test,
      update,
      body,
    };
  }

  /**
   * ForStatementInit
   *   : VariableStatementInit
   *   | Expression
   *   ;
   */
  private ForStatementInit() {
    if (this.lookahead?.type === 'let') {
      return this.VariableStatementInit();
    }
    return this.Expression();
  }

  /**
   * IfStatement
   *   : 'if' '(' Expression ')' Statement
   *   : 'if' '(' Expression ')' Statement 'else' Statement
   */
  private IfStatement() {
    this.eat('if');
    this.eat('(');
    const test = this.Expression();
    this.eat(')');
    const consequent = this.Statement();
    const alternate = this.lookahead?.type === 'else' ? this.eat('else') && this.Statement() : null;
    return {
      type: 'IfStatement',
      test,
      consequent,
      alternate,
    };
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
   * VariableStatementInit
   */
  private VariableStatementInit() {
    this.eat('let');
    const declarations = this.VariableDeclarationList();
    return {
      type: 'VariableStatement',
      declarations,
    };
  }

  /**
   * VariableStatement
   *   : 'let' VariableDeclarationList ';'
   *   ;
   */
  private VariableStatement() {
    const variableStatement = this.VariableStatementInit();
    this.eat(';');
    return variableStatement;
  }

  /**
   * VariableDeclarationList
   *   : VariableDeclaration
   *   | VariableDeclarationList  ',' VariableDeclaration
   *   ;
   */
  private VariableDeclarationList() {
    const declarations = [];

    do {
      declarations.push(this.VariableDeclaration());
    } while (this.lookahead?.type === ',' && this.eat(','));

    return declarations;
  }

  /**
   * VariableDeclaration
   *   : Identifier OptVariableInitializer
   *   ;
   */
  private VariableDeclaration() {
    const id = this.Identifier();

    // OptVariableInitializer
    const init = this.lookahead?.type !== ';' && this.lookahead?.type !== ',' ? this.VariableInitializer() : null;
    return {
      type: 'VariableDeclaration',
      id,
      init,
    };
  }

  /**
   * VariableInitializer
   *   : SIMPLE_ASSIGN AssignmentExpression
   *   ;
   */
  private VariableInitializer() {
    this.eat('SIMPLE_ASSIGN');
    return this.AssignmentExpression();
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
    return this.AssignmentExpression();
  }

  /**
   * AssignmentExpression
   *   : LogicalOrExpression
   *   | LeftHandSideExpression AssignmentOperator AssignmentExpression
   *   ;
   */
  private AssignmentExpression(): any {
    const left = this.LogicalOrExpression();
    if (!this.isAssignmentOperator(this.lookahead?.type)) {
      return left;
    }

    return {
      type: 'AssignmentExpression',
      operator: this.AssignmentOperator().value,
      left: this.checkValidAssignmentTarget(left),
      right: this.AssignmentExpression(),
    };
  }

  /**
   * LeftHandSideExpression
   *   : CallMemberExpression
   *   ;
   */
  private LeftHandSideExpression() {
    return this.CallMemberExpression();
  }

  /**
   * CallMemberExpression
   *   : MemeberExpression
   *   | CallExpression
   *   ;
   */
  private CallMemberExpression() {
    if (this.lookahead?.type === 'super') {
      return this.CallExpression(this.Super());
    }

    const member = this.MemberExpression();

    if (this.lookahead?.type === '(') {
      return this.CallExpression(member);
    }

    return member;
  }

  /**
   * CallExpression
   *   : Callee Arguments
   *   ;
   *
   * Callee
   *   : MemberExpression
   *   | CallExpression
   *   ;
   */
  private CallExpression(callee: Node) {
    let callExpression = {
      type: 'CallExpression',
      callee,
      arguments: this.Arguments(),
    };

    if (this.lookahead?.type === '(') {
      callExpression = this.CallExpression(callExpression);
    }

    return callExpression;
  }

  /**
   * Arguments
   *   : '(' OptArgumentList ')'
   *   ;
   */
  private Arguments() {
    this.eat('(');
    const argumentList = this.lookahead?.type === ')' ? [] : this.ArgumentList();
    this.eat(')');
    return argumentList;
  }

  /**
   * ArgumentList
   *   : AssignmentExpression
   *   | ArgumentList ',' AssignmentExpression
   */
  private ArgumentList() {
    const argumentList = [];

    do {
      argumentList.push(this.AssignmentExpression());
    } while (this.lookahead?.type === ',' && this.eat(','));

    return argumentList;
  }

  /**
   * MemberExpression
   *   : PrimaryExpression
   *   | MemberExpression '.' Identifier
   *   | MemberExpression '[' Expression ']'
   */
  private MemberExpression() {
    let object: any = this.PrimaryExpression();

    while (this.lookahead?.type === '.' || this.lookahead?.type === '[') {
      if (this.lookahead?.type === '.') {
        this.eat('.');
        const property = this.Identifier();
        object = {
          type: 'MemberExpression',
          computed: false,
          object,
          property,
        };
      } else {
        this.eat('[');
        const property = this.Expression();
        this.eat(']');
        object = {
          type: 'MemberExpression',
          computed: true,
          object,
          property,
        };
      }
    }

    return object;
  }

  /**
   * Identifier
   *   : IDENTIFIER
   *   ;
   */
  private Identifier() {
    const name = this.eat('IDENTIFIER').value;
    return {
      type: 'Identifier',
      name,
    };
  }

  /**
   * Extra check wthether it's valid assignment target.
   */
  private checkValidAssignmentTarget(node: Node) {
    if (node.type === 'Identifier' || node.type === 'MemberExpression') {
      return node;
    }
    throw new SyntaxError('Invalid left-hand side in assignment expression');
  }

  /**
   * Whether the token is an assignment operator
   */
  private isAssignmentOperator(tokenType?: string) {
    return tokenType === 'SIMPLE_ASSIGN' || tokenType === 'COMPLEX_ASSIGN';
  }

  /**
   * AssignmentOperator
   *   : SIMPLE_ASSIGN
   *   | COMPLEX_ASSIGN
   *   ;
   */
  private AssignmentOperator() {
    if (this.lookahead?.type === 'SIMPLE_ASSIGN') {
      return this.eat('SIMPLE_ASSIGN');
    }
    return this.eat('COMPLEX_ASSIGN');
  }

  /**
   * LogicalOrExpression
   *   : LogicalAndExpression
   *   | LogicalAndExpression LOGICAL_OR LogicalOrExpression
   *   ;
   *
   *  &&
   */
  private LogicalOrExpression() {
    return this.LogicalExpression('LogicalAndExpression', 'LOGICAL_OR');
  }

  /**
   * LogicalAndExpression
   *   : EqualityExpression
   *   | EqualityExpression LOGICAL_AND LogicalAndExpression
   *   ;
   *
   *  &&
   */
  private LogicalAndExpression() {
    return this.LogicalExpression('EqualityExpression', 'LOGICAL_AND');
  }

  /**
   * EqualityExpression
   *   : ReplationalExpression
   *   | ReplationalExpression EQUALITY_OPERATOR EqualityExpression
   *   ;
   *
   *  ==, !=
   */
  private EqualityExpression() {
    return this.BinaryExpression('RelationalExpression', 'EQUALITY_OPERATOR');
  }

  /**
   * RelationalExpression
   *   : AdditiveExpression
   *   | AdditiveExpression RELATIONAL_OPERATOR RelationalExpression
   *   ;
   *
   *  >, >=, <, <=
   */
  private RelationalExpression() {
    return this.BinaryExpression('AdditiveExpression', 'RELATIONAL_OPERATOR');
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
   *   : UnaryExpression
   *   | MultiplicativeExpression MULTIPLICATIVE_OPERATOR UnaryExpression
   *   ;
   */
  private MultiplicativeExpression() {
    return this.BinaryExpression('UnaryExpression', 'MULTIPLICATIVE_OPERATOR');
  }

  private LogicalExpression(
    builderName: 'LogicalOrExpression' | 'LogicalAndExpression' | 'EqualityExpression',
    operatorToken: string
  ) {
    let left: any = this[builderName]();

    while (this.lookahead?.type === operatorToken) {
      const operator = this.eat(operatorToken).value;
      const right = this[builderName]();

      left = {
        type: 'LogicalExpression',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private BinaryExpression(
    builderName:
      | 'PrimaryExpression'
      | 'MultiplicativeExpression'
      | 'AdditiveExpression'
      | 'RelationalExpression'
      | 'UnaryExpression',
    operatorToken: string
  ) {
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
   * UnaryExpression
   *   : LeftHandSideExpression
   *   | ADDITIVE_OPERATOR UnaryExpression
   *   | LOGICAL_NOT UnaryExpression
   */
  private UnaryExpression(): any {
    let operator: string | undefined;
    switch (this.lookahead?.type) {
      case 'ADDITIVE_OPERATOR':
        operator = this.eat('ADDITIVE_OPERATOR').value;
        break;
      case 'LOGICAL_NOT':
        operator = this.eat('LOGICAL_NOT').value;
        break;
    }
    if (operator != null) {
      return {
        type: 'UnaryExpression',
        operator,
        argument: this.UnaryExpression(),
      };
    }

    return this.LeftHandSideExpression();
  }

  /**
   * PrimaryExpression
   *   : Literal
   *   | ParenthesizedExpression
   *   | Identifier
   *   | LeftHandSideExpression
   *   | ThisExpression
   *   | NewExpression
   *   ;
   */
  private PrimaryExpression(): Node {
    if (this.isLiteral(this.lookahead?.type)) {
      return this.Literal();
    }
    switch (this.lookahead?.type) {
      case '(':
        return this.ParenthesizedExpression();
      case 'IDENTIFIER':
        return this.Identifier();
      case 'this':
        return this.ThisExpression();
      case 'new':
        return this.NewExpression();
      default:
        return this.LeftHandSideExpression();
    }
  }

  /**
   * NewExpression
   *   : 'new' MemberExpression Arguments
   */
  private NewExpression() {
    this.eat('new');
    return {
      type: 'NewExpression',
      callee: this.MemberExpression(),
      arguments: this.Arguments(),
    };
  }

  /**
   * ThisExpression
   *   : 'this'
   *   ;
   */
  private ThisExpression() {
    this.eat('this');
    return {
      type: 'ThisExpression',
    };
  }

  /**
   * Super
   *   : 'super'
   *   ;
   */
  private Super() {
    this.eat('super');
    return {
      type: 'Super',
    };
  }

  private isLiteral(tokenType?: string) {
    if (tokenType == null) return false;
    return (
      tokenType === 'NUMBER' ||
      tokenType === 'STRING' ||
      tokenType === 'true' ||
      tokenType === 'false' ||
      tokenType === 'null'
    );
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
      case 'true':
        return this.BooleanLiteral(true);
      case 'false':
        return this.BooleanLiteral(false);
      case 'null':
        return this.NullLiteral();
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
   * BooleanLiteral
   *   : 'true'
   *   : 'flase'
   *   ;
   */
  private BooleanLiteral(value: boolean) {
    this.eat(value ? 'true' : 'false');
    return {
      type: 'BooleanLiteral',
      value,
    };
  }

  /**
   * NullLiteral
   *   : 'null'
   *   ;
   */
  private NullLiteral() {
    this.eat('null');
    return {
      type: 'NullLiteral',
      value: null,
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

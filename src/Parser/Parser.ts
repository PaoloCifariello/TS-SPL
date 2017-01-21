
    import {Token} from "../Lexer/Token";
    import {TokenType} from "../Lexer/TokenType";
    import {Program} from "./Program";
    import {Statements} from "./Statements";
    import {Statement, StatementType} from "./Statement";
    import {glob} from "../global";
    import {Function_} from "./Function_";

    import {Expression, ExpressionType} from "./Expression";
    import {Assignment} from "./Assignment";
    import {Condition} from "./Condition";
    import {ExpressionValue, ExpressionValueType} from "../Virtualmachine/ExpressionValue";
    import {Evaluator} from "../Virtualmachine/Evaluator";
    export class Parser {
        private tokens: Token[];

        private get CurrentType(): TokenType {
            if (this.tokens.length > 0)
                return this.tokens[0].Type;
            else
                return TokenType.END;
        }

        private get NextType(): TokenType {
            if (this.tokens.length > 1)
                return this.tokens[1].Type;
            else
                return TokenType.END;
        }

        private Pop(n?): Token {
            if (n) {
                var last: Token = null;

                for (var i = 0; i < n; i++) {
                    if ((last = this.Pop()) == null)
                        return null;
                }

                return last;

            } else {
                if (this.tokens.length > 0)
                    return this.tokens.splice(0, 1)[0];
                else
                    return null;
            }
        }

        public Parse(tokens: Token[]): Program {
            this.tokens = tokens;

            if (glob.VERBOSE) {
                var str = "";
                this.tokens.forEach(tk => str += tk.ToString());
                console.log("Tokens:\n" + str);
            }

            var prog: Program = new Program(),
                st: Statements = this.ParseStatements();

            if (st != null)
                prog.AddStatements(st);

            return prog;
        }

        private ParseStatements(): Statements {
            var statements: Statements = new Statements();
            var st: Statement;

            while ((st = this.ParseStatement()) != null) {
                statements.AddStatement(st);
            }

            return statements;
        }

        private ParseStatement(): Statement {
            while (TokenType[this.CurrentType] == TokenType[TokenType.LINE_END])
                this.Pop();

            var type: TokenType = this.CurrentType;

            if (TokenType[type] == TokenType[TokenType.FUNCTION]) {
                this.Pop();
                var fun: Function_ = this.ParseFunction();
                return new Statement(StatementType.FUNCTION_DECLARATION, fun);

                // If then, if then else
            } else if (TokenType[type] == TokenType[TokenType.IF]) {
                this.Pop();
                var cnd: Condition = this.ParseCondition();

                if (TokenType[this.CurrentType] != TokenType[TokenType.L_BRACE]) {
                    glob.MISSING_L_BRACE_TOKEN("Getted instead " + TokenType[this.CurrentType]);
                    return null;
                }

                this.Pop();
                var st1: Statements = this.ParseStatements();

                if (TokenType[this.CurrentType] != TokenType[TokenType.R_BRACE]) {
                    glob.MISSING_R_BRACE_TOKEN("Getted instead " + TokenType[this.CurrentType]);
                    return null;
                }

                this.Pop();

                if (TokenType[this.CurrentType] == TokenType[TokenType.ELSE]) {
                    this.Pop();

                    if (TokenType[this.CurrentType] != TokenType[TokenType.L_BRACE]) {
                        glob.MISSING_L_BRACE_TOKEN("Getted instead " + TokenType[this.CurrentType]);
                        return null;
                    }

                    this.Pop();

                    var st2: Statements = this.ParseStatements();

                    if (TokenType[this.CurrentType] != TokenType[TokenType.R_BRACE]) {
                        glob.MISSING_R_BRACE_TOKEN("Getted instead " + TokenType[this.CurrentType]);
                        return null;
                    }

                    this.Pop();

                    return new Statement(StatementType.IF_THEN_ELSE, cnd, st1, st2);
                } else
                    return new Statement(StatementType.IF_THEN, cnd, st1);

                // while
            } else if (TokenType[type] == TokenType[TokenType.WHILE]) {
                this.Pop();
                var cnd: Condition = this.ParseCondition();

                if (TokenType[this.CurrentType] != TokenType[TokenType.L_BRACE])
                    return null;

                this.Pop();
                var st: Statements = this.ParseStatements();

                if (TokenType[this.CurrentType] != TokenType[TokenType.R_BRACE])
                    return null;
                this.Pop();

                return new Statement(StatementType.WHILE, cnd, st);

            } else if (TokenType[type] == TokenType[TokenType.RETURN]) {
                this.Pop();

                var returnValue: Expression = this.ParseExpression();

                if (TokenType[this.CurrentType] != TokenType[TokenType.SEMI])
                    return null;

                this.Pop();
                return new Statement(StatementType.RETURN, returnValue);

                // var, alphanumeric or alphanumeric ()
            } else {
                if (TokenType[this.NextType] != TokenType[TokenType.L_PAREN]) {
                    var asg: Assignment = this.ParseAssignment();
                    if (asg == null)
                        return null;
                    else
                        return new Statement(StatementType.ASSIGN, asg);
                } else {
                    var exp: Expression = this.ParseExpression();
                    if (exp == null) {
                        glob.ERROR_PARSING_EXPRESSION();
                        return null;
                    }
                    else {
                        if (TokenType[this.CurrentType] != TokenType[TokenType.SEMI]) {
                            glob.MISSING_SEMICOLON_TOKEN();
                            return null;
                        }
                        this.Pop();
                        return new Statement(StatementType.FUNCTION, exp);
                    }

                }
            }
        }

        private ParseCondition(): Condition {
            if (TokenType[this.CurrentType] != TokenType[TokenType.L_PAREN]) {
                glob.MISSING_L_PAREN_TOKEN("Getting instead : " + TokenType[this.CurrentType]);
                return null;
            }

            this.Pop();
            var exp: Expression = this.ParseExpression();

            if (exp == null) {
                glob.ERROR_PARSING_EXPRESSION();
                return null;
            } else if (TokenType[this.CurrentType] != TokenType[TokenType.R_PAREN]) {
                glob.MISSING_R_PAREN_TOKEN();
                return null;
        }
            this.Pop();

            return new Condition(exp);
        }

        private ParseAssignment(): Assignment {
            if (TokenType[this.CurrentType] == TokenType[TokenType.DECLARE]) {
                this.Pop();

                if (TokenType[this.CurrentType] != TokenType[TokenType.ALPHANUMERIC]) {
                    glob.ERROR_EXPECTED_ALPHANUMERIC(TokenType[this.CurrentType]);
                    return null;
                }

                var word: string = this.Pop().Value;

                if (TokenType[this.CurrentType] == TokenType[TokenType.SEMI]) {
                    this.Pop();
                    return new Assignment(word, false);
                } else if (TokenType[this.CurrentType] == TokenType[TokenType.ASSIGN]) {
                    this.Pop();
                    var exp: Expression = this.ParseExpression();

                    if (exp == null) {
                        glob.ERROR_PARSING_EXPRESSION();
                        return null;
                    } else if (TokenType[this.CurrentType] != TokenType[TokenType.SEMI]) {
                        glob.MISSING_SEMICOLON_TOKEN(TokenType[this.CurrentType]);
                        return null;
                    }

                    this.Pop();
                    return new Assignment(word, exp, false);
                } else
                    return null;
            } else if (TokenType[this.CurrentType] == TokenType[TokenType.ALPHANUMERIC]) {
                var word: string = this.Pop().Value;

                if (TokenType[this.CurrentType] != TokenType[TokenType.ASSIGN]) {
                    glob.MISSING_ASSIGN_TOKEN(TokenType[this.CurrentType]);
                    return null;
                }

                this.Pop();

                var exp: Expression = this.ParseExpression();

                if (exp == null) {
                    glob.ERROR_PARSING_EXPRESSION();
                    return null;
                } else if (TokenType[this.CurrentType] != TokenType[TokenType.SEMI]) {
                    glob.MISSING_SEMICOLON_TOKEN(TokenType[this.CurrentType]);
                    return null;
                }

                this.Pop();
                return new Assignment(word, exp, true);
            } else if (TokenType[this.CurrentType] == TokenType[TokenType.OBJECT_ACCESS]) {
                var accessor: string[] = this.Pop().AccessKey;

                if (TokenType[this.CurrentType] != TokenType[TokenType.ASSIGN]) {
                    glob.MISSING_ASSIGN_TOKEN();
                    return null;
                }

                this.Pop();

                var exp: Expression = this.ParseExpression();

                if (exp == null) {
                    glob.ERROR_PARSING_EXPRESSION();
                    return null
                } else if (TokenType[this.CurrentType] != TokenType[TokenType.SEMI]) {
                    glob.MISSING_SEMICOLON_TOKEN(this.tokens);
                    return null;
                }

                this.Pop();
                return new Assignment(accessor, exp, true);

            } else
                return null;
        }

        private ParseExpression(): Expression {
            var exp1: Expression;
            // Case (EXPRESSION)
            if (TokenType[this.CurrentType] == TokenType[TokenType.L_PAREN]) {
                this.Pop();
                exp1 = this.ParseExpression();
                if (TokenType[this.CurrentType] != TokenType[TokenType.R_PAREN]) {
                    glob.MISSING_R_PAREN_TOKEN("Getting instead : " + TokenType[this.CurrentType]);
                    return null;
                }

                this.Pop();
                // Identifier case
            } else if (TokenType[this.CurrentType] == TokenType[TokenType.ALPHANUMERIC]) {
                var id: Token = this.Pop();
                if (TokenType[this.CurrentType] == TokenType[TokenType.L_PAREN]) {
                    this.Pop();

                    var parameters: Expression[] = this.ParseFunctionParameters();
                    exp1 = new Expression(ExpressionType.FUNCTION, id.Value, parameters);
                } else

                    //char initial = id.Value [0];

                    //if (!Matcher.isValidInitialIdentifier (initial))
                    //	return null;
                    //else
                    exp1 = new Expression(ExpressionType.IDENTIFIER, id);
                // Integer case
            } else if ((TokenType[this.CurrentType] == TokenType[TokenType.NUMBER]) ||
                ((TokenType[this.NextType] == TokenType[TokenType.NUMBER]) &&
                ((TokenType[this.CurrentType] == TokenType[TokenType.PLUS]) ||
                (TokenType[this.CurrentType] == TokenType[TokenType.MINUS])))) {

                var cur: Token = this.Pop();
                var sign = 1;

                if (TokenType[cur.Type] == TokenType[TokenType.PLUS])
                    cur = this.Pop();
                else if (TokenType[cur.Type] == TokenType[TokenType.MINUS]) {
                    cur = this.Pop();
                    sign = -1;
                }

                var value: ExpressionValue = new ExpressionValue(
                    ExpressionValueType.NUMBER,
                    sign * Evaluator.ToNumber(cur.Value)
                    );

                exp1 = new Expression(ExpressionType.INTEGER, value);
                // Boolean case
            } else if (TokenType[this.CurrentType] == TokenType[TokenType.TRUE] || TokenType[this.CurrentType] == TokenType[TokenType.FALSE]) {
                var value: ExpressionValue = new ExpressionValue(
                    ExpressionValueType.BOOLEAN,
                    Evaluator.ToBool(this.Pop().Value)
                    );
                exp1 = new Expression(ExpressionType.BOOL, value);
                // String case
            } else if (TokenType[this.CurrentType] == TokenType[TokenType.QUOTE]) {
                this.Pop();

                if (TokenType[this.CurrentType] != TokenType[TokenType.ALPHANUMERIC])
                    return null;

                var str: Token = this.Pop();
                if (TokenType[this.CurrentType] != TokenType[TokenType.QUOTE]) {
                    glob.MISSING_QUOTE_TOKEN("Getting instead : " + TokenType[this.CurrentType]);
                    return null;
                }

                this.Pop();

                var value: ExpressionValue = new ExpressionValue(
                    ExpressionValueType.STRING,
                    str.Value
                );
                exp1 = new Expression(
                    ExpressionType.STRING,
                    value
                );
                // Expression combination case
            } else if (TokenType[this.CurrentType] == TokenType[TokenType.L_BRACE] && TokenType[this.NextType] == TokenType[TokenType.R_BRACE]) {
                this.Pop(2);
                return new Expression(ExpressionType.OBJECT);
            } else if (TokenType[this.CurrentType] == TokenType[TokenType.OBJECT_ACCESS]) {
                if (TokenType[this.NextType] != TokenType[TokenType.L_PAREN])
                    exp1 = new Expression(ExpressionType.OBJECT_ACCESSOR, this.Pop().AccessKey);
                else {
                    var accessor: string[] = this.Pop().AccessKey;

                    if (TokenType[this.CurrentType] != TokenType[TokenType.L_PAREN]) {
                        glob.MISSING_L_PAREN_TOKEN("Getting instead : " + TokenType[this.CurrentType]);
                        return null;
                    }

                    this.Pop();
                    var parameters: Expression[] = this.ParseFunctionParameters();

                    exp1 = new Expression(ExpressionType.FUNCTION, accessor, parameters);
                }
            } else if (TokenType[this.CurrentType] == TokenType[TokenType.FUNCTION]) {
                this.Pop();
                var fun: Function_ = this.ParseFunction();

                exp1 = new Expression(ExpressionType.FUNCTION_DECLARATION, fun);
            } else
                return null;

            if (Parser.IsExpressionOperator(this.CurrentType)) {
                var type: ExpressionType = Parser.GetExpressionOperator(this.CurrentType);
                this.Pop();
                var exp2: Expression = this.ParseExpression();
                if (exp2 == null) {
                    glob.ERROR_PARSING_EXPRESSION();
                    return null;
                } else
                    return new Expression(type, exp1, exp2);
            } else
                return exp1;
        }

        private ParseFunction(): Function_ {
            var name = "";

            if (TokenType[this.CurrentType] == TokenType[TokenType.ALPHANUMERIC])
                name = this.Pop().Value;

            if (TokenType[this.CurrentType] != TokenType[TokenType.L_PAREN])
                return null;

            this.Pop();
            var parameters: string[] = [];

            while (TokenType[this.CurrentType] == TokenType[TokenType.ALPHANUMERIC]) {
                parameters.push(this.Pop().Value);
                if (TokenType[this.CurrentType] == TokenType[TokenType.COMMA])
                    this.Pop();
            }

            if (TokenType[this.CurrentType] != TokenType[TokenType.R_PAREN]) {
                glob.MISSING_R_PAREN_TOKEN("Getting instead : " + TokenType[this.CurrentType]);
                return null;
            }

            this.Pop();

            if (TokenType[this.CurrentType] != TokenType[TokenType.L_BRACE]) {
                glob.MISSING_L_BRACE_TOKEN("Getting instead : " + TokenType[this.CurrentType]);
                return null;
            }

            this.Pop();

            var st: Statements = this.ParseStatements();
            var returnValue: Expression = null;

            if (TokenType[this.CurrentType] == TokenType[TokenType.RETURN]) {
                this.Pop();
                returnValue = this.ParseExpression();
                if (TokenType[this.CurrentType] != TokenType[TokenType.SEMI]) {
                    glob.MISSING_SEMICOLON_TOKEN("Getting instead : " + TokenType[this.CurrentType]);
                    return null;
                }

                this.Pop();
            }

            if (TokenType[this.CurrentType] != TokenType[TokenType.R_BRACE]) {
                glob.MISSING_R_BRACE_TOKEN("Getting instead : " + TokenType[this.CurrentType]);
                return null;
            }

            this.Pop();
            return new Function_(name, st, parameters, returnValue);
        }

        public ParseFunctionParameters(): Expression[] {
            var par: Expression[] = [];

            while (TokenType[this.CurrentType] != TokenType[TokenType.R_PAREN]) {
                var exp: Expression = this.ParseExpression();
                if (exp == null) {
                    glob.ERROR_PARSING_EXPRESSION();
                    return null;
                }

                par.push(exp);

                if (TokenType[this.CurrentType] == TokenType[TokenType.COMMA])
                    this.Pop();
            }

            // Removes R_PAREN
            this.Pop();
            return par;
        }

        public static GetExpressionOperator(type: TokenType): ExpressionType {
            switch (type) {
                case (TokenType.PLUS):
                    return ExpressionType.PLUS;
                case (TokenType.MINUS):
                    return ExpressionType.MINUS;
                case (TokenType.TIMES):
                    return ExpressionType.TIMES;
                case (TokenType.SLASH):
                    return ExpressionType.DIVISION;
                case (TokenType.AND):
                    return ExpressionType.AND;
                case (TokenType.OR):
                    return ExpressionType.OR;
                case (TokenType.DISEQUAL):
                    return ExpressionType.DISEQUAL;
                case (TokenType.EQUAL):
                    return ExpressionType.EQUAL;
                case (TokenType.LESS):
                    return ExpressionType.LESS;
                case (TokenType.LESS_OR_EQUAL):
                    return ExpressionType.LESS_OR_EQUAL;
                case (TokenType.GREATER):
                    return ExpressionType.GREATER;
                case (TokenType.GREATER_OR_EQUAL):
                    return ExpressionType.GREATER_OR_EQUAL;
                default:
                    throw new ParsingError();
            }
        }

        public static IsExpressionOperator(currentType: TokenType): boolean {
            try {
                Parser.GetExpressionOperator(currentType);
                return true;
            } catch (ParsingError) {
                return false;
            }
        }
    }
    class ParsingError {
    }
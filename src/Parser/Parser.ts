module Parsing {
    export class Parser {
        private tokens: Lexing.Token[];

        private get CurrentType(): Lexing.TokenType {
            if (this.tokens.length > 0)
                return this.tokens[0].Type;
            else
                return Lexing.TokenType.END;
        }

        private get NextType(): Lexing.TokenType {
            if (this.tokens.length > 1)
                return this.tokens[1].Type;
            else
                return Lexing.TokenType.END;
        }

        private Pop(n?): Lexing.Token {
            if (n) {
                var last: Lexing.Token = null;

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

        public Parse(tokens: Lexing.Token[]): Program {
            this.tokens = tokens;

            if (GLOB.VERBOSE) {
                var str = ""
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
            while (this.CurrentType == Lexing.TokenType.LINE_END)
                this.Pop();

            var type: Lexing.TokenType = this.CurrentType;

            if (type == Lexing.TokenType.FUNCTION) {
                this.Pop();
                var fun: Function_ = this.ParseFunction();
                return new Statement(StatementType.FUNCTION_DECLARATION, fun);

                // If then, if then else
            } else if (type == Lexing.TokenType.IF) {
                this.Pop();
                var cnd: Condition = this.ParseCondition();

                if (this.CurrentType != Lexing.TokenType.L_BRACE) {
                    GLOB.MISSING_L_BRACE_TOKEN("Getted instead " + this.CurrentType);
                    return null;
                }

                this.Pop();
                var st1: Statements = this.ParseStatements();

                if (this.CurrentType != Lexing.TokenType.R_BRACE) {
                    GLOB.MISSING_R_BRACE_TOKEN("Getted instead " + this.CurrentType);
                    return null;
                }

                this.Pop();

                if (this.CurrentType == Lexing.TokenType.ELSE) {
                    this.Pop();

                    if (this.CurrentType != Lexing.TokenType.L_BRACE) {
                        GLOB.MISSING_L_BRACE_TOKEN("Getted instead " + this.CurrentType);
                        return null;
                    }

                    this.Pop();

                    var st2: Statements = this.ParseStatements();

                    if (this.CurrentType != Lexing.TokenType.R_BRACE) {
                        GLOB.MISSING_R_BRACE_TOKEN("Getted instead " + this.CurrentType);
                        return null;
                    }

                    this.Pop();

                    return new Statement(StatementType.IF_THEN_ELSE, cnd, st1, st2);
                } else
                    return new Statement(StatementType.IF_THEN, cnd, st1);

                // while
            } else if (type == Lexing.TokenType.WHILE) {
                this.Pop();
                var cnd: Condition = this.ParseCondition();

                if (this.CurrentType != Lexing.TokenType.L_BRACE)
                    return null;

                this.Pop();
                var st: Statements = this.ParseStatements();

                if (this.CurrentType != Lexing.TokenType.R_BRACE)
                    return null;
                this.Pop();

                return new Statement(StatementType.WHILE, cnd, st);

            } else if (type == Lexing.TokenType.RETURN) {
                this.Pop();

                var returnValue: Expression = this.ParseExpression();

                if (this.CurrentType != Lexing.TokenType.SEMI)
                    return null;

                this.Pop();
                return new Statement(StatementType.RETURN, returnValue);

                // var, alphanumeric or alphanumeric ()
            } else {
                if (this.NextType != Lexing.TokenType.L_PAREN) {
                    var asg: Assignment = this.ParseAssignment();
                    if (asg == null) 
                        return null;
                    else
                        return new Statement(StatementType.ASSIGN, asg);;
                } else {
                    var exp: Expression = this.ParseExpression();
                    if (exp == null) {
                        GLOB.ERROR_PARSING_EXPRESSION();
                        return null;
                    }
                    else {
                        if (this.CurrentType != Lexing.TokenType.SEMI) {
                            GLOB.MISSING_SEMICOLON_TOKEN();
                            return null;
                        }
                        this.Pop();
                        return new Statement(StatementType.FUNCTION, exp);
                    }

                }
            }
        }

        private ParseCondition(): Condition {
            if (this.CurrentType != Lexing.TokenType.L_PAREN) {
                GLOB.MISSING_L_PAREN_TOKEN("Getting instead : " + this.CurrentType);
                return null;
            }

            this.Pop();
            var exp: Expression = this.ParseExpression();

            if (exp == null) {
                GLOB.ERROR_PARSING_EXPRESSION();
                return null;
            } else if (this.CurrentType != Lexing.TokenType.R_PAREN) {
                GLOB.MISSING_R_PAREN_TOKEN
                return null;
        }
            this.Pop();

            return new Condition(exp);
        }

        private ParseAssignment(): Assignment {
            if (this.CurrentType == Lexing.TokenType.DECLARE) {
                this.Pop();

                if (this.CurrentType != Lexing.TokenType.ALPHANUMERIC) {
                    GLOB.ERROR_EXPECTED_ALPHANUMERIC(this.CurrentType);
                    return null;
                }

                var word: string = this.Pop().Value;

                if (this.CurrentType == Lexing.TokenType.SEMI) {
                    this.Pop();
                    return new Assignment(word, false);
                } else if (this.CurrentType == Lexing.TokenType.ASSIGN) {
                    this.Pop();
                    var exp: Expression = this.ParseExpression();

                    if (exp == null) {
                        GLOB.ERROR_PARSING_EXPRESSION();
                        return null;
                    } else if (this.CurrentType != Lexing.TokenType.SEMI) {
                        GLOB.MISSING_SEMICOLON_TOKEN(this.CurrentType);
                        return null;
                    }

                    this.Pop();
                    return new Assignment(word, exp, false);
                } else
                    return null;
            } else if (this.CurrentType == Lexing.TokenType.ALPHANUMERIC) {
                var word: string = this.Pop().Value;

                if (this.CurrentType != Lexing.TokenType.ASSIGN) {
                    GLOB.MISSING_ASSIGN_TOKEN(this.CurrentType);
                    return null;
                }

                this.Pop();

                var exp: Expression = this.ParseExpression();

                if (exp == null) {
                    GLOB.ERROR_PARSING_EXPRESSION();
                    return null;
                } else if (this.CurrentType != Lexing.TokenType.SEMI) {
                    GLOB.MISSING_SEMICOLON_TOKEN(this.CurrentType);
                    return null;
                }

                this.Pop();
                return new Assignment(word, exp, true);
            } else if (this.CurrentType == Lexing.TokenType.OBJECT_ACCESS) {
                var accessor: string[] = this.Pop().AccessKey;
                
                if (this.CurrentType != Lexing.TokenType.ASSIGN) {
                    GLOB.MISSING_ASSIGN_TOKEN();
                    return null;
                }

                this.Pop();

                var exp: Expression = this.ParseExpression();

                if (exp == null) {
                    GLOB.ERROR_PARSING_EXPRESSION();
                    return null
                } else if (this.CurrentType != Lexing.TokenType.SEMI) {
                    GLOB.MISSING_SEMICOLON_TOKEN(this.tokens);
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
            if (this.CurrentType == Lexing.TokenType.L_PAREN) {
                this.Pop();
                exp1 = this.ParseExpression();
                if (this.CurrentType != Lexing.TokenType.R_PAREN) {
                    GLOB.MISSING_R_PAREN_TOKEN("Getting instead : " + this.CurrentType);
                    return null;
                }

                this.Pop();
                // Identifier case
            } else if (this.CurrentType == Lexing.TokenType.ALPHANUMERIC) {
                var id: Lexing.Token = this.Pop();
                if (this.CurrentType == Lexing.TokenType.L_PAREN) {
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
            } else if ((this.CurrentType == Lexing.TokenType.NUMBER) ||
                ((this.NextType == Lexing.TokenType.NUMBER) &&
                ((this.CurrentType == Lexing.TokenType.PLUS) ||
                (this.CurrentType == Lexing.TokenType.MINUS)))) {

                var cur: Lexing.Token = this.Pop();
                var sign = 1;

                if (cur.Type == Lexing.TokenType.PLUS)
                    cur = this.Pop();
                else if (cur.Type == Lexing.TokenType.MINUS) {
                    cur = this.Pop();
                    sign = -1;
                }

                var value: Runtime.ExpressionValue = new Runtime.ExpressionValue(
                    Runtime.ExpressionValueType.NUMBER,
                    sign * Runtime.Evaluator.ToNumber(cur.Value)
                    );

                exp1 = new Expression(ExpressionType.INTEGER, value);
                // Boolean case
            } else if (this.CurrentType == Lexing.TokenType.TRUE || this.CurrentType == Lexing.TokenType.FALSE) {
                var value: Runtime.ExpressionValue = new Runtime.ExpressionValue(
                    Runtime.ExpressionValueType.BOOLEAN,
                    Runtime.Evaluator.ToBool(this.Pop().Value)
                    );
                exp1 = new Expression(ExpressionType.BOOL, value);
                // String case
            } else if (this.CurrentType == Lexing.TokenType.QUOTE) {
                this.Pop();

                if (this.CurrentType != Lexing.TokenType.ALPHANUMERIC)
                    return null;

                var str: Lexing.Token = this.Pop();
                if (this.CurrentType != Lexing.TokenType.QUOTE) {
                    GLOB.MISSING_QUOTE_TOKEN("Getting instead : " + this.CurrentType);
                    return null;
                }

                this.Pop();

                var value: Runtime.ExpressionValue = new Runtime.ExpressionValue(
                    Runtime.ExpressionValueType.STRING,
                    str.Value
                    );
                exp1 = new Expression(
                    ExpressionType.STRING,
                    value
                    );
                // Expression combination case
            } else if (this.CurrentType == Lexing.TokenType.L_BRACE && this.NextType == Lexing.TokenType.R_BRACE) {
                this.Pop(2);
                return new Expression(ExpressionType.OBJECT);
            } else if (this.CurrentType == Lexing.TokenType.OBJECT_ACCESS) {
                if (this.NextType != Lexing.TokenType.L_PAREN)
                    exp1 = new Expression(ExpressionType.OBJECT_ACCESSOR, this.Pop().AccessKey);
                else {
                    var accessor: string[] = this.Pop().AccessKey;

                    if (this.CurrentType != Lexing.TokenType.L_PAREN) {
                        GLOB.MISSING_L_PAREN_TOKEN("Getting instead : " + this.CurrentType);
                        return null;
                    }

                    this.Pop();
                    var parameters: Expression[] = this.ParseFunctionParameters();

                    exp1 = new Expression(ExpressionType.FUNCTION, accessor, parameters);
                }
            } else if (this.CurrentType == Lexing.TokenType.FUNCTION) {
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
                    GLOB.ERROR_PARSING_EXPRESSION();
                    return null;
                } else
                    return new Expression(type, exp1, exp2);
            } else
                return exp1;
        }

        private ParseFunction(): Function_ {
            var name = "";

            if (this.CurrentType == Lexing.TokenType.ALPHANUMERIC)
                name = this.Pop().Value;

            if (this.CurrentType != Lexing.TokenType.L_PAREN)
                return null;

            this.Pop();
            var parameters: string[] = [];

            while (this.CurrentType == Lexing.TokenType.ALPHANUMERIC) {
                parameters.push(this.Pop().Value);
                if (this.CurrentType == Lexing.TokenType.COMMA)
                    this.Pop();
            }

            if (this.CurrentType != Lexing.TokenType.R_PAREN) {
                GLOB.MISSING_R_PAREN_TOKEN("Getting instead : " + this.CurrentType);
                return null;
            }

            this.Pop();

            if (this.CurrentType != Lexing.TokenType.L_BRACE) {
                GLOB.MISSING_L_BRACE_TOKEN("Getting instead : " + this.CurrentType);
                return null;
            }

            this.Pop();

            var st: Statements = this.ParseStatements();
            var returnValue: Expression = null;

            if (this.CurrentType == Lexing.TokenType.RETURN) {
                this.Pop();
                returnValue = this.ParseExpression();
                if (this.CurrentType != Lexing.TokenType.SEMI) {
                    GLOB.MISSING_SEMICOLON_TOKEN("Getting instead : " + this.CurrentType);
                    return null;
                }

                this.Pop();
            }

            if (this.CurrentType != Lexing.TokenType.R_BRACE) {
                GLOB.MISSING_R_BRACE_TOKEN("Getting instead : " + this.CurrentType);
                return null;
            }

            this.Pop();
            return new Function_(name, st, parameters, returnValue);
        }

        public ParseFunctionParameters(): Expression[] {
            var par: Expression[] = [];

            while (this.CurrentType != Lexing.TokenType.R_PAREN) {
                var exp: Expression = this.ParseExpression();
                if (exp == null) {
                    GLOB.ERROR_PARSING_EXPRESSION();
                    return null;
                }

                par.push(exp);

                if (this.CurrentType == Lexing.TokenType.COMMA)
                    this.Pop();
            }

            // Removes R_PAREN
            this.Pop();
            return par;
        }

        public static GetExpressionOperator(type: Lexing.TokenType): ExpressionType {
            switch (type) {
                case (Lexing.TokenType.PLUS):
                    return ExpressionType.PLUS;
                case (Lexing.TokenType.MINUS):
                    return ExpressionType.MINUS;
                case (Lexing.TokenType.TIMES):
                    return ExpressionType.TIMES;
                case (Lexing.TokenType.SLASH):
                    return ExpressionType.DIVISION;
                case (Lexing.TokenType.AND):
                    return ExpressionType.AND;
                case (Lexing.TokenType.OR):
                    return ExpressionType.OR;
                case (Lexing.TokenType.DISEQUAL):
                    return ExpressionType.DISEQUAL;
                case (Lexing.TokenType.EQUAL):
                    return ExpressionType.EQUAL;
                case (Lexing.TokenType.LESS):
                    return ExpressionType.LESS;
                case (Lexing.TokenType.LESS_OR_EQUAL):
                    return ExpressionType.LESS_OR_EQUAL;
                case (Lexing.TokenType.GREATER):
                    return ExpressionType.GREATER;
                case (Lexing.TokenType.GREATER_OR_EQUAL):
                    return ExpressionType.GREATER_OR_EQUAL;
                default:
                    throw new ParsingError();
            }
        }

        public static IsExpressionOperator(currentType: Lexing.TokenType): boolean {
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
}
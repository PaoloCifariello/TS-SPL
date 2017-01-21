

import {Statements} from "./Statements";
import {Assignment} from "./Assignment";
import {Expression} from "./Expression";
import {Function_} from "./Function_";
import {Condition} from "./Condition";

export enum StatementType {
    FUNCTION,

    FUNCTION_DECLARATION,
    IF_THEN,
    IF_THEN_ELSE,
    WHILE,
    ASSIGN,

    RETURN
}
export class Statement {
    private type: StatementType;
    private condition: Condition;
    private statements1: Statements;
    private statements2: Statements;
    private assignment: Assignment;
    private function: Expression;
    private functionDeclaration: Function_;
    private returnValue: Expression;

    public get Type(): StatementType {
        return this.type;
    }

    public get ConditionExpression(): Expression {
        return this.condition.Expression;
    }

    public get Assignment(): Assignment {
        return this.assignment;
    }

    public get Statement1(): Statements {
        return this.statements1;
    }

    public get Statement2(): Statements {
        return this.statements2;
    }

    public get Function(): Expression {
        return this.function;
    }

    public get FunctionDeclaration(): Function_ {
        return this.functionDeclaration;
    }

    public get ReturnValue(): Expression {
        return this.returnValue;
    }

    constructor(type: StatementType, param1?, param2?, param3?) {
        this.type = type;

        switch (param1.constructor) {
            case Expression:
                {
                    if (type == StatementType.RETURN)
                        this.returnValue = param1;
                    else
                        this.function = param1;
                    break;
                }
            case Function_:
                {
                    this.functionDeclaration = param1;
                    break;
                }
            case Assignment:
                {
                    this.assignment = param1;
                    break;
                }
            case Condition:
                {
                    this.condition = param1;
                    this.statements1 = param2;
                    this.statements2 = param3;
                    break;
                }
        }
    }

    public Print() {
        console.log(this.type);
    }
}
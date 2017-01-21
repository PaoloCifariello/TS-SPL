
import {Function_} from "./Function_";
import {Token} from "../Lexer/Token";
import {ExpressionValue} from "../Virtualmachine/ExpressionValue";

export enum ExpressionType {
    FUNCTION_DECLARATION,

    OBJECT_ACCESSOR,

    OBJECT,

    FUNCTION,

    // Integer
    IDENTIFIER,
    BOOL,
    STRING,
    INTEGER,
    // Operations
    PLUS,
    MINUS,
    TIMES,
    DIVISION,

    AND,
    OR,
    DISEQUAL,
    EQUAL,
    LESS,
    GREATER,
    LESS_OR_EQUAL,
    GREATER_OR_EQUAL
}

export class Expression {

    private type: ExpressionType;
    private tokens: Token[];
    private exp1: Expression;
    private exp2: Expression;
    private functionName: string;
    private parameters: Expression[];
    private accessorKey: string[];
    private function: Function_;
    private evaluatedValue: ExpressionValue;

    public get Type(): ExpressionType {
        return this.type;
    }

    public get Value(): string {
        return this.tokens[0].Value;
    }

    public get Expression1(): Expression {
        return this.exp1;
    }

    public get Expression2(): Expression {
        return this.exp2;
    }

    public get FunctionName(): string {
        return this.functionName;
    }

    public get Parameters(): Expression[] {
        return this.parameters;
    }

    public get AccessKey(): string[] {
        return this.accessorKey;
    }

    public get Function(): Function_ {
        return this.function;
    }

    public get EvaluatedValue(): ExpressionValue {
        return this.evaluatedValue;
    }

    constructor(type: ExpressionType, param1?, param2?) {
        this.type = type;

        if (param1) {
            switch (param1.constructor) {
                case ExpressionValue:
                    {
                        this.evaluatedValue = param1;
                        break;
                    }
                case Function_:
                    {
                        this.function = param1;
                        break;
                    }
                case Array:
                    {
                        this.accessorKey = param1;
                        this.parameters = param2;
                        break;
                    }
                case String:
                    {
                        this.functionName = param1;
                        this.parameters = param2;
                        break;
                    }
                case Token:
                    {
                        this.tokens = [param1];
                        break;
                    }
                case Expression:
                    {
                        this.exp1 = param1;
                        this.exp2 = param2;
                        break;
                    }
            }
        }
    }
}
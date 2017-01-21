import {Expression} from "./Expression";

export class Condition {
    private expression: Expression;

    public get Expression(): Expression {
        return this.expression;
    }

    constructor(exp: Expression) {
        this.expression = exp;
    }
}
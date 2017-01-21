
import {Expression} from "./Expression";

export class Assignment {
    private variable: string;
    private value: Expression;
    private global: boolean;
    private simple: boolean;
    private accesKey: string[];

    public get IsGlobal(): boolean {
        return this.global;
    }

    public get IsSimple(): boolean {
        return this.simple;
    }

    public get Variable(): string {
        return this.variable;
    }

    public get Value(): Expression {
        return this.value;
    }

    public get AccesKey(): string[] {
        return this.accesKey;
    }

    constructor(variable, value, global?) {
        if (typeof (variable) === "string") {
            this.variable = variable;
            this.simple = true;
        } else if (typeof (variable) === "object") {
            this.accesKey = variable;
            this.simple = false;
        }

        if (typeof (value) === "boolean")
            this.global = value;
        else {
            this.global = global;
            this.value = value;
        }
    }
}
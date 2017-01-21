import {Statements} from "./Statements";
import {Statement} from "./Statement";

export class Program
{
    private statements: Statements;

    public get Length(): number {
        return this.statements.Length;
    }

    public get Statements(): Statements {
        return this.statements;
    }

    constructor(statements?: Statements){
        this.statements = (statements)?statements : new Statements();
    }

    public AddStatements(stat: Statements) {
        this.statements.AddStatements(stat);
    }

    public AddStatement(stat: Statement)
    {
        this.statements.AddStatement(stat);
    }

    public GetStatement(index: number): Statement {
        return this.statements.GetStatement(index);
    }

    public Print() {
        this.statements.Print();
    }
}
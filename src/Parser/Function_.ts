
    import {Statements} from "./Statements";
    import {Expression} from "./Expression";

    export class Function_ {
        private Name: string;
        private Parameters: string[];
        private innerStatements: Statements;

        public get Identifier(): string {
            return this.Name;
        }

        public get ParametersNames(): string[] {
            return this.Parameters;
        }

        public get InnerStatements(): Statements {
            return this.innerStatements;
        }

        constructor(name: string, inner: Statements, parameters: string[], returnValue: Expression) {
            this.Name = name;
            this.Parameters = parameters;
            this.innerStatements = inner;
        }
    }
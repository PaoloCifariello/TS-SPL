module Parsing
{
	export class Statements
	{
        private statemets: Statement[] = [];

        public get Length(): number {
            return this.statemets.length;
        }

        public AddStatement(st: Statement) {
            this.statemets.push(st);
        }

        public AddStatements(st: Statements) {
            var self = this;
            st.statemets.forEach(el => self.statemets.push(el));
        }

        public GetStatement(index: number): Statement {
            if (index < this.statemets.length)
                return this.statemets[index];
            else
                return null;
        }

        public Print() {
            this.statemets.forEach(function (st, i) {
                console.log("Statement " + i + ": ");
                st.Print();
            });
        }
	}
	
} 
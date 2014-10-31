module Interpreting
{
	export class Interpreter
	{
        private lexer: Lexing.Lexer ;
        private parser: Parsing.Parser;
        private vm: Runtime.VirtualMachine;
        private program: Parsing.Program ;

        public constructor(param1, directory? : string) {
            this.parser = new Parsing.Parser();
            this.vm = new Runtime.VirtualMachine(directory ? directory : '/');

            switch (param1.constructor) {
                case String:
                    {
                        this.lexer = new Lexing.Lexer(param1);
                        break;
                    }
                case Lexing.Lexer:
                    {
                        this.lexer = param1;
                        break;
                    }
            }
        }

        public static FromFile(path: string): Interpreter 
		{
            var dirPath = path.substr(0, path.lastIndexOf('/'));
            return new Interpreter(Lexing.Lexer.FromFile(path), dirPath);
		}

        public Init()
		{
            this.lexer.Tokenize();
            this.program = this.parser.Parse(this.lexer.Tokens);

            if (this.program == null) {
                GLOB.ERROR_PARSING_PROGRAM();
            }
		}

        public Run() {
            this.vm.Execute(this.program);
        }

        public RunAsModule(): Runtime.ExpressionValue {
            this.vm.Environment.Modify("exports", new Runtime.ExpressionValue(Runtime.ExpressionValueType.OBJECT));
            this.vm.Execute(this.program);
            return <Runtime.ExpressionValue> this.vm.Environment.Get("exports");
        }
	}
}
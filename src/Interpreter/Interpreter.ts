import {glob} from "../global";
import {Lexer} from "../Lexer/Lexer";
import {VirtualMachine} from "../Virtualmachine/VirtualMachine";
import {Parser} from "../Parser/Parser";
import {Program} from "../Parser/Program";
import {ExpressionValue, ExpressionValueType} from "../Virtualmachine/ExpressionValue";

export class Interpreter
{
    private lexer: Lexer ;
    private parser: Parser;
    private vm: VirtualMachine;
    private program: Program ;


    public constructor(param1?, directory? : string) {
        this.parser = new Parser();
        this.vm = new VirtualMachine(directory ? directory : '/');

        if (!param1) {
            this.parser = new Parser();
            this.vm = new VirtualMachine();

        } else {
            switch (param1.constructor) {
                case String:
                {
                    this.lexer = new Lexer(param1);
                    break;
                }
                case Lexer:
                {
                    this.lexer = param1;
                    break;
                }
            }
        }
    }

    public getNextInput(scode: string) {
        this.lexer = new Lexer (scode);
    }

    public static FromFile(path: string): Interpreter
    {
        var dirPath = path.substr(0, path.lastIndexOf('/'));
        return new Interpreter(Lexer.FromFile(path), dirPath);
    }

    public Init()
    {
        this.lexer.Tokenize();
        this.program = this.parser.Parse(this.lexer.Tokens);

        if (this.program == null) {
            glob.ERROR_PARSING_PROGRAM();
        }
    }

    public Run()
    {
        this.vm.Execute(this.program);
    }

    public RunAsModule(): ExpressionValue
    {
        this.vm.Environment.Modify("exports", new ExpressionValue(ExpressionValueType.OBJECT));
        this.vm.Execute(this.program);
        return <ExpressionValue> this.vm.Environment.Get("exports");
    }
}
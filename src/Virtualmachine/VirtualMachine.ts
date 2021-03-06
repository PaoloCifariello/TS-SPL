﻿
import {ExpressionValue, ExpressionValueType} from "./ExpressionValue";
import {Evaluator} from "./Evaluator";
import {Environment} from "./Environment";
import {Program} from "../Parser/Program";
import {Statements} from "../Parser/Statements";
import {Statement, StatementType} from "../Parser/Statement";
import {glob} from "../global";
import {Function_} from "../Parser/Function_";
import {Expression} from "../Parser/Expression";
import {Assignment} from "../Parser/Assignment";
import {Interpreter} from "../Interpreter/Interpreter";

export class VirtualMachine {
    private env: Environment;
    private evaluator: Evaluator;
    private CurrentPath: string;

    public get Environment(): Environment {
        return this.env;
    }

    constructor(path?: string) {
        this.env = new Environment();
        this.evaluator = new Evaluator(this);
        this.CurrentPath = path;
    }

    public Execute(program: Program) {
        this.ExecuteStatements(program.Statements);
    }

    private ExecuteStatements(statements: Statements, env?: Environment): ExpressionValue {
        if (!env)
            env = this.Environment;

        var ret: ExpressionValue;
        for (var i = 0; i < statements.Length; i++) {
            var cur = statements.GetStatement(i),
                ret = this.ExecuteStatement(statements.GetStatement(i), env);

            if (ret != null && cur.Type === StatementType.RETURN)
                return ret;
        }

        return null;
    }

    private ExecuteStatement(statement: Statement, env?: Environment): ExpressionValue {
        if (!env)
            env = this.env;

        switch (statement.Type) {
            case StatementType.ASSIGN:
                {
                    if (glob.VERBOSE)
                        glob.EXECUTING_ASSIGN_STATE(statement.Assignment);

                    this.Assign(statement.Assignment);
                    return null;
                }
            case StatementType.IF_THEN:
                {
                    if (glob.VERBOSE)
                        glob.EXECUTING_IF_THEN_STATE(statement.ConditionExpression);

                    var value = this.evaluator.Evaluate(statement.ConditionExpression, this.Environment);
                    if (value.Bool == true)
                        return this.ExecuteStatements(statement.Statement1);
                    return null;
                }
            case StatementType.IF_THEN_ELSE:
                {
                    if (glob.VERBOSE)
                        glob.EXECUTING_IF_THEN_ELSE_STATE(statement.ConditionExpression);

                    var value = this.evaluator.Evaluate(statement.ConditionExpression, this.Environment);
                    if (value.Bool == true)
                        return this.ExecuteStatements(statement.Statement1);
                    else
                        return this.ExecuteStatements(statement.Statement2);
                }
            case StatementType.WHILE:
                {
                    if (glob.VERBOSE)
                        glob.EXECUTING_WHILE_STATE(statement.ConditionExpression);

                    var value = this.evaluator.Evaluate(statement.ConditionExpression, this.Environment);

                    while (value.Bool === true) {
                        this.ExecuteStatements(statement.Statement1);
                        value = this.evaluator.Evaluate(statement.ConditionExpression, this.Environment);
                    }

                    return null;
                }
            case StatementType.FUNCTION_DECLARATION:
                {
                    if (glob.VERBOSE)
                        glob.EXECUTING_FUN_DECLARATION_STATE(statement.FunctionDeclaration);

                    this.DeclareFunction(statement.FunctionDeclaration);
                    return null;
                }
            case StatementType.FUNCTION:
                {
                    if (glob.VERBOSE)
                        glob.EXECUTING_FUN_EXECUTION_STATE(statement.Function);

                    return this.ExecuteFunction(statement.Function);
                }
            case StatementType.RETURN:
                {
                    if (glob.VERBOSE)
                        glob.EXECUTING_RETURN_STATE(statement.ReturnValue);

                    return this.evaluator.Evaluate(statement.ReturnValue, this.Environment);
                }
        }

        return null;
    }

    public DeclareFunction(fun: Function_) {
        this.env.Declcare(
            fun.Identifier,
            new ExpressionValue(ExpressionValueType.FUNCTION, fun)
            );
    }

    public ExecuteFunction(fun: Expression): ExpressionValue {
        var f: Function_ = null,
            obj: ExpressionValue = null,
            last: ExpressionValue = null;

        if (fun.AccessKey == null) {
            var ev = <ExpressionValue> this.env.Get(fun.FunctionName);

            if (ev)
                f = ev.Function;
        } else {
            var accessor = fun.AccessKey;

            obj = <ExpressionValue> this.env.Get(accessor[0]);

            for (var i = 1; i < accessor.length; i++) {
                last = obj;
                obj = obj.GetProperty(accessor[i]);
            }
            f = obj.Function;

        }


        if (f == null) {
            if (this.IsSystemFunction(fun.FunctionName)) {
                return this.ExecuteSystemFunction(fun);
            } else
                return null;
        }

        this.env.PushEnvironment();
        for (var i = 0; i < fun.Parameters.length; i++) {
            this.env.Declcare(
                f.ParametersNames[i],
                this.evaluator.Evaluate(fun.Parameters[i], this.env)
                );
        }

        if (obj != null)
            this.env.Declcare("this", last);

        var ev = this.ExecuteStatements(f.InnerStatements);
        this.env.PopEnvironment();
        return ev;
    }

    private Assign(assignment: Assignment) {
        if (assignment.IsSimple) {
            if (assignment.IsGlobal)
                this.env.Modify(
                    assignment.Variable,
                    this.evaluator.Evaluate(assignment.Value, this.env)
                    );
            else {
                this.env.Declcare(
                    assignment.Variable,
                    this.evaluator.Evaluate(assignment.Value, this.env)
                    );
            }
        } else {
            var accessor = assignment.AccesKey;
            var MainObject = <ExpressionValue> this.env.Get(accessor[0]);

            for (var i = 1; i < accessor.length - 1; i++) {
                MainObject = MainObject.GetProperty(accessor[i]);
            }

            MainObject.SetProperty(
                accessor[accessor.length - 1],
                this.evaluator.Evaluate(assignment.Value, this.env)
                );
        }
    }

    public IsSystemFunction(functionName: string): boolean {
        return (functionName == "print") || (functionName == "require");
    }

    private ExecuteSystemFunction(fun: Expression): ExpressionValue {
        // Print function
        if (fun.FunctionName == "print") {

            var val = this.evaluator.Evaluate(fun.Parameters[0], this.env);
            if (val.IsInt)
                console.log(val.Number);
            else if (val.IsBool)
                console.log(val.Bool);
            else if (val.IsString)
                console.log(val.String);
            else if (val.IsFunction)
                console.log("Function " + val.Function.Identifier);
            else if (val.IsObject)
                console.log("Object");
            else
                console.log("undefined");

            return null;
            // Require function
        } else if (fun.FunctionName == "require") {
            if (fun.Parameters.length != 1)
                return null;

            var fileName = this.evaluator.Evaluate(fun.Parameters[0], this.env);

            if (!fileName.IsString)
                return null;

            var i = Interpreter.FromFile(this.CurrentPath + '/' + fileName.String);
            i.Init();
            var v = i.RunAsModule();
            return <ExpressionValue> v;
        } else
            return null;
    }
}
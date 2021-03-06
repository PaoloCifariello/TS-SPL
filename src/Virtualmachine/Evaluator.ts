import {ExpressionValue, ExpressionValueType} from "./ExpressionValue";
import {Environment} from "./Environment";
import {Expression, ExpressionType} from "../Parser/Expression";
import {VirtualMachine} from "./VirtualMachine";

export class Evaluator {
    private vm: VirtualMachine;

    constructor(vm: VirtualMachine) {
        this.vm = vm;
    }

    public Evaluate(exp: Expression, env: Environment): ExpressionValue {
        if (exp == null)
            return new ExpressionValue(ExpressionValueType.BOOLEAN, false);

        switch (exp.Type) {
            case (ExpressionType.FUNCTION):
                {
                    return this.vm.ExecuteFunction(exp);
                }
            case (ExpressionType.FUNCTION_DECLARATION):
                {
                    return new ExpressionValue(ExpressionValueType.FUNCTION, exp.Function);
                }
            case (ExpressionType.OBJECT):
                {
                    return new ExpressionValue(ExpressionValueType.OBJECT);
                }
            case (ExpressionType.OBJECT_ACCESSOR):
                {
                    var accessor: string[] = exp.AccessKey;
                    var v = <ExpressionValue> env.Get(accessor[0]);

                    for (var i = 1; i < accessor.length; i++)
                        v = v.GetProperty(accessor[i]);

                    return v;
                }
            case (ExpressionType.IDENTIFIER):
                {
                    var id: string = exp.Value;

                    var a = <ExpressionValue> env.Get(id);
                    return a;
                }
            case (ExpressionType.BOOL):
                {
                    return exp.EvaluatedValue;
                }
            case (ExpressionType.STRING):
                {
                    return exp.EvaluatedValue;
                }
            case (ExpressionType.INTEGER):
                {
                    return exp.EvaluatedValue;
                }
            case (ExpressionType.PLUS):
                {
                    var v1 = this.Evaluate(exp.Expression1, env);
                    var v2 = this.Evaluate(exp.Expression2, env);

                    if (v1.IsString)
                        return new ExpressionValue(ExpressionValueType.STRING, v1.String + v2.String);
                    else
                        return new ExpressionValue(ExpressionValueType.NUMBER, v1.Number + v2.Number);
                }

            case (ExpressionType.MINUS):
                {
                    var v1 = this.Evaluate(exp.Expression1, env);
                    var v2 = this.Evaluate(exp.Expression2, env);

                    return new ExpressionValue(ExpressionValueType.NUMBER, v1.Number - v2.Number);
                }

            case (ExpressionType.TIMES):
                {
                    var v1 = this.Evaluate(exp.Expression1, env);
                    var v2 = this.Evaluate(exp.Expression2, env);

                    return new ExpressionValue(ExpressionValueType.NUMBER, v1.Number * v2.Number);
                }
            case (ExpressionType.DIVISION):
                {
                    var v1 = this.Evaluate(exp.Expression1, env);
                    var v2 = this.Evaluate(exp.Expression2, env);

                    return new ExpressionValue(ExpressionValueType.NUMBER, v1.Number / v2.Number);
                }
            case (ExpressionType.AND):
                {
                    var v1 = this.Evaluate(exp.Expression1, env);
                    var v2 = this.Evaluate(exp.Expression2, env);

                    return new ExpressionValue(ExpressionValueType.BOOLEAN, v1.Bool && v2.Bool);
                }
            case (ExpressionType.OR):
                {
                    var v1 = this.Evaluate(exp.Expression1, env);
                    var v2 = this.Evaluate(exp.Expression2, env);

                    return new ExpressionValue(ExpressionValueType.BOOLEAN, v1.Bool || v2.Bool);
                }
            case (ExpressionType.EQUAL):
                {
                    var v1 = this.Evaluate(exp.Expression1, env);
                    var v2 = this.Evaluate(exp.Expression2, env);

                    return new ExpressionValue(ExpressionValueType.BOOLEAN,
                        (v1.Bool == v2.Bool) && (v1.Number == v2.Number) && (v1.String == v2.String));
                }
            case (ExpressionType.DISEQUAL):
                {
                    var v1 = this.Evaluate(exp.Expression1, env);
                    var v2 = this.Evaluate(exp.Expression2, env);

                    return new ExpressionValue(ExpressionValueType.BOOLEAN,
                        (v1.Bool != v2.Bool) && (v1.Number != v2.Number) && (v1.String != v2.String));
                }

            case (ExpressionType.LESS):
                {
                    var v1 = this.Evaluate(exp.Expression1, env);
                    var v2 = this.Evaluate(exp.Expression2, env);

                    return new ExpressionValue(ExpressionValueType.BOOLEAN, v1.Number < v2.Number);
                }

            case (ExpressionType.GREATER):
                {
                    var v1 = this.Evaluate(exp.Expression1, env);
                    var v2 = this.Evaluate(exp.Expression2, env);

                    return new ExpressionValue(ExpressionValueType.NUMBER, v1.Number > v2.Number);
                }

            case (ExpressionType.LESS_OR_EQUAL):
                {
                    var v1 = this.Evaluate(exp.Expression1, env);
                    var v2 = this.Evaluate(exp.Expression2, env);

                    return new ExpressionValue(ExpressionValueType.NUMBER, v1.Number <= v2.Number);
                }

            case (ExpressionType.GREATER_OR_EQUAL):
                {
                    var v1 = this.Evaluate(exp.Expression1, env);
                    var v2 = this.Evaluate(exp.Expression2, env);

                    return new ExpressionValue(ExpressionValueType.NUMBER, v1.Number >= v2.Number);
                }
            default:
                return null;
        }
    }

    public static ToNumber(value: string): number {
        return parseFloat(value);
    }

    public static ToBool(value: string): boolean {
        return Boolean(value);
    }
}
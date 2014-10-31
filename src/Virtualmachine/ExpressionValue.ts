module Runtime {
    export enum ExpressionValueType {
        OBJECT,
        FUNCTION,

        STRING,
        NUMBER,
        BOOLEAN
    }

    export class ExpressionValue {
        private type: ExpressionValueType;
        private nValue = 0;
        private bValue = false;
        private sValue = "";
        private fValue = new Parsing.Function_("", new Parsing.Statements(), [], null);
        private members: { [v: string]: ExpressionValue };


        public get IsBool(): boolean {
            return this.type == ExpressionValueType.BOOLEAN;
        }

        public get IsInt(): boolean {
            return this.type == ExpressionValueType.NUMBER;
        }

        public get IsString(): boolean {
            return this.type == ExpressionValueType.STRING;
        }

        public get IsFunction(): boolean {
            return this.type == ExpressionValueType.FUNCTION;
        }

        public get IsObject(): boolean {
            return this.type == ExpressionValueType.OBJECT;
        }

        public get Bool(): boolean {
            return this.bValue;
        }

        public get Number(): number {
            return this.nValue;
        }

        public get String(): string {
            return this.sValue;
        }

        public get Function(): Parsing.Function_ {
            return this.fValue;
        }

        constructor(type: ExpressionValueType, value?) {
            this.type = type;
            if (type == ExpressionValueType.OBJECT)
                this.members = {};
            else if (value) {
                switch (value.constructor) {
                    case (String):
                        {
                            this.sValue = value;
                            this.bValue = (value != "");
                            this.nValue = (value != "") ? 1 : 0;
                            break;
                        }
                    case (Number):
                        {
                            this.sValue = value.toString();
                            this.bValue = (value != 0) ? true : false;
                            this.nValue = value;
                            break;
                        }
                    case (Boolean):
                        {
                            this.sValue = value.toString();
                            this.bValue = value;
                            this.nValue = (value) ? 1 : 0;
                            break;
                        }
                    case (Parsing.Function_):
                        {
                            this.sValue = "function";
                            this.bValue = true;
                            this.nValue = 1;
                            this.fValue = value;
                            break;
                        }
                }
            }
        }

        public Substitute(value: ExpressionValue) {
            this.bValue = value.Bool;
            this.nValue = value.Number;
            this.sValue = value.String;
        }

        public GetProperty(str: string): ExpressionValue {
            return this.members[str];
        }

        public SetProperty(str: string, value: ExpressionValue) {
            this.members[str] = value;
        }
    }
}
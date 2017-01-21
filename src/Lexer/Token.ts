import {TokenType} from './TokenType';

export class Token {

    private type: TokenType;
    private value: string;
    accessKey: string[];

    public get AccessKey() {
        return this.accessKey;
    }

    public get Length() {
        if (this.value != null)
            return this.value.length;

        switch (this.type) {
            case TokenType.PLUS:
            case TokenType.MINUS:
            case TokenType.TIMES:
            case TokenType.DOT:
            case TokenType.SLASH:
            case TokenType.COLON:
            case TokenType.PERCENT:
            case TokenType.QUESTION:
            case TokenType.POUND:
            case TokenType.SEMI:
            case TokenType.COMMA:
            case TokenType.L_PAREN:
            case TokenType.R_PAREN:
            case TokenType.LESS:
            case TokenType.GREATER:
            case TokenType.L_BRACE:
            case TokenType.R_BRACE:
            case TokenType.L_BRACKET:
            case TokenType.R_BRACKET:
            case TokenType.ASSIGN:
            case TokenType.QUOTE:
                return 1;
            case TokenType.EQUAL:
            case TokenType.LESS_OR_EQUAL:
            case TokenType.GREATER_OR_EQUAL:
            case TokenType.IF:
            case TokenType.OR:
            case TokenType.DISEQUAL:
            case TokenType.AND:
            case TokenType.INLINE_COMMENT:
            case TokenType.MULTILINE_COMMENT_START:
            case TokenType.MULTILINE_COMMENT_END:
                return 2;
            //case TokenType.INT:
            case TokenType.DECLARE:
            case TokenType.FOR:
            case TokenType.NEW:
                return 3;
            //case TokenType.VOID:
            case TokenType.ELSE:
            case TokenType.TRUE:
            case TokenType.NULL:
                return 4;
            case TokenType.WHILE:
            case TokenType.FALSE:
                return 5;
            case TokenType.RETURN:
            case TokenType.STRING:
                return 6;
            //case TokenType.BOOLEAN:
            //return 7;
            case TokenType.FUNCTION:
                return 8;
            case TokenType.OBJECT_ACCESS:
                {
                    var length = 0;
                    this.accessKey.forEach(acc => length += acc.length + 1);
                    return length - 1;
                }
        }

        return 0;

    }

    public get Type(): TokenType {
        return this.type;
    }

    public get Value(): string {
        return this.value;
    }

    constructor(type: TokenType, value?) {
        this.type = type;

        if (typeof (value) === "string")
            this.value = value;
        else
            this.accessKey = value;
    }

    public ToString(): string {
        var str = TokenType[this.type];

        if (this.value != null)
            str += " : " + this.value;

        return str + "\n";
    }
}
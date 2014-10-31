module Lexing {

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
            var str = this.type.toString();

            if (this.value != null)
                str += " : " + this.value;

            return str + "\n";
        }
    }

    export enum TokenType {
        SLASH,                      // / 0

        INLINE_COMMENT,				// // 1
        MULTILINE_COMMENT_START,	// /* 2
        MULTILINE_COMMENT_END,		// */ 3

        OBJECT_ACCESS,              // 4

        INTEGER,              // 5
        DOUBLE,              // 6
        ALPHANUMERIC,              // 7
        STRING,              // 8

        // Keywords
        FUNCTION,		// function 9
        IF,				// if 10
        DECLARE,		// var 11
        ELSE,			// else 12
        WHILE,			// while 13
        FOR,			// for 14
        RETURN,			// return 15
        TRUE,			// true 16
        FALSE,			// false 17
        NEW,			// new 18
        NULL,			// null 19 

        // Special characters
        PLUS,			// + 20
        MINUS,			// - 21
        TIMES,			// * 22
        QUOTE,			// " 23
        DOT,			// . 24
        COLON,			// : 25
        PERCENT,		// % 26
        DISEQUAL,		// != 27
        QUESTION,		// ? 28
        POUND,			// # 29
        AND,			// && 30
        OR,				// || 31
        LESS_OR_EQUAL,	// <= 32
        GREATER_OR_EQUAL,// >= 33
        LESS,			// < 34
        GREATER,		// > 35
        SEMI,			// ; 36
        COMMA,			// , 37
        L_PAREN,		// ( 38
        R_PAREN,		// ) 39
        L_BRACE,		// { 40
        R_BRACE,		// } 41
        L_BRACKET,		// [ 42
        R_BRACKET,		// ] 43
        ASSIGN,			// = 44
        EQUAL,			// == 45
        LINE_END,		// \n 46
        END				// End of source code 47
    };
}
export enum TokenType {
    SLASH,                      // / 0

    INLINE_COMMENT,				// // 1
    MULTILINE_COMMENT_START,	// /* 2
    MULTILINE_COMMENT_END,		// */ 3

    OBJECT_ACCESS,              // 4

    NUMBER,              // 5
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
    END		        // End of source code 47
}
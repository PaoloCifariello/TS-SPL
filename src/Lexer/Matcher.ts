import {TokenType} from './TokenType';
import {Token} from "./Token";

export class Matcher {
    private KeywordMatcher: MatchKey[];
    private SpecialMatcher: MatchKey[];

    constructor() {
        this.InitializeKeywordMatchList();
        this.InitializeSpecialMatchList();
    }

    private InitializeKeywordMatchList() {
        this.KeywordMatcher = [
            //new MatchKey(TokenType.VOID, "void"),
            //new MatchKey(TokenType.INT, "int"),
            new MatchKey(TokenType.FUNCTION, "function"),
            new MatchKey(TokenType.IF, "if"),
            new MatchKey(TokenType.DECLARE, "var"),
            new MatchKey(TokenType.ELSE, "else"),
            new MatchKey(TokenType.WHILE, "while"),
            new MatchKey(TokenType.FOR, "for"),
            new MatchKey(TokenType.RETURN, "return"),
            new MatchKey(TokenType.TRUE, "true"),
            new MatchKey(TokenType.FALSE, "false"),
            //new MatchKey(TokenType.BOOLEAN, "bool"),
            new MatchKey(TokenType.STRING, "string"),
            new MatchKey(TokenType.NEW, "new"),
            new MatchKey(TokenType.NULL, "null")
        ];
    }

    private InitializeSpecialMatchList() {
        this.SpecialMatcher = [
            new MatchKey(TokenType.INLINE_COMMENT, "//"),
            new MatchKey(TokenType.MULTILINE_COMMENT_START, "/*"),
            new MatchKey(TokenType.MULTILINE_COMMENT_END, "*/"),
            new MatchKey(TokenType.PLUS, "+"),
            new MatchKey(TokenType.MINUS, "-"),
            new MatchKey(TokenType.TIMES, "*"),
            new MatchKey(TokenType.SLASH, "/"),
            new MatchKey(TokenType.DOT, "."),
            new MatchKey(TokenType.COLON, ":"),
            new MatchKey(TokenType.QUOTE, "\""),
            new MatchKey(TokenType.PERCENT, "%"),
            new MatchKey(TokenType.OR, "||"),
            new MatchKey(TokenType.DISEQUAL, "!="),
            new MatchKey(TokenType.QUESTION, "?"),
            new MatchKey(TokenType.POUND, "#"),
            new MatchKey(TokenType.AND, "&&"),
            new MatchKey(TokenType.SEMI, ";"),
            new MatchKey(TokenType.COMMA, ","),
            new MatchKey(TokenType.L_PAREN, "("),
            new MatchKey(TokenType.R_PAREN, ")"),
            new MatchKey(TokenType.LESS_OR_EQUAL, "<="),
            new MatchKey(TokenType.GREATER_OR_EQUAL, ">="),
            new MatchKey(TokenType.LESS, "<"),
            new MatchKey(TokenType.GREATER, ">"),
            new MatchKey(TokenType.L_BRACE, "{"),
            new MatchKey(TokenType.R_BRACE, "}"),
            new MatchKey(TokenType.L_BRACKET, "["),
            new MatchKey(TokenType.R_BRACKET, "]"),
            new MatchKey(TokenType.EQUAL, "=="),
            new MatchKey(TokenType.ASSIGN, "="),
            new MatchKey(TokenType.LINE_END, "\0")
        ];
    }

    public Match(line: string): Token {
        // Try to match Keywords
        for (var i = 0; i < this.KeywordMatcher.length; i++) {
            if (this.KeywordMatcher[i].Match(line)) {

                return new Token(this.KeywordMatcher[i].Type, null);
            }
        }

        // Try to match Special Keywords
        for (var i = 0; i < this.SpecialMatcher.length; i++) {
            if (this.SpecialMatcher[i].Match(line)) {

                return new Token(this.SpecialMatcher[i].Type);
            }
        }

        // Try to match Integer
        if (line[0] >= '0' && line[0] <= '9') {
            var idx = Matcher.ParseInteger(line);

            if (idx == -1)
                return new Token(
                    TokenType.NUMBER,
                    line.substring(0)
                    );
            else
                return new Token(
                    TokenType.NUMBER,
                    line.substring(0, idx)
                    );
        }

        // Try to match alphanumeric
        if (Matcher.isAlphanumeric(line[0])) {
            var idx = Matcher.ParseAlphanumeric(line);
            if (idx == -1)
                return new Token(
                    TokenType.ALPHANUMERIC,
                    line.substring(0)
                    );
            else {
                if (line[idx] != '.') {
                    return new Token(
                        TokenType.ALPHANUMERIC,
                        line.substr(0, idx)
                        );
                } else {
                    var AssignKey: string[] = [];
                    var idx_aux = idx;

                    AssignKey.push(line.substring(0, idx_aux));

                    while (line[idx_aux] == '.') {
                        idx_aux = idx_aux + 1 + Matcher.ParseAlphanumeric(line.substring(idx_aux + 1));

                        AssignKey.push(line.substring(idx + 1, idx_aux));
                        idx = idx_aux;
                    }

                    return new Token(
                        TokenType.OBJECT_ACCESS,
                        AssignKey
                        );
                }
            }
        }

        return null;
    }

    public static ParseInteger(line: string): number {
        for (var position = 1; position < line.length; position++)
            if (!Matcher.isNumber(line[position])) {
                if(line[position] !== ".")
                    return position;
            }

        return -1;
    }

    public static ParseAlphanumeric(line: string): number {
        for (var position = 1; position < line.length; position++)
            if (!Matcher.isAlphanumeric(line[position]))
                return position;

        return -1;
    }

    private static isNumber(c: string): boolean {
        return (c >= '0' && c <= '9');
    }

    private static isAlphanumeric(c: string): boolean {
        if (Matcher.isNumber(c))
            return true;

        return ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c == '$') || (c == '_'));
    }

    private static isValidInitialIdentifier(c: string): boolean {
        return ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c == '$') || (c == '_'));
    }
}

class MatchKey
{
    private type: TokenType;
    private word: string;

    public get Type(): TokenType {
        return this.type;
    }

    public get Word(): string {
        return this.word;
    }

    public Length(): number {
        return (this.word != null) ?
            this.word.length :
            0;
    }

    public constructor(type: TokenType, word?: string) {
        this.type = type;
        this.word = word;
    }

    public Match(line: string): boolean {
        var substr: string;

        try {
            substr = line.substring(0, this.word.length);
        } catch (ArgumentOutOfRangeException) {
            return false;
        }

        return this.word == substr;
    }
}
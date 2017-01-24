import {Token} from "./Token";
import {TokenType} from "./TokenType";
import {Matcher} from "./Matcher";
import {Source} from "./Source";

export class Lexer {
    private source: Source;
    private tokens: Token[] = [];
    private matcher: Matcher = new Matcher();
    private lastToken: Token;

    private currentLine: string;

    public get Tokens(): Token[] {
        return this.tokens;
    }

    constructor(src: Source) {
        this.source = src;
    }

    public static fromFile(path: string): Lexer {
        var source = Source.FromFile(path);
        return new Lexer(source);
    }

    public static fromSource(src: string): Lexer {
        let source = new Source(src);
        return new Lexer(source);
    }

    private getNextToken(): Token {
        let currentToken = this.matcher.Match(this.currentLine);

        if (!currentToken)
            return null;

        let length = currentToken.Length;
        this.currentLine = this.currentLine.substring(length);

        return currentToken;
    }

    private addNextToken(): boolean {
        this.skipEmptyChar();

        if (this.currentLine.length === 0)
            return false;

        let currentToken = this.getNextToken();

        if (!currentToken) {
            return false;
        } else if (this.lastToken != null && this.lastToken.Type == TokenType.MULTILINE_COMMENT_START) {
            if (currentToken.Type == TokenType.MULTILINE_COMMENT_END)
                this.lastToken = null;

            return true;
            // In case of Inline comment, just skip current line at lexing time
        } else if (currentToken.Type == TokenType.INLINE_COMMENT) {
            return false;
            // In case of multiline comment /* , iterate until you find */
        } else if (currentToken.Type == TokenType.MULTILINE_COMMENT_START) {
            this.lastToken = currentToken;
            return true;
        }

        this.tokens.push(currentToken);

        // string case
        if (currentToken.Type == TokenType.QUOTE) {
            let value = this.parseString();
            if (value == null)
                return false;

            this.tokens.push(new Token(TokenType.ALPHANUMERIC, value));
            this.tokens.push(currentToken);
        }

        this.lastToken = currentToken;
        return true;
    }

    private parseString(): string {
        var ind = this.currentLine.indexOf('"');
        if (ind == -1)
            return null;

        let val = this.currentLine.substring(0, ind);
        this.currentLine = this.currentLine.substring(ind);

        // Looking for second quote
        if (this.currentLine[0] != '"')
            return null;

        this.currentLine = this.currentLine.substring(1);
        return val;
    }

    private skipEmptyChar() {
        var position = 0;

        while (position < this.currentLine.length) {
            var c = this.currentLine[position];

            if (c == ' ' || c == '\t' || c == '\r')
                position++;
            else {
                this.currentLine = this.currentLine.substring(position);
                break;
            }
        }
    }

    public Tokenize()
    {
        // Gets tokens for each line.
        for (var i = 0; i < this.source.LineCount; i++) {
            this.currentLine = this.source.getLine();

            while (this.addNextToken());
        }
    }

    public PrintToken(index: number) {
        if (typeof index == 'undefined')
            this.tokens.forEach((token, index) => this.PrintToken(index));
        else if (index < this.tokens.length)
            console.log(this.tokens[index].ToString());
    }
}
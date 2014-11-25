module Lexing {

    export class Lexer {
        private source: Source;
        private tokens: Token[] = [];
        private matcher: Matcher = new Matcher();
        private lastToken: Token;

        private CurrentLine: string;

        public get Tokens(): Token[] {
            return this.tokens;
        }

        constructor(src) {
            switch (typeof (src)) {
                case "string":
                    {
                        this.source = new Source(src);
                        break;
                    }
                case "object":
                    {
                        this.source = src;
                        break;
                    }
            }
        }

        public static FromFile(path: string): Lexer {
            var src = Source.FromFile(path);
            return new Lexer(src);
        }

        private GetNextToken(): Token {
            var CurrentToken = this.matcher.Match(this.CurrentLine);

            if (!CurrentToken)
                return null;

            var length = CurrentToken.Length;
            this.CurrentLine = this.CurrentLine.substring(length);

            return CurrentToken;
        }

        private AddNextToken(): boolean {
            this.SkipEmptyChar();

            if (this.CurrentLine.length === 0)
                return false;

            var CurrentToken = this.GetNextToken();

            if (!CurrentToken) {
                return false;
            } else if (this.lastToken != null && this.lastToken.Type == TokenType.MULTILINE_COMMENT_START) {
                if (CurrentToken.Type == TokenType.MULTILINE_COMMENT_END)
                    this.lastToken = null;

                return true;
                // In case of Inline comment, just skip current line at lexing time
            } else if (CurrentToken.Type == TokenType.INLINE_COMMENT) {
                return false;
                // In case of multiline comment /* , iterate until you find */
            } else if (CurrentToken.Type == TokenType.MULTILINE_COMMENT_START) {
                this.lastToken = CurrentToken;
                return true;
            }

            this.tokens.push(CurrentToken);

            // string case
            if (CurrentToken.Type == TokenType.QUOTE) {
                var value = this.ParseString();
                if (value == null)
                    return false;

                this.tokens.push(new Token(TokenType.ALPHANUMERIC, value));
                this.tokens.push(CurrentToken);
            }

            this.lastToken = CurrentToken;
            return true;
        }

        private ParseString(): string {
            var ind = this.CurrentLine.indexOf('"');
            if (ind == -1)
                return null;

            var val = this.CurrentLine.substring(0, ind);
            this.CurrentLine = this.CurrentLine.substring(ind);

            // Looking for second quote
            if (this.CurrentLine[0] != '"')
                return null;

            this.CurrentLine = this.CurrentLine.substring(1);
            return val;
        }

        private SkipEmptyChar() {
            var position = 0;

            while (position < this.CurrentLine.length) {
                var c = this.CurrentLine[position];

                if (c == ' ' || c == '\t' || c == '\r')
                    position++;
                else {
                    this.CurrentLine = this.CurrentLine.substring(position);
                    break;
                }
            }
        }

        public Tokenize()
        {
            // Gets tokens for each line.

            for (var i = 0; i < this.source.LineCount; i++) {
                this.CurrentLine = this.source.getLine();

                while (this.AddNextToken());
            }
        }

        public PrintToken(index: number) {
            if (typeof index == 'undefined')
                this.tokens.forEach((token, index) => this.PrintToken(index));
            else if (index < this.tokens.length)
                console.log(this.tokens[index].ToString());
        }
    }

}
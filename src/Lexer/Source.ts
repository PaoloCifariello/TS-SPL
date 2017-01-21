export class Source {

    private source_code: string;
    private lines: string[];
    private line_counter = 0;

    public get Empty(): boolean {
        return this.source_code.length === 0;
    }

    public get Length(): number {
        return this.source_code.length;
    }

    public get LineCount(): number {
        return this.lines.length;
    }

    constructor(scode: string) {
        this.source_code = scode;
        this.lines = this.source_code.replace("\r", "").split('\n');
    }

    public getLine(): string {
        return (this.lines.length > this.line_counter) ?
            this.lines[this.line_counter++] :
            null;
    }

    public Print() {
        console.log(this.source_code);
    }

    public static FromFile(path: string): Source {
        var scode = require('fs').readFileSync(path);
        return new Source(scode.toString());
    }
}
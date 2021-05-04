export declare class UBBParser {
    private _text;
    private _readPos;
    protected _handlers: {
        [index: string]: (tagName: string, end: boolean, attr: string) => string;
    };
    lastColor: string;
    lastSize: string;
    linkUnderline: boolean;
    linkColor: string;
    constructor();
    protected onTag_URL(tagName: string, end: boolean, attr: string): string;
    protected onTag_IMG(tagName: string, end: boolean, attr: string): string;
    protected onTag_Simple(tagName: string, end: boolean, attr: string): string;
    protected onTag_COLOR(tagName: string, end: boolean, attr: string): string;
    protected onTag_FONT(tagName: string, end: boolean, attr: string): string;
    protected onTag_SIZE(tagName: string, end: boolean, attr: string): string;
    protected getTagText(remove?: boolean): string;
    parse(text: string, remove?: boolean): string;
}
export declare var defaultParser: UBBParser;

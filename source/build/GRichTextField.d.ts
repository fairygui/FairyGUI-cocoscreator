/// <reference path="../lib/cc.d.ts" />
import { HorizontalTextAlignment, RichText, SpriteAtlas, SpriteFrame } from "cc";
import { GTextField } from "./GTextField";
export declare class RichTextImageAtlas extends SpriteAtlas {
    getSpriteFrame(key: string): SpriteFrame;
}
export declare class GRichTextField extends GTextField {
    _richText: RichText;
    private _bold;
    private _italics;
    private _underline;
    linkUnderline: boolean;
    linkColor: string;
    constructor();
    protected createRenderer(): void;
    get align(): HorizontalTextAlignment;
    set align(value: HorizontalTextAlignment);
    get underline(): boolean;
    set underline(value: boolean);
    get bold(): boolean;
    set bold(value: boolean);
    get italic(): boolean;
    set italic(value: boolean);
    protected markSizeChanged(): void;
    protected updateText(): void;
    protected updateFont(): void;
    protected updateFontColor(): void;
    protected updateFontSize(): void;
    protected updateOverflow(): void;
    protected handleSizeChanged(): void;
}

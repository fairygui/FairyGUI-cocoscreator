export declare class ColorMatrix {
    readonly matrix: Array<number>;
    constructor(p_brightness?: number, p_contrast?: number, p_saturation?: number, p_hue?: number);
    reset(): void;
    invert(): void;
    adjustColor(p_brightness: number, p_contrast: number, p_saturation: number, p_hue: number): void;
    adjustBrightness(p_val: number): void;
    adjustContrast(p_val: number): void;
    adjustSaturation(p_val: number): void;
    adjustHue(p_val: number): void;
    concat(p_matrix: Array<number>): void;
    clone(): ColorMatrix;
    protected copyMatrix(p_matrix: Array<number>): void;
    protected multiplyMatrix(p_matrix: Array<number>): void;
    protected cleanValue(p_val: number, p_limit: number): number;
}

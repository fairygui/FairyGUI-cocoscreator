import { gfx, Node, UIRenderer } from "cc";

export enum BlendMode {
    Normal,
    None,
    Add,
    Multiply,
    Screen,
    Erase,
    Mask,
    Below,
    Off,
    Custom1,
    Custom2,
    Custom3
}

export class BlendModeUtils {
    public static apply(node: Node, blendMode: BlendMode) {
        let f = factors[<number>blendMode];
        let renderers = node.getComponentsInChildren(UIRenderer);
        renderers.forEach(element => {
            (<any>element).srcBlendFactor = f[0];
            (<any>element).dstBlendFactor = f[1];
        });
    }

    public static override(blendMode: BlendMode, srcFactor: number, dstFactor: number) {
        factors[<number>blendMode][0] = srcFactor;
        factors[<number>blendMode][1] = dstFactor;
    }
}

const factors = [
    [gfx.BlendFactor.SRC_ALPHA, gfx.BlendFactor.ONE_MINUS_SRC_ALPHA], //normal
    [gfx.BlendFactor.ONE, gfx.BlendFactor.ONE], //none
    [gfx.BlendFactor.SRC_ALPHA, gfx.BlendFactor.ONE], //add
    [gfx.BlendFactor.DST_COLOR, gfx.BlendFactor.ONE_MINUS_SRC_ALPHA], //mul
    [gfx.BlendFactor.ONE, gfx.BlendFactor.ONE_MINUS_SRC_COLOR], //screen
    [gfx.BlendFactor.ZERO, gfx.BlendFactor.ONE_MINUS_SRC_ALPHA], //erase
    [gfx.BlendFactor.ZERO, gfx.BlendFactor.SRC_ALPHA], //mask
    [gfx.BlendFactor.ONE_MINUS_DST_ALPHA, gfx.BlendFactor.DST_ALPHA], //below
    [gfx.BlendFactor.ONE, gfx.BlendFactor.ZERO], //off
    [gfx.BlendFactor.SRC_ALPHA, gfx.BlendFactor.ONE_MINUS_SRC_ALPHA], //custom1
    [gfx.BlendFactor.SRC_ALPHA, gfx.BlendFactor.ONE_MINUS_SRC_ALPHA], //custom2
    [gfx.BlendFactor.SRC_ALPHA, gfx.BlendFactor.ONE_MINUS_SRC_ALPHA], //custom2
];

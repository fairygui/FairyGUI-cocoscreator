import {gfx, Node, UIRenderer} from "cc";

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
        node.components.forEach(component => {
            if (component instanceof UIRenderer) {
                // protected属性，cocos源码：
                // https://github.com/cocos/cocos-engine/blob/10ec595/cocos/2d/framework/ui-renderer.ts#L241
                component["_srcBlendFactor"] = f[0];
                component["_dstBlendFactor"] = f[1];
            }
        })
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

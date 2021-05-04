import { gfx, RenderComponent } from "cc";
export var BlendMode;
(function (BlendMode) {
    BlendMode[BlendMode["Normal"] = 0] = "Normal";
    BlendMode[BlendMode["None"] = 1] = "None";
    BlendMode[BlendMode["Add"] = 2] = "Add";
    BlendMode[BlendMode["Multiply"] = 3] = "Multiply";
    BlendMode[BlendMode["Screen"] = 4] = "Screen";
    BlendMode[BlendMode["Erase"] = 5] = "Erase";
    BlendMode[BlendMode["Mask"] = 6] = "Mask";
    BlendMode[BlendMode["Below"] = 7] = "Below";
    BlendMode[BlendMode["Off"] = 8] = "Off";
    BlendMode[BlendMode["Custom1"] = 9] = "Custom1";
    BlendMode[BlendMode["Custom2"] = 10] = "Custom2";
    BlendMode[BlendMode["Custom3"] = 11] = "Custom3";
})(BlendMode || (BlendMode = {}));
export class BlendModeUtils {
    static apply(node, blendMode) {
        let f = factors[blendMode];
        let renderers = node.getComponentsInChildren(RenderComponent);
        renderers.forEach(element => {
            element.srcBlendFactor = f[0];
            element.dstBlendFactor = f[1];
        });
    }
    static override(blendMode, srcFactor, dstFactor) {
        factors[blendMode][0] = srcFactor;
        factors[blendMode][1] = dstFactor;
    }
}
const factors = [
    [gfx.BlendFactor.SRC_ALPHA, gfx.BlendFactor.ONE_MINUS_SRC_ALPHA],
    [gfx.BlendFactor.ONE, gfx.BlendFactor.ONE],
    [gfx.BlendFactor.SRC_ALPHA, gfx.BlendFactor.ONE],
    [gfx.BlendFactor.DST_COLOR, gfx.BlendFactor.ONE_MINUS_SRC_ALPHA],
    [gfx.BlendFactor.ONE, gfx.BlendFactor.ONE_MINUS_SRC_COLOR],
    [gfx.BlendFactor.ZERO, gfx.BlendFactor.ONE_MINUS_SRC_ALPHA],
    [gfx.BlendFactor.ZERO, gfx.BlendFactor.SRC_ALPHA],
    [gfx.BlendFactor.ONE_MINUS_DST_ALPHA, gfx.BlendFactor.DST_ALPHA],
    [gfx.BlendFactor.ONE, gfx.BlendFactor.ZERO],
    [gfx.BlendFactor.SRC_ALPHA, gfx.BlendFactor.ONE_MINUS_SRC_ALPHA],
    [gfx.BlendFactor.SRC_ALPHA, gfx.BlendFactor.ONE_MINUS_SRC_ALPHA],
    [gfx.BlendFactor.SRC_ALPHA, gfx.BlendFactor.ONE_MINUS_SRC_ALPHA],
];

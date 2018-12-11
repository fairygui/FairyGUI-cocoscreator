
namespace fgui {
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
        private static factors: any = [
            [cc.macro.SRC_ALPHA, cc.macro.ONE_MINUS_SRC_ALPHA], //normal
            [cc.macro.ONE, cc.macro.ONE], //none
            [cc.macro.SRC_ALPHA, cc.macro.ONE], //add
            [cc.macro.DST_COLOR, cc.macro.ONE_MINUS_SRC_ALPHA], //mul
            [cc.macro.ONE, cc.macro.ONE_MINUS_SRC_COLOR], //screen
            [cc.macro.ZERO, cc.macro.ONE_MINUS_SRC_ALPHA], //erase
            [cc.macro.ZERO, cc.macro.SRC_ALPHA], //mask
            [cc.macro.ONE_MINUS_DST_ALPHA, cc.macro.DST_ALPHA], //below
            [cc.macro.ONE, cc.macro.ZERO], //off
            [cc.macro.SRC_ALPHA, cc.macro.ONE_MINUS_SRC_ALPHA], //custom1
            [cc.macro.SRC_ALPHA, cc.macro.ONE_MINUS_SRC_ALPHA], //custom2
            [cc.macro.SRC_ALPHA, cc.macro.ONE_MINUS_SRC_ALPHA], //custom2
        ];

        public static apply(node: cc.Node, blendMode: BlendMode) {
            let renderer = node.getComponent(cc.RenderComponent);
            if (renderer) {
                let f = BlendModeUtils.factors[<number>blendMode];
                renderer.srcBlendFactor = f[0];
                renderer.dstBlendFactor = f[1];
            }
        }

        public static override(blendMode: BlendMode, srcFactor: number, dstFactor: number) {
            BlendModeUtils.factors[<number>blendMode][0] = srcFactor;
            BlendModeUtils.factors[<number>blendMode][1] = dstFactor;
        }
    }
}
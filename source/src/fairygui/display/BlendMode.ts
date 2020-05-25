
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
            [cc.GFXBlendFactor.SRC_ALPHA, cc.GFXBlendFactor.ONE_MINUS_SRC_ALPHA], //normal
            [cc.GFXBlendFactor.ONE, cc.GFXBlendFactor.ONE], //none
            [cc.GFXBlendFactor.SRC_ALPHA, cc.GFXBlendFactor.ONE], //add
            [cc.GFXBlendFactor.DST_COLOR, cc.GFXBlendFactor.ONE_MINUS_SRC_ALPHA], //mul
            [cc.GFXBlendFactor.ONE, cc.GFXBlendFactor.ONE_MINUS_SRC_COLOR], //screen
            [cc.GFXBlendFactor.ZERO, cc.GFXBlendFactor.ONE_MINUS_SRC_ALPHA], //erase
            [cc.GFXBlendFactor.ZERO, cc.GFXBlendFactor.SRC_ALPHA], //mask
            [cc.GFXBlendFactor.ONE_MINUS_DST_ALPHA, cc.GFXBlendFactor.DST_ALPHA], //below
            [cc.GFXBlendFactor.ONE, cc.GFXBlendFactor.ZERO], //off
            [cc.GFXBlendFactor.SRC_ALPHA, cc.GFXBlendFactor.ONE_MINUS_SRC_ALPHA], //custom1
            [cc.GFXBlendFactor.SRC_ALPHA, cc.GFXBlendFactor.ONE_MINUS_SRC_ALPHA], //custom2
            [cc.GFXBlendFactor.SRC_ALPHA, cc.GFXBlendFactor.ONE_MINUS_SRC_ALPHA], //custom2
        ];

        public static apply(node: cc.Node, blendMode: BlendMode) {
            let f = BlendModeUtils.factors[<number>blendMode];
            let renderers = node.getComponentsInChildren(cc.RenderableComponent);
            renderers.forEach(element => {
                (<any>element).srcBlendFactor = f[0];
                (<any>element).dstBlendFactor = f[1];
            });
        }

        public static override(blendMode: BlendMode, srcFactor: number, dstFactor: number) {
            BlendModeUtils.factors[<number>blendMode][0] = srcFactor;
            BlendModeUtils.factors[<number>blendMode][1] = dstFactor;
        }
    }
}
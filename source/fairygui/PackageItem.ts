
namespace fgui {

    export class PackageItem {
        public owner: UIPackage;

        public type: PackageItemType;
        public objectType: ObjectType;
        public id: string;
        public name: string;
        public width: number = 0;
        public height: number = 0;
        public file: string;
        public decoded: boolean;
        public rawData: ByteBuffer;
        public asset: cc.Texture2D | cc.SpriteFrame | cc.AudioClip | cc.LabelAtlas;

        //image
        public scale9Grid: cc.Rect;
        public scaleByTile: boolean;
        public tileGridIndice: number = 0;
        public smoothing: boolean;
        public hitTestData: PixelHitTestData;

        //movieclip
        public interval: number = 0;
        public repeatDelay: number = 0;
        public swing: boolean;
        public frames: Array<Frame>;

        //componenet
        public extensionType: any;

        public constructor() {
        }

        public load(): any {
            return this.owner.getItemAsset(this);
        }

        public toString(): string {
            return this.name;
        }
    }
}
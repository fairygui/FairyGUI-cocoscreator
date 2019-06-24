
namespace fgui {

    export class GMovieClip extends GObject {
        public _content: MovieClip;

        public constructor() {
            super();

            this._node.name = "GMovieClip";
            this._touchDisabled = true;
            this._content = this._node.addComponent(MovieClip);
        }

        public get color(): cc.Color {
            return cc.Color.WHITE;
        }

        public set color(value: cc.Color) {
            if (this._node.color != value) {
                this._node.color = value;
                this.updateGear(4);
            }
        }

        public get playing(): boolean {
            return this._content.playing;
        }

        public set playing(value: boolean) {
            if (this._content.playing != value) {
                this._content.playing = value;
                this.updateGear(5);
            }
        }

        public get frame(): number {
            return this._content.frame;
        }

        public set frame(value: number) {
            if (this._content.frame != value) {
                this._content.frame = value;
                this.updateGear(5);
            }
        }

        public get timeScale(): number {
            return this._content.timeScale;
        }

        public set timeScale(value: number) {
            this._content.timeScale = value;
        }

        public rewind(): void {
            this._content.rewind();
        }

        public syncStatus(anotherMc: GMovieClip): void {
            this._content.syncStatus(anotherMc._content);
        }

        public advance(timeInMiniseconds: number): void {
            this._content.advance(timeInMiniseconds);
        }

        //从start帧开始，播放到end帧（-1表示结尾），重复times次（0表示无限循环），循环结束后，停止在endAt帧（-1表示参数end）
        public setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: Function, callbackObj?: any): void {
            this._content.setPlaySettings(start, end, times, endAt, endCallback, callbackObj);
        }

        protected handleGrayedChanged(): void {
            this._content.setState(this._grayed ? cc.Sprite.State.GRAY : cc.Sprite.State.NORMAL);
        }

        public constructFromResource(): void {
            this.sourceWidth = this.packageItem.width;
            this.sourceHeight = this.packageItem.height;
            this.initWidth = this.sourceWidth;
            this.initHeight = this.sourceHeight;

            this.setSize(this.sourceWidth, this.sourceHeight);

            this.packageItem.load();

            this._content.interval = this.packageItem.interval;
            this._content.swing = this.packageItem.swing;
            this._content.repeatDelay = this.packageItem.repeatDelay;
            this._content.frames = this.packageItem.frames;
            this._content.smoothing = this.packageItem.smoothing;
        }

        public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
            super.setup_beforeAdd(buffer, beginPos);

            buffer.seek(beginPos, 5);

            if (buffer.readBool())
                this.color = buffer.readColor();
            buffer.readByte(); //flip
            this._content.frame = buffer.readInt();
            this._content.playing = buffer.readBool();
        }
    }
}
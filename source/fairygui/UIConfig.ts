
namespace fgui {

    export class UIConfig {
        public constructor() {
        }

        //Default font name
        public static defaultFont: string = "Arial";

        //Resource using in Window.ShowModalWait for locking the window.
        public static windowModalWaiting: string;
        //Resource using in GRoot.ShowModalWait for locking the screen.
        public static globalModalWaiting: string;

        //When a modal window is in front, the background becomes dark.
        public static modalLayerColor: cc.Color = new cc.Color(0x33, 0x33, 0x33, 0x33);

        //Default button click sound
        public static buttonSound: string;
        public static buttonSoundVolumeScale: number = 1;

        public static horizontalScrollBar: string;
        public static verticalScrollBar: string;
        
        //Scrolling step in pixels
        public static defaultScrollStep: number = 25;
        //Deceleration ratio of scrollpane when its in touch dragging.
        public static defaultScrollDecelerationRate: number = 0.967;
        //Default scrollbar display mode. Recommened visible for Desktop and Auto for mobile.
        public static defaultScrollBarDisplay: number = ScrollBarDisplayType.Visible;
        //Allow dragging the content to scroll. Recommeded true for mobile.
        public static defaultScrollTouchEffect: boolean = true;
        //The "rebound" effect in the scolling container. Recommeded true for mobile.
        public static defaultScrollBounceEffect: boolean = true;

        //Resources for PopupMenu.
        public static popupMenu: string;
        //Resources for seperator of PopupMenu.
        public static popupMenu_seperator: string;
        //In case of failure of loading content for GLoader, use this sign to indicate an error.
        public static loaderErrorSign: string;
        //Resources for tooltips.
        public static tooltipsWin: string;

        //Max items displayed in combobox without scrolling.
        public static defaultComboBoxVisibleItemCount: number = 10;

        // Pixel offsets of finger to trigger scrolling.
        public static touchScrollSensitivity: number = 20;

        // Pixel offsets of finger to trigger dragging.
        public static touchDragSensitivity: number = 10;

        // Pixel offsets of mouse pointer to trigger dragging.
        public static clickDragSensitivity: number = 2;

        // When click the window, brings to front automatically.
        public static bringWindowToFrontOnClick: boolean = true;

        public static frameTimeForAsyncUIConstruction: number = 0.002;

        public static linkUnderline: boolean = true;
    }

    let _flag: boolean = false;
    export var addLoadHandler: Function = function (ext?: string): void {
        if (_flag)
            return;

        _flag = true;
        if (!ext)
            ext = "bin";
        cc.loader.addDownloadHandlers({ [ext]: cc.loader.downloader["extMap"].binary });
        cc.loader.addLoadHandlers({
            [ext]: function (item, callback) {
                item._owner.rawBuffer = item.content;
                return item.content;
            }
        });
    };

    let _fontRegistry: any = {};
    export var registerFont: Function = function (name: string, font: cc.Font | string): void {
        if (font instanceof cc.Font)
            _fontRegistry[name] = font;
        else
            _fontRegistry[name] = cc.loader.getRes(name, cc.Font);
    };

    export var getFontByName: Function = function (name: string): cc.Font {
        return _fontRegistry[name];
    }
}
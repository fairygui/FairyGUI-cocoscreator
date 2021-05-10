import { AssetManager, Color, Font, Layers, resources } from "cc";
import { ScrollBarDisplayType } from "./FieldTypes";

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
    public static modalLayerColor: Color = new Color(0x33, 0x33, 0x33, 0x33);

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

    //Default Gloader assetsBundle Name.
    public static loaderAssetsBundleName:string;

    // Pixel offsets of finger to trigger dragging.
    public static touchDragSensitivity: number = 10;

    // Pixel offsets of mouse pointer to trigger dragging.
    public static clickDragSensitivity: number = 2;

    // When click the window, brings to front automatically.
    public static bringWindowToFrontOnClick: boolean = true;

    public static frameTimeForAsyncUIConstruction: number = 0.002;

    public static linkUnderline: boolean = true;

    //Default group name of UI node.<br/>
    public static defaultUILayer: number = Layers.Enum.UI_2D;
}

let _fontRegistry: { [index: string]: Font } = {};
export function registerFont(name: string, font: Font | string, bundle?: AssetManager.Bundle): void {
    if (font instanceof Font)
        _fontRegistry[name] = font;
    else {
        (bundle || resources).load(name, Font, (err: Error | null, asset: Font) => {
            _fontRegistry[name] = asset;
        });
    }
};

export function getFontByName(name: string): Font {
    return _fontRegistry[name];
}
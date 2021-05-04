import { Color, Font, Layers, resources } from "cc";
import { ScrollBarDisplayType } from "./FieldTypes";
export class UIConfig {
    constructor() {
    }
}
//Default font name
UIConfig.defaultFont = "Arial";
//When a modal window is in front, the background becomes dark.
UIConfig.modalLayerColor = new Color(0x33, 0x33, 0x33, 0x33);
UIConfig.buttonSoundVolumeScale = 1;
//Scrolling step in pixels
UIConfig.defaultScrollStep = 25;
//Deceleration ratio of scrollpane when its in touch dragging.
UIConfig.defaultScrollDecelerationRate = 0.967;
//Default scrollbar display mode. Recommened visible for Desktop and Auto for mobile.
UIConfig.defaultScrollBarDisplay = ScrollBarDisplayType.Visible;
//Allow dragging the content to scroll. Recommeded true for mobile.
UIConfig.defaultScrollTouchEffect = true;
//The "rebound" effect in the scolling container. Recommeded true for mobile.
UIConfig.defaultScrollBounceEffect = true;
//Max items displayed in combobox without scrolling.
UIConfig.defaultComboBoxVisibleItemCount = 10;
// Pixel offsets of finger to trigger scrolling.
UIConfig.touchScrollSensitivity = 20;
// Pixel offsets of finger to trigger dragging.
UIConfig.touchDragSensitivity = 10;
// Pixel offsets of mouse pointer to trigger dragging.
UIConfig.clickDragSensitivity = 2;
// When click the window, brings to front automatically.
UIConfig.bringWindowToFrontOnClick = true;
UIConfig.frameTimeForAsyncUIConstruction = 0.002;
UIConfig.linkUnderline = true;
//Default group name of UI node.<br/>
UIConfig.defaultUILayer = Layers.Enum.UI_2D;
let _fontRegistry = {};
export function registerFont(name, font, bundle) {
    if (font instanceof Font)
        _fontRegistry[name] = font;
    else {
        (bundle || resources).load(name, Font, (err, asset) => {
            _fontRegistry[name] = asset;
        });
    }
}
;
export function getFontByName(name) {
    return _fontRegistry[name];
}

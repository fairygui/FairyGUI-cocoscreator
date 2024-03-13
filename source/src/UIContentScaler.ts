import { Size, screen, view } from "cc";

export class UIContentScaler {
    public static scaleFactor: number = 1;
    public static scaleLevel: number = 0;
    public static rootSize: Size = new Size();
}

export function updateScaler(): void {
    let size = screen.windowSize;
    size.width /= view.getScaleX();
    size.height /= view.getScaleY();
    UIContentScaler.rootSize.set(size);

    var ss: number = Math.max(view.getScaleX(), view.getScaleY());
    UIContentScaler.scaleFactor = ss;
    if (ss >= 3.5)
        UIContentScaler.scaleLevel = 3; //x4
    else if (ss >= 2.5)
        UIContentScaler.scaleLevel = 2; //x3
    else if (ss >= 1.5)
        UIContentScaler.scaleLevel = 1; //x2
    else
        UIContentScaler.scaleLevel = 0;
}
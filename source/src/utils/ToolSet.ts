import { Color } from "cc";

export function toGrayedColor(c: Color): Color {
    let v = c.r * 0.299 + c.g * 0.587 + c.b * 0.114;
    return new Color(v, v, v, c.a);
}
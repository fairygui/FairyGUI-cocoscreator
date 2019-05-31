/// <reference path="UBBParser.ts" />

namespace fgui {

    export class ToolSet {
        public constructor() {
        }

        public static startsWith(source: string, str: string, ignoreCase?: boolean): boolean {
            if (!source)
                return false;
            else if (source.length < str.length)
                return false;
            else {
                source = source.substring(0, str.length);
                if (!ignoreCase)
                    return source == str;
                else
                    return source.toLowerCase() == str.toLowerCase();
            }
        }

        public static encodeHTML(str: string): string {
            if (!str)
                return "";
            else
                return str.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("'", "&apos;");
        }

        public static clamp(value: number, min: number, max: number): number {
            if (value < min)
                value = min;
            else if (value > max)
                value = max;
            return value;
        }

        public static clamp01(value: number): number {
            if (value > 1)
                value = 1;
            else if (value < 0)
                value = 0;
            return value;
        }

        public static lerp(start: number, end: number, percent: number): number {
            return (start + percent * (end - start));
        }

        public static getTime() {
            let currentTime = new Date();
            return currentTime.getMilliseconds() / 1000;
        }

        public static toGrayed(c: cc.Color): cc.Color {
            let v = c.getR() * 0.299 + c.getG() * 0.587 + c.getB() * 0.114;
            return new cc.Color(v, v, v, c.getA());
        }
    }
}
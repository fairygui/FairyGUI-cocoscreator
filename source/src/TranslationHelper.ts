import { ObjectType } from "./FieldTypes";
import { PackageItem } from "./PackageItem";
import { ByteBuffer } from "./utils/ByteBuffer";

export class TranslationHelper {
    public static strings: { [index: string]: { [index: string]: string } };

    public static loadFromXML(source: string): void {
        TranslationHelper.strings = {};
        let strings = TranslationHelper.strings;

        var xml: any = new DOMParser().parseFromString(source, "text/xml").documentElement;
        var nodes: any = xml.childNodes;
        var length1: number = nodes.length;
        for (var i1: number = 0; i1 < length1; i1++) {
            var cxml: any = nodes[i1];
            if (cxml.tagName == "string") {
                var key: string = cxml.getAttribute("name");
                var text: string = cxml.childNodes.length > 0 ? cxml.firstChild.nodeValue : "";
                var i: number = key.indexOf("-");
                if (i == -1)
                    continue;

                var key2: string = key.substring(0, i);
                var key3: string = key.substring(i + 1);
                var col: { [index: string]: string } = strings[key2];
                if (!col) {
                    col = {};
                    strings[key2] = col;
                }
                col[key3] = text;
            }
        }
    }

    public static translateComponent(item: PackageItem): void {
        if (TranslationHelper.strings == null)
            return;

        var compStrings: { [index: string]: string } = TranslationHelper.strings[item.owner.id + item.id];
        if (compStrings == null)
            return;

        var elementId: string, value: string;
        var buffer: ByteBuffer = item.rawData!;
        var nextPos: number;
        var itemCount: number;
        var i: number, j: number, k: number;
        var dataLen: number;
        var curPos: number;
        var valueCnt: number;
        var page: string;

        buffer.seek(0, 2);

        var childCount: number = buffer.readShort();
        for (i = 0; i < childCount; i++) {
            dataLen = buffer.readShort();
            curPos = buffer.position;

            buffer.seek(curPos, 0);

            var baseType: number = buffer.readByte();
            var type: number = baseType;
            buffer.skip(4);
            elementId = buffer.readS();

            if (type == ObjectType.Component) {
                if (buffer.seek(curPos, 6))
                    type = buffer.readByte();
            }

            buffer.seek(curPos, 1);

            if ((value = compStrings[elementId + "-tips"]) != null)
                buffer.writeS(value);

            buffer.seek(curPos, 2);

            var gearCnt: number = buffer.readShort();
            for (j = 0; j < gearCnt; j++) {
                nextPos = buffer.readShort();
                nextPos += buffer.position;

                if (buffer.readByte() == 6) //gearText
                {
                    buffer.skip(2);//controller
                    valueCnt = buffer.readShort();
                    for (k = 0; k < valueCnt; k++) {
                        page = buffer.readS();
                        if (page != null) {
                            if ((value = compStrings[elementId + "-texts_" + k]) != null)
                                buffer.writeS(value);
                            else
                                buffer.skip(2);
                        }
                    }

                    if (buffer.readBool() && (value = compStrings[elementId + "-texts_def"]) != null)
                        buffer.writeS(value);
                }

                buffer.position = nextPos;
            }

            if (baseType == ObjectType.Component && buffer.version >= 2) {
                buffer.seek(curPos, 4);

                buffer.skip(2); //pageController

                buffer.skip(4 * buffer.readShort());

                var cpCount: number = buffer.readShort();
                for (var k: number = 0; k < cpCount; k++) {
                    var target: string = buffer.readS();
                    var propertyId: number = buffer.readShort();
                    if (propertyId == 0 && (value = compStrings[elementId + "-cp-" + target]) != null)
                        buffer.writeS(value);
                    else
                        buffer.skip(2);
                }
            }

            switch (type) {
                case ObjectType.Text:
                case ObjectType.RichText:
                case ObjectType.InputText:
                    {
                        if ((value = compStrings[elementId]) != null) {
                            buffer.seek(curPos, 6);
                            buffer.writeS(value);
                        }
                        if ((value = compStrings[elementId + "-prompt"]) != null) {
                            buffer.seek(curPos, 4);
                            buffer.writeS(value);
                        }
                        break;
                    }

                case ObjectType.List:
                case ObjectType.Tree:
                    {
                        buffer.seek(curPos, 8);
                        buffer.skip(2);
                        itemCount = buffer.readShort();
                        for (j = 0; j < itemCount; j++) {
                            nextPos = buffer.readShort();
                            nextPos += buffer.position;

                            buffer.skip(2); //url
                            if (type == ObjectType.Tree)
                                buffer.skip(2);

                            //title
                            if ((value = compStrings[elementId + "-" + j]) != null)
                                buffer.writeS(value);
                            else
                                buffer.skip(2);

                            //selected title
                            if ((value = compStrings[elementId + "-" + j + "-0"]) != null)
                                buffer.writeS(value);
                            else
                                buffer.skip(2);

                            if (buffer.version >= 2) {
                                buffer.skip(6);
                                buffer.skip(buffer.readUshort() * 4);//controllers

                                var cpCount: number = buffer.readUshort();
                                for (var k: number = 0; k < cpCount; k++) {
                                    var target: string = buffer.readS();
                                    var propertyId: number = buffer.readUshort();
                                    if (propertyId == 0 && (value = compStrings[elementId + "-" + j + "-" + target]) != null)
                                        buffer.writeS(value);
                                    else
                                        buffer.skip(2);
                                }
                            }

                            buffer.position = nextPos;
                        }
                        break;
                    }

                case ObjectType.Label:
                    {
                        if (buffer.seek(curPos, 6) && buffer.readByte() == type) {
                            if ((value = compStrings[elementId]) != null)
                                buffer.writeS(value);
                            else
                                buffer.skip(2);

                            buffer.skip(2);
                            if (buffer.readBool())
                                buffer.skip(4);
                            buffer.skip(4);
                            if (buffer.readBool() && (value = compStrings[elementId + "-prompt"]) != null)
                                buffer.writeS(value);
                        }
                        break;
                    }

                case ObjectType.Button:
                    {
                        if (buffer.seek(curPos, 6) && buffer.readByte() == type) {
                            if ((value = compStrings[elementId]) != null)
                                buffer.writeS(value);
                            else
                                buffer.skip(2);
                            if ((value = compStrings[elementId + "-0"]) != null)
                                buffer.writeS(value);
                        }
                        break;
                    }

                case ObjectType.ComboBox:
                    {
                        if (buffer.seek(curPos, 6) && buffer.readByte() == type) {
                            itemCount = buffer.readShort();
                            for (j = 0; j < itemCount; j++) {
                                nextPos = buffer.readShort();
                                nextPos += buffer.position;

                                if ((value = compStrings[elementId + "-" + j]) != null)
                                    buffer.writeS(value);

                                buffer.position = nextPos;
                            }

                            if ((value = compStrings[elementId]) != null)
                                buffer.writeS(value);
                        }

                        break;
                    }
            }

            buffer.position = curPos + dataLen;
        }
    }
}
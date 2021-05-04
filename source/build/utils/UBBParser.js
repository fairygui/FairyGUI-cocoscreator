export class UBBParser {
    constructor() {
        this._readPos = 0;
        this._handlers = {};
        this._handlers["url"] = this.onTag_URL;
        this._handlers["img"] = this.onTag_IMG;
        this._handlers["b"] = this.onTag_Simple;
        this._handlers["i"] = this.onTag_Simple;
        this._handlers["u"] = this.onTag_Simple;
        //this._handlers["sup"] = this.onTag_Simple;
        //this._handlers["sub"] = this.onTag_Simple;
        this._handlers["color"] = this.onTag_COLOR;
        //this._handlers["font"] = this.onTag_FONT;
        this._handlers["size"] = this.onTag_SIZE;
    }
    onTag_URL(tagName, end, attr) {
        if (!end) {
            let ret;
            if (attr != null)
                ret = "<on click=\"onClickLink\" param=\"" + attr + "\">";
            else {
                var href = this.getTagText();
                ret = "<on click=\"onClickLink\" param=\"" + href + "\">";
            }
            if (this.linkUnderline)
                ret += "<u>";
            if (this.linkColor)
                ret += "<color=" + this.linkColor + ">";
            return ret;
        }
        else {
            let ret = "";
            if (this.linkColor)
                ret += "</color>";
            if (this.linkUnderline)
                ret += "</u>";
            ret += "</on>";
            return ret;
        }
    }
    onTag_IMG(tagName, end, attr) {
        if (!end) {
            var src = this.getTagText(true);
            if (!src)
                return null;
            return "<img src=\"" + src + "\"/>";
        }
        else
            return null;
    }
    onTag_Simple(tagName, end, attr) {
        return end ? ("</" + tagName + ">") : ("<" + tagName + ">");
    }
    onTag_COLOR(tagName, end, attr) {
        if (!end) {
            this.lastColor = attr;
            return "<color=" + attr + ">";
        }
        else
            return "</color>";
    }
    onTag_FONT(tagName, end, attr) {
        if (!end)
            return "<font face=\"" + attr + "\">";
        else
            return "</font>";
    }
    onTag_SIZE(tagName, end, attr) {
        if (!end) {
            this.lastSize = attr;
            return "<size=" + attr + ">";
        }
        else
            return "</size>";
    }
    getTagText(remove) {
        var pos1 = this._readPos;
        var pos2;
        var result = "";
        while ((pos2 = this._text.indexOf("[", pos1)) != -1) {
            if (this._text.charCodeAt(pos2 - 1) == 92) //\
             {
                result += this._text.substring(pos1, pos2 - 1);
                result += "[";
                pos1 = pos2 + 1;
            }
            else {
                result += this._text.substring(pos1, pos2);
                break;
            }
        }
        if (pos2 == -1)
            return null;
        if (remove)
            this._readPos = pos2;
        return result;
    }
    parse(text, remove) {
        this._text = text;
        this.lastColor = null;
        this.lastSize = null;
        var pos1 = 0, pos2, pos3;
        var end;
        var tag, attr;
        var repl;
        var func;
        var result = "";
        while ((pos2 = this._text.indexOf("[", pos1)) != -1) {
            if (pos2 > 0 && this._text.charCodeAt(pos2 - 1) == 92) //\
             {
                result += this._text.substring(pos1, pos2 - 1);
                result += "[";
                pos1 = pos2 + 1;
                continue;
            }
            result += this._text.substring(pos1, pos2);
            pos1 = pos2;
            pos2 = this._text.indexOf("]", pos1);
            if (pos2 == -1)
                break;
            end = this._text.charAt(pos1 + 1) == '/';
            tag = this._text.substring(end ? pos1 + 2 : pos1 + 1, pos2);
            this._readPos = pos2 + 1;
            attr = null;
            repl = null;
            pos3 = tag.indexOf("=");
            if (pos3 != -1) {
                attr = tag.substring(pos3 + 1);
                tag = tag.substring(0, pos3);
            }
            tag = tag.toLowerCase();
            func = this._handlers[tag];
            if (func != null) {
                repl = func.call(this, tag, end, attr);
                if (repl != null && !remove)
                    result += repl;
            }
            else
                result += this._text.substring(pos1, this._readPos);
            pos1 = this._readPos;
        }
        if (pos1 < this._text.length)
            result += this._text.substr(pos1);
        this._text = null;
        return result;
    }
}
export var defaultParser = new UBBParser();

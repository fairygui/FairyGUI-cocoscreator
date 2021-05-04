import { Color, Graphics, misc } from "cc";
import { ObjectPropID } from "./FieldTypes";
import { GObject } from "./GObject";
export class GGraph extends GObject {
    constructor() {
        super();
        this._type = 0;
        this._lineSize = 0;
        this._node.name = "GGraph";
        this._lineSize = 1;
        this._lineColor = new Color();
        this._fillColor = new Color(255, 255, 255, 255);
        this._content = this._node.addComponent(Graphics);
    }
    drawRect(lineSize, lineColor, fillColor, corner) {
        this._type = 1;
        this._lineSize = lineSize;
        this._lineColor.set(lineColor);
        this._fillColor.set(fillColor);
        this._cornerRadius = corner;
        this.updateGraph();
    }
    drawEllipse(lineSize, lineColor, fillColor) {
        this._type = 2;
        this._lineSize = lineSize;
        this._lineColor.set(lineColor);
        this._fillColor.set(fillColor);
        this.updateGraph();
    }
    drawRegularPolygon(lineSize, lineColor, fillColor, sides, startAngle, distances) {
        this._type = 4;
        this._lineSize = lineSize;
        this._lineColor.set(lineColor);
        this._fillColor.set(fillColor);
        this._sides = sides;
        this._startAngle = startAngle || 0;
        this._distances = distances;
        this.updateGraph();
    }
    drawPolygon(lineSize, lineColor, fillColor, points) {
        this._type = 3;
        this._lineSize = lineSize;
        this._lineColor.set(lineColor);
        this._fillColor.set(fillColor);
        this._polygonPoints = points;
        this.updateGraph();
    }
    get distances() {
        return this._distances;
    }
    set distances(value) {
        this._distances = value;
        if (this._type == 3)
            this.updateGraph();
    }
    clearGraphics() {
        this._type = 0;
        if (this._hasContent) {
            this._content.clear();
            this._hasContent = false;
        }
    }
    get type() {
        return this._type;
    }
    get color() {
        return this._fillColor;
    }
    set color(value) {
        this._fillColor.set(value);
        if (this._type != 0)
            this.updateGraph();
    }
    updateGraph() {
        let ctx = this._content;
        if (this._hasContent) {
            this._hasContent = false;
            ctx.clear();
        }
        var w = this._width;
        var h = this._height;
        if (w == 0 || h == 0)
            return;
        var px = -this.pivotX * this._width;
        var py = this.pivotY * this._height;
        let ls = this._lineSize / 2;
        ctx.lineWidth = this._lineSize;
        ctx.strokeColor = this._lineColor;
        ctx.fillColor = this._fillColor;
        if (this._type == 1) {
            if (this._cornerRadius) {
                ctx.roundRect(px + ls, -h + py + ls, w - this._lineSize, h - this._lineSize, this._cornerRadius[0]);
            }
            else
                ctx.rect(px + ls, -h + py + ls, w - this._lineSize, h - this._lineSize);
        }
        else if (this._type == 2) {
            ctx.ellipse(w / 2 + px, -h / 2 + py, w / 2 - ls, h / 2 - ls);
        }
        else if (this._type == 3) {
            this.drawPath(ctx, this._polygonPoints, px, py);
        }
        else if (this._type == 4) {
            if (!this._polygonPoints)
                this._polygonPoints = [];
            var radius = Math.min(w, h) / 2 - ls;
            this._polygonPoints.length = 0;
            var angle = misc.degreesToRadians(this._startAngle);
            var deltaAngle = 2 * Math.PI / this._sides;
            var dist;
            for (var i = 0; i < this._sides; i++) {
                if (this._distances) {
                    dist = this._distances[i];
                    if (isNaN(dist))
                        dist = 1;
                }
                else
                    dist = 1;
                var xv = radius + radius * dist * Math.cos(angle);
                var yv = radius + radius * dist * Math.sin(angle);
                this._polygonPoints.push(xv, yv);
                angle += deltaAngle;
            }
            this.drawPath(ctx, this._polygonPoints, px, py);
        }
        if (ls != 0)
            ctx.stroke();
        if (this._fillColor.a != 0)
            ctx.fill();
        this._hasContent = true;
    }
    drawPath(ctx, points, px, py) {
        var cnt = points.length;
        ctx.moveTo(points[0] + px, -points[1] + py);
        for (var i = 2; i < cnt; i += 2)
            ctx.lineTo(points[i] + px, -points[i + 1] + py);
        ctx.lineTo(points[0] + px, -points[1] + py);
    }
    handleSizeChanged() {
        super.handleSizeChanged();
        if (this._type != 0)
            this.updateGraph();
    }
    handleAnchorChanged() {
        super.handleAnchorChanged();
        if (this._type != 0)
            this.updateGraph();
    }
    getProp(index) {
        if (index == ObjectPropID.Color)
            return this.color;
        else
            return super.getProp(index);
    }
    setProp(index, value) {
        if (index == ObjectPropID.Color)
            this.color = value;
        else
            super.setProp(index, value);
    }
    _hitTest(pt) {
        if (pt.x >= 0 && pt.y >= 0 && pt.x < this._width && pt.y < this._height) {
            if (this._type == 3) {
                let points = this._polygonPoints;
                let len = points.length / 2;
                let i;
                let j = len - 1;
                let oddNodes = false;
                let w = this._width;
                let h = this._height;
                for (i = 0; i < len; ++i) {
                    let ix = points[i * 2];
                    let iy = points[i * 2 + 1];
                    let jx = points[j * 2];
                    let jy = points[j * 2 + 1];
                    if ((iy < pt.y && jy >= pt.y || jy < pt.y && iy >= pt.y) && (ix <= pt.x || jx <= pt.x)) {
                        if (ix + (pt.y - iy) / (jy - iy) * (jx - ix) < pt.x)
                            oddNodes = !oddNodes;
                    }
                    j = i;
                }
                return oddNodes ? this : null;
            }
            else
                return this;
        }
        else
            return null;
    }
    setup_beforeAdd(buffer, beginPos) {
        super.setup_beforeAdd(buffer, beginPos);
        buffer.seek(beginPos, 5);
        this._type = buffer.readByte();
        if (this._type != 0) {
            var i;
            var cnt;
            this._lineSize = buffer.readInt();
            this._lineColor.set(buffer.readColor(true));
            this._fillColor.set(buffer.readColor(true));
            if (buffer.readBool()) {
                this._cornerRadius = new Array(4);
                for (i = 0; i < 4; i++)
                    this._cornerRadius[i] = buffer.readFloat();
            }
            if (this._type == 3) {
                cnt = buffer.readShort();
                this._polygonPoints = [];
                this._polygonPoints.length = cnt;
                for (i = 0; i < cnt; i++)
                    this._polygonPoints[i] = buffer.readFloat();
            }
            else if (this._type == 4) {
                this._sides = buffer.readShort();
                this._startAngle = buffer.readFloat();
                cnt = buffer.readShort();
                if (cnt > 0) {
                    this._distances = [];
                    for (i = 0; i < cnt; i++)
                        this._distances[i] = buffer.readFloat();
                }
            }
            this.updateGraph();
        }
    }
}

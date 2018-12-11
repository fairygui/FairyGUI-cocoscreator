
namespace fgui {

    export class RelationItem {
        private _owner: GObject;
        private _target: GObject;
        private _defs: Array<RelationDef>;
        private _targetX: number;
        private _targetY: number;
        private _targetWidth: number;
        private _targetHeight: number;

        public constructor(owner: GObject) {
            this._owner = owner;
            this._defs = new Array<RelationDef>();
        }

        public get owner(): GObject {
            return this._owner;
        }

        public set target(value: GObject) {
            if (this._target != value) {
                if (this._target)
                    this.releaseRefTarget(this._target);
                this._target = value;
                if (this._target)
                    this.addRefTarget(this._target);
            }
        }

        public get target(): GObject {
            return this._target;
        }

        public add(relationType: number, usePercent?: boolean): void {
            if (relationType == RelationType.Size) {
                this.add(RelationType.Width, usePercent);
                this.add(RelationType.Height, usePercent);
                return;
            }

            var length: number = this._defs.length;
            for (var i: number = 0; i < length; i++) {
                var def: RelationDef = this._defs[i];
                if (def.type == relationType)
                    return;
            }

            this.internalAdd(relationType, usePercent);
        }

        public internalAdd(relationType: number, usePercent?: boolean): void {
            if (relationType == RelationType.Size) {
                this.internalAdd(RelationType.Width, usePercent);
                this.internalAdd(RelationType.Height, usePercent);
                return;
            }

            var info: RelationDef = new RelationDef();
            info.percent = usePercent;
            info.type = relationType;
            info.axis = (relationType <= RelationType.Right_Right || relationType == RelationType.Width || relationType >= RelationType.LeftExt_Left && relationType <= RelationType.RightExt_Right) ? 0 : 1;
            this._defs.push(info);

            //当使用中线关联时，因为需要除以2，很容易因为奇数宽度/高度造成小数点坐标；当使用百分比时，也会造成小数坐标；
            //所以设置了这类关联的对象，自动启用pixelSnapping
            if (usePercent || relationType == RelationType.Left_Center || relationType == RelationType.Center_Center || relationType == RelationType.Right_Center
                || relationType == RelationType.Top_Middle || relationType == RelationType.Middle_Middle || relationType == RelationType.Bottom_Middle)
                this._owner.pixelSnapping = true;
        }

        public remove(relationType: number): void {
            if (relationType == RelationType.Size) {
                this.remove(RelationType.Width);
                this.remove(RelationType.Height);
                return;
            }

            var dc: number = this._defs.length;
            for (var k: number = 0; k < dc; k++) {
                if (this._defs[k].type == relationType) {
                    this._defs.splice(k, 1);
                    break;
                }
            }
        }

        public copyFrom(source: RelationItem): void {
            this.target = source.target;

            this._defs.length = 0;
            var length: number = source._defs.length;
            for (var i: number = 0; i < length; i++) {
                var info: RelationDef = source._defs[i];
                var info2: RelationDef = new RelationDef();
                info2.copyFrom(info);
                this._defs.push(info2);
            }
        }

        public dispose(): void {
            if (this._target != null) {
                this.releaseRefTarget(this._target);
                this._target = null;
            }
        }

        public get isEmpty(): boolean {
            return this._defs.length == 0;
        }

        public applyOnSelfResized(dWidth: number, dHeight: number, applyPivot: boolean): void {
            var ox: number = this._owner.x;
            var oy: number = this._owner.y;

            var length: number = this._defs.length;
            for (var i: number = 0; i < length; i++) {
                var info: RelationDef = this._defs[i];
                switch (info.type) {
                    case RelationType.Center_Center:
                        this._owner.x -= (0.5 - (applyPivot ? this._owner.pivotX : 0)) * dWidth;
                        break;
                    case RelationType.Right_Center:
                    case RelationType.Right_Left:
                    case RelationType.Right_Right:
                        this._owner.x -= (1 - (applyPivot ? this._owner.pivotX : 0)) * dWidth;
                        break;

                    case RelationType.Middle_Middle:
                        this._owner.y -= (0.5 - (applyPivot ? this._owner.pivotY : 0)) * dHeight;
                        break;
                    case RelationType.Bottom_Middle:
                    case RelationType.Bottom_Top:
                    case RelationType.Bottom_Bottom:
                        this._owner.y -= (1 - (applyPivot ? this._owner.pivotY : 0)) * dHeight;
                        break;
                }
            }

            if (ox != this._owner.x || oy != this._owner.y) {
                ox = this._owner.x - ox;
                oy = this._owner.y - oy;

                this._owner.updateGearFromRelations(1, ox, oy);

                if (this._owner.parent != null) {
                    var len: number = this._owner.parent._transitions.length;
                    if (len > 0) {
                        for (var i: number = 0; i < len; ++i) {
                            this._owner.parent._transitions[i].updateFromRelations(this._owner.id, ox, oy);
                        }
                    }
                }
            }
        }

        private applyOnXYChanged(info: RelationDef, dx: number, dy: number): void {
            var tmp: number;

            switch (info.type) {
                case RelationType.Left_Left:
                case RelationType.Left_Center:
                case RelationType.Left_Right:
                case RelationType.Center_Center:
                case RelationType.Right_Left:
                case RelationType.Right_Center:
                case RelationType.Right_Right:
                    this._owner.x += dx;
                    break;

                case RelationType.Top_Top:
                case RelationType.Top_Middle:
                case RelationType.Top_Bottom:
                case RelationType.Middle_Middle:
                case RelationType.Bottom_Top:
                case RelationType.Bottom_Middle:
                case RelationType.Bottom_Bottom:
                    this._owner.y += dy;
                    break;

                case RelationType.Width:
                case RelationType.Height:
                    break;

                case RelationType.LeftExt_Left:
                case RelationType.LeftExt_Right:
                    tmp = this._owner.xMin;
                    this._owner.width = this._owner._rawWidth - dx;
                    this._owner.xMin = tmp + dx;
                    break;

                case RelationType.RightExt_Left:
                case RelationType.RightExt_Right:
                    tmp = this._owner.xMin;
                    this._owner.width = this._owner._rawWidth + dx;
                    this._owner.xMin = tmp;
                    break;

                case RelationType.TopExt_Top:
                case RelationType.TopExt_Bottom:
                    tmp = this._owner.yMin;
                    this._owner.height = this._owner._rawHeight - dy;
                    this._owner.yMin = tmp + dy;
                    break;

                case RelationType.BottomExt_Top:
                case RelationType.BottomExt_Bottom:
                    tmp = this._owner.yMin;
                    this._owner.height = this._owner._rawHeight + dy;
                    this._owner.yMin = tmp;
                    break;
            }
        }

        private applyOnSizeChanged(info: RelationDef): void {
            var pos: number = 0, pivot: number = 0, delta: number = 0;
            var v: number, tmp: number;

            if (info.axis == 0) {
                if (this._target != this._owner.parent) {
                    pos = this._target.x;
                    if (this._target.pivotAsAnchor)
                        pivot = this._target.pivotX;
                }

                if (info.percent) {
                    if (this._targetWidth != 0)
                        delta = this._target._width / this._targetWidth;
                }
                else
                    delta = this._target._width - this._targetWidth;
            }
            else {
                if (this._target != this._owner.parent) {
                    pos = this._target.y;
                    if (this._target.pivotAsAnchor)
                        pivot = this._target.pivotY;
                }

                if (info.percent) {
                    if (this._targetHeight != 0)
                        delta = this._target._height / this._targetHeight;
                }
                else
                    delta = this._target._height - this._targetHeight;
            }

            switch (info.type) {
                case RelationType.Left_Left:
                    if (info.percent)
                        this._owner.xMin = pos + (this._owner.xMin - pos) * delta;
                    else if (pivot != 0)
                        this._owner.x += delta * (-pivot);
                    break;
                case RelationType.Left_Center:
                    if (info.percent)
                        this._owner.xMin = pos + (this._owner.xMin - pos) * delta;
                    else
                        this._owner.x += delta * (0.5 - pivot);
                    break;
                case RelationType.Left_Right:
                    if (info.percent)
                        this._owner.xMin = pos + (this._owner.xMin - pos) * delta;
                    else
                        this._owner.x += delta * (1 - pivot);
                    break;
                case RelationType.Center_Center:
                    if (info.percent)
                        this._owner.xMin = pos + (this._owner.xMin + this._owner._rawWidth * 0.5 - pos) * delta - this._owner._rawWidth * 0.5;
                    else
                        this._owner.x += delta * (0.5 - pivot);
                    break;
                case RelationType.Right_Left:
                    if (info.percent)
                        this._owner.xMin = pos + (this._owner.xMin + this._owner._rawWidth - pos) * delta - this._owner._rawWidth;
                    else if (pivot != 0)
                        this._owner.x += delta * (-pivot);
                    break;
                case RelationType.Right_Center:
                    if (info.percent)
                        this._owner.xMin = pos + (this._owner.xMin + this._owner._rawWidth - pos) * delta - this._owner._rawWidth;
                    else
                        this._owner.x += delta * (0.5 - pivot);
                    break;
                case RelationType.Right_Right:
                    if (info.percent)
                        this._owner.xMin = pos + (this._owner.xMin + this._owner._rawWidth - pos) * delta - this._owner._rawWidth;
                    else
                        this._owner.x += delta * (1 - pivot);
                    break;

                case RelationType.Top_Top:
                    if (info.percent)
                        this._owner.yMin = pos + (this._owner.yMin - pos) * delta;
                    else if (pivot != 0)
                        this._owner.y += delta * (-pivot);
                    break;
                case RelationType.Top_Middle:
                    if (info.percent)
                        this._owner.yMin = pos + (this._owner.yMin - pos) * delta;
                    else
                        this._owner.y += delta * (0.5 - pivot);
                    break;
                case RelationType.Top_Bottom:
                    if (info.percent)
                        this._owner.yMin = pos + (this._owner.yMin - pos) * delta;
                    else
                        this._owner.y += delta * (1 - pivot);
                    break;
                case RelationType.Middle_Middle:
                    if (info.percent)
                        this._owner.yMin = pos + (this._owner.yMin + this._owner._rawHeight * 0.5 - pos) * delta - this._owner._rawHeight * 0.5;
                    else
                        this._owner.y += delta * (0.5 - pivot);
                    break;
                case RelationType.Bottom_Top:
                    if (info.percent)
                        this._owner.yMin = pos + (this._owner.yMin + this._owner._rawHeight - pos) * delta - this._owner._rawHeight;
                    else if (pivot != 0)
                        this._owner.y += delta * (-pivot);
                    break;
                case RelationType.Bottom_Middle:
                    if (info.percent)
                        this._owner.yMin = pos + (this._owner.yMin + this._owner._rawHeight - pos) * delta - this._owner._rawHeight;
                    else
                        this._owner.y += delta * (0.5 - pivot);
                    break;
                case RelationType.Bottom_Bottom:
                    if (info.percent)
                        this._owner.yMin = pos + (this._owner.yMin + this._owner._rawHeight - pos) * delta - this._owner._rawHeight;
                    else
                        this._owner.y += delta * (1 - pivot);
                    break;

                case RelationType.Width:
                    if (this._owner._underConstruct && this._owner == this._target.parent)
                        v = this._owner.sourceWidth - this._target.initWidth;
                    else
                        v = this._owner._rawWidth - this._targetWidth;
                    if (info.percent)
                        v = v * delta;
                    if (this._target == this._owner.parent) {
                        if (this._owner.pivotAsAnchor) {
                            tmp = this._owner.xMin;
                            this._owner.setSize(this._target._width + v, this._owner._rawHeight, true);
                            this._owner.xMin = tmp;
                        }
                        else
                            this._owner.setSize(this._target._width + v, this._owner._rawHeight, true);
                    }
                    else
                        this._owner.width = this._target._width + v;
                    break;
                case RelationType.Height:
                    if (this._owner._underConstruct && this._owner == this._target.parent)
                        v = this._owner.sourceHeight - this._target.initHeight;
                    else
                        v = this._owner._rawHeight - this._targetHeight;
                    if (info.percent)
                        v = v * delta;
                    if (this._target == this._owner.parent) {
                        if (this._owner.pivotAsAnchor) {
                            tmp = this._owner.yMin;
                            this._owner.setSize(this._owner._rawWidth, this._target._height + v, true);
                            this._owner.yMin = tmp;
                        }
                        else
                            this._owner.setSize(this._owner._rawWidth, this._target._height + v, true);
                    }
                    else
                        this._owner.height = this._target._height + v;
                    break;

                case RelationType.LeftExt_Left:
                    tmp = this._owner.xMin;
                    if (info.percent)
                        v = pos + (tmp - pos) * delta - tmp;
                    else
                        v = delta * (-pivot);
                    this._owner.width = this._owner._rawWidth - v;
                    this._owner.xMin = tmp + v;
                    break;
                case RelationType.LeftExt_Right:
                    tmp = this._owner.xMin;
                    if (info.percent)
                        v = pos + (tmp - pos) * delta - tmp;
                    else
                        v = delta * (1 - pivot);
                    this._owner.width = this._owner._rawWidth - v;
                    this._owner.xMin = tmp + v;
                    break;
                case RelationType.RightExt_Left:
                    tmp = this._owner.xMin;
                    if (info.percent)
                        v = pos + (tmp + this._owner._rawWidth - pos) * delta - (tmp + this._owner._rawWidth);
                    else
                        v = delta * (-pivot);
                    this._owner.width = this._owner._rawWidth + v;
                    this._owner.xMin = tmp;
                    break;
                case RelationType.RightExt_Right:
                    tmp = this._owner.xMin;
                    if (info.percent) {
                        if (this._owner == this._target.parent) {
                            if (this._owner._underConstruct)
                                this._owner.width = pos + this._target._width - this._target._width * pivot +
                                    (this._owner.sourceWidth - pos - this._target.initWidth + this._target.initWidth * pivot) * delta;
                            else
                                this._owner.width = pos + (this._owner._rawWidth - pos) * delta;
                        }
                        else {
                            v = pos + (tmp + this._owner._rawWidth - pos) * delta - (tmp + this._owner._rawWidth);
                            this._owner.width = this._owner._rawWidth + v;
                            this._owner.xMin = tmp;
                        }
                    }
                    else {
                        if (this._owner == this._target.parent) {
                            if (this._owner._underConstruct)
                                this._owner.width = this._owner.sourceWidth + (this._target._width - this._target.initWidth) * (1 - pivot);
                            else
                                this._owner.width = this._owner._rawWidth + delta * (1 - pivot);
                        }
                        else {
                            v = delta * (1 - pivot);
                            this._owner.width = this._owner._rawWidth + v;
                            this._owner.xMin = tmp;
                        }
                    }
                    break;
                case RelationType.TopExt_Top:
                    tmp = this._owner.yMin;
                    if (info.percent)
                        v = pos + (tmp - pos) * delta - tmp;
                    else
                        v = delta * (-pivot);
                    this._owner.height = this._owner._rawHeight - v;
                    this._owner.yMin = tmp + v;
                    break;
                case RelationType.TopExt_Bottom:
                    tmp = this._owner.yMin;
                    if (info.percent)
                        v = pos + (tmp - pos) * delta - tmp;
                    else
                        v = delta * (1 - pivot);
                    this._owner.height = this._owner._rawHeight - v;
                    this._owner.yMin = tmp + v;
                    break;
                case RelationType.BottomExt_Top:
                    tmp = this._owner.yMin;
                    if (info.percent)
                        v = pos + (tmp + this._owner._rawHeight - pos) * delta - (tmp + this._owner._rawHeight);
                    else
                        v = delta * (-pivot);
                    this._owner.height = this._owner._rawHeight + v;
                    this._owner.yMin = tmp;
                    break;
                case RelationType.BottomExt_Bottom:
                    tmp = this._owner.yMin;
                    if (info.percent) {
                        if (this._owner == this._target.parent) {
                            if (this._owner._underConstruct)
                                this._owner.height = pos + this._target._height - this._target._height * pivot +
                                    (this._owner.sourceHeight - pos - this._target.initHeight + this._target.initHeight * pivot) * delta;
                            else
                                this._owner.height = pos + (this._owner._rawHeight - pos) * delta;
                        }
                        else {
                            v = pos + (tmp + this._owner._rawHeight - pos) * delta - (tmp + this._owner._rawHeight);
                            this._owner.height = this._owner._rawHeight + v;
                            this._owner.yMin = tmp;
                        }
                    }
                    else {
                        if (this._owner == this._target.parent) {
                            if (this._owner._underConstruct)
                                this._owner.height = this._owner.sourceHeight + (this._target._height - this._target.initHeight) * (1 - pivot);
                            else
                                this._owner.height = this._owner._rawHeight + delta * (1 - pivot);
                        }
                        else {
                            v = delta * (1 - pivot);
                            this._owner.height = this._owner._rawHeight + v;
                            this._owner.yMin = tmp;
                        }
                    }
                    break;
            }
        }

        private addRefTarget(target: GObject): void {
            if (target != this._owner.parent)
                target.on(Event.XY_CHANGED, this.__targetXYChanged, this);
            target.on(Event.SIZE_CHANGED, this.__targetSizeChanged, this);
            target.on(Event.SIZE_DELAY_CHANGE, this.__targetSizeWillChange, this);

            this._targetX = this._target.x;
            this._targetY = this._target.y;
            this._targetWidth = this._target._width;
            this._targetHeight = this._target._height;
        }

        private releaseRefTarget(target: GObject): void {
            if (!target.node)
                return;
            target.off(Event.XY_CHANGED, this.__targetXYChanged, this);
            target.off(Event.SIZE_CHANGED, this.__targetSizeChanged, this);
            target.off(Event.SIZE_DELAY_CHANGE, this.__targetSizeWillChange, this);
        }

        private __targetXYChanged(evt: Event): void {
            if (this._owner.relations.handling != null || this._owner.group != null && this._owner.group._updating) {
                this._targetX = this._target.x;
                this._targetY = this._target.y;
                return;
            }

            this._owner.relations.handling = this._target;

            var ox: number = this._owner.x;
            var oy: number = this._owner.y;
            var dx: number = this._target.x - this._targetX;
            var dy: number = this._target.y - this._targetY;
            var length: number = this._defs.length;
            for (var i: number = 0; i < length; i++) {
                var info: RelationDef = this._defs[i];
                this.applyOnXYChanged(info, dx, dy);
            }
            this._targetX = this._target.x;
            this._targetY = this._target.y;

            if (ox != this._owner.x || oy != this._owner.y) {
                ox = this._owner.x - ox;
                oy = this._owner.y - oy;

                this._owner.updateGearFromRelations(1, ox, oy);

                if (this._owner.parent != null) {
                    var len: number = this._owner.parent._transitions.length;
                    if (len > 0) {
                        for (var i: number = 0; i < len; ++i) {
                            this._owner.parent._transitions[i].updateFromRelations(this._owner.id, ox, oy);
                        }
                    }
                }
            }
            this._owner.relations.handling = null;
        }

        private __targetSizeChanged(evt: Event): void {
            if (this._owner.relations.handling != null)
                return;

            this._owner.relations.handling = this._target;

            var ox: number = this._owner.x;
            var oy: number = this._owner.y;
            var ow: number = this._owner._rawWidth;
            var oh: number = this._owner._rawHeight;
            var length: number = this._defs.length;
            for (var i: number = 0; i < length; i++) {
                var info: RelationDef = this._defs[i];
                this.applyOnSizeChanged(info);
            }
            this._targetWidth = this._target._width;
            this._targetHeight = this._target._height;

            if (ox != this._owner.x || oy != this._owner.y) {
                ox = this._owner.x - ox;
                oy = this._owner.y - oy;

                this._owner.updateGearFromRelations(1, ox, oy);

                if (this._owner.parent != null) {
                    var len: number = this._owner.parent._transitions.length;
                    if (len > 0) {
                        for (var i: number = 0; i < len; ++i) {
                            this._owner.parent._transitions[i].updateFromRelations(this._owner.id, ox, oy);
                        }
                    }
                }
            }

            if (ow != this._owner._rawWidth || oh != this._owner._rawHeight) {
                ow = this._owner._rawWidth - ow;
                oh = this._owner._rawHeight - oh;

                this._owner.updateGearFromRelations(2, ow, oh);
            }

            this._owner.relations.handling = null;
        }

        private __targetSizeWillChange(evt: Event): void {
            this._owner.relations.sizeDirty = true;
        }
    }

    export class RelationDef {
        public percent: boolean;
        public type: number;
        public axis: number;

        public constructor() {
        }

        public copyFrom(source: RelationDef): void {
            this.percent = source.percent;
            this.type = source.type;
            this.axis = source.axis;
        }
    }
}
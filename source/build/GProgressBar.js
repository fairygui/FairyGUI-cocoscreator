import { math } from "cc";
import { ProgressTitleType, ObjectPropID, FillMethod } from "./FieldTypes";
import { GComponent } from "./GComponent";
import { GImage } from "./GImage";
import { GLoader } from "./GLoader";
import { EaseType } from "./tween/EaseType";
import { GTween } from "./tween/GTween";
export class GProgressBar extends GComponent {
    constructor() {
        super();
        this._min = 0;
        this._max = 0;
        this._value = 0;
        this._barMaxWidth = 0;
        this._barMaxHeight = 0;
        this._barMaxWidthDelta = 0;
        this._barMaxHeightDelta = 0;
        this._barStartX = 0;
        this._barStartY = 0;
        this._node.name = "GProgressBar";
        this._titleType = ProgressTitleType.Percent;
        this._value = 50;
        this._max = 100;
    }
    get titleType() {
        return this._titleType;
    }
    set titleType(value) {
        if (this._titleType != value) {
            this._titleType = value;
            this.update(this._value);
        }
    }
    get min() {
        return this._min;
    }
    set min(value) {
        if (this._min != value) {
            this._min = value;
            this.update(this._value);
        }
    }
    get max() {
        return this._max;
    }
    set max(value) {
        if (this._max != value) {
            this._max = value;
            this.update(this._value);
        }
    }
    get value() {
        return this._value;
    }
    set value(value) {
        if (this._value != value) {
            GTween.kill(this, false, this.update);
            this._value = value;
            this.update(value);
        }
    }
    tweenValue(value, duration) {
        var oldValule;
        var tweener = GTween.getTween(this, this.update);
        if (tweener) {
            oldValule = tweener.value.x;
            tweener.kill();
        }
        else
            oldValule = this._value;
        this._value = value;
        return GTween.to(oldValule, this._value, duration).setTarget(this, this.update).setEase(EaseType.Linear);
    }
    update(newValue) {
        var percent = math.clamp01((newValue - this._min) / (this._max - this._min));
        if (this._titleObject) {
            switch (this._titleType) {
                case ProgressTitleType.Percent:
                    this._titleObject.text = Math.floor(percent * 100) + "%";
                    break;
                case ProgressTitleType.ValueAndMax:
                    this._titleObject.text = Math.floor(newValue) + "/" + Math.floor(this._max);
                    break;
                case ProgressTitleType.Value:
                    this._titleObject.text = "" + Math.floor(newValue);
                    break;
                case ProgressTitleType.Max:
                    this._titleObject.text = "" + Math.floor(this._max);
                    break;
            }
        }
        var fullWidth = this.width - this._barMaxWidthDelta;
        var fullHeight = this.height - this._barMaxHeightDelta;
        if (!this._reverse) {
            if (this._barObjectH) {
                if (!this.setFillAmount(this._barObjectH, percent))
                    this._barObjectH.width = Math.round(fullWidth * percent);
            }
            if (this._barObjectV) {
                if (!this.setFillAmount(this._barObjectV, percent))
                    this._barObjectV.height = Math.round(fullHeight * percent);
            }
        }
        else {
            if (this._barObjectH) {
                if (!this.setFillAmount(this._barObjectH, 1 - percent)) {
                    this._barObjectH.width = Math.round(fullWidth * percent);
                    this._barObjectH.x = this._barStartX + (fullWidth - this._barObjectH.width);
                }
            }
            if (this._barObjectV) {
                if (!this.setFillAmount(this._barObjectV, 1 - percent)) {
                    this._barObjectV.height = Math.round(fullHeight * percent);
                    this._barObjectV.y = this._barStartY + (fullHeight - this._barObjectV.height);
                }
            }
        }
        if (this._aniObject)
            this._aniObject.setProp(ObjectPropID.Frame, Math.floor(percent * 100));
    }
    setFillAmount(bar, percent) {
        if (((bar instanceof GImage) || (bar instanceof GLoader)) && bar.fillMethod != FillMethod.None) {
            bar.fillAmount = percent;
            return true;
        }
        else
            return false;
    }
    constructExtension(buffer) {
        buffer.seek(0, 6);
        this._titleType = buffer.readByte();
        this._reverse = buffer.readBool();
        this._titleObject = this.getChild("title");
        this._barObjectH = this.getChild("bar");
        this._barObjectV = this.getChild("bar_v");
        this._aniObject = this.getChild("ani");
        if (this._barObjectH) {
            this._barMaxWidth = this._barObjectH.width;
            this._barMaxWidthDelta = this.width - this._barMaxWidth;
            this._barStartX = this._barObjectH.x;
        }
        if (this._barObjectV) {
            this._barMaxHeight = this._barObjectV.height;
            this._barMaxHeightDelta = this.height - this._barMaxHeight;
            this._barStartY = this._barObjectV.y;
        }
    }
    handleSizeChanged() {
        super.handleSizeChanged();
        if (this._barObjectH)
            this._barMaxWidth = this.width - this._barMaxWidthDelta;
        if (this._barObjectV)
            this._barMaxHeight = this.height - this._barMaxHeightDelta;
        if (!this._underConstruct)
            this.update(this._value);
    }
    setup_afterAdd(buffer, beginPos) {
        super.setup_afterAdd(buffer, beginPos);
        if (!buffer.seek(beginPos, 6)) {
            this.update(this._value);
            return;
        }
        if (buffer.readByte() != this.packageItem.objectType) {
            this.update(this._value);
            return;
        }
        this._value = buffer.readInt();
        this._max = buffer.readInt();
        if (buffer.version >= 2)
            this._min = buffer.readInt();
        this.update(this._value);
    }
}

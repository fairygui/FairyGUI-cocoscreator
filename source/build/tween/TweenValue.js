export class TweenValue {
    constructor() {
        this.x = this.y = this.z = this.w = 0;
    }
    get color() {
        return (this.w << 24) + (this.x << 16) + (this.y << 8) + this.z;
    }
    set color(value) {
        this.x = (value & 0xFF0000) >> 16;
        this.y = (value & 0x00FF00) >> 8;
        this.z = (value & 0x0000FF);
        this.w = (value & 0xFF000000) >> 24;
    }
    getField(index) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            case 3:
                return this.w;
            default:
                throw new Error("Index out of bounds: " + index);
        }
    }
    setField(index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            case 3:
                this.w = value;
                break;
            default:
                throw new Error("Index out of bounds: " + index);
        }
    }
    setZero() {
        this.x = this.y = this.z = this.w = 0;
    }
}

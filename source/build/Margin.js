export class Margin {
    constructor() {
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
    }
    copy(source) {
        this.top = source.top;
        this.bottom = source.bottom;
        this.left = source.left;
        this.right = source.right;
    }
    isNone() {
        return this.left == 0 && this.right == 0 && this.top == 0 && this.bottom == 0;
    }
}

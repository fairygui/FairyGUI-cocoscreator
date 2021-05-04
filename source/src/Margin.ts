
export class Margin {
    public left: number = 0;
    public right: number = 0;
    public top: number = 0;
    public bottom: number = 0;

    public constructor() {
    }

    public copy(source: Margin): void {
        this.top = source.top;
        this.bottom = source.bottom;
        this.left = source.left;
        this.right = source.right;
    }

    public isNone(): boolean {
        return this.left == 0 && this.right == 0 && this.top == 0 && this.bottom == 0;
    }
}
namespace fgui {
    export class GTreeNode {
        public data: any;

        private _parent: GTreeNode;
        private _children: Array<GTreeNode>;
        private _expanded: boolean = false;
        private _level: number = 0;
        private _tree: GTree;

        public _cell: GComponent;
        public _resURL: string;

        constructor(hasChild: boolean, resURL?: string) {
            this._resURL = resURL;
            if (hasChild)
                this._children = new Array<GTreeNode>();
        }

        public set expanded(value: boolean) {
            if (this._children == null)
                return;

            if (this._expanded != value) {
                this._expanded = value;
                if (this._tree != null) {
                    if (this._expanded)
                        this._tree._afterExpanded(this);
                    else
                        this._tree._afterCollapsed(this);
                }
            }
        }

        public get expanded(): boolean {
            return this._expanded;
        }

        public get isFolder(): boolean {
            return this._children != null;
        }

        public get parent(): GTreeNode {
            return this._parent;
        }

        public get text(): string {
            if (this._cell != null)
                return this._cell.text;
            else
                return null;
        }

        public set text(value: string) {
            if (this._cell != null)
                this._cell.text = value;
        }

        public get icon(): string {
            if (this._cell != null)
                return this._cell.icon;
            else
                return null;
        }

        public set icon(value: string) {
            if (this._cell != null)
                this._cell.icon = value;
        }

        public get cell(): GComponent {
            return this._cell;
        }

        public get level(): number {
            return this._level;
        }

        public _setLevel(value: number): void {
            this._level = value;
        }

        public addChild(child: GTreeNode): GTreeNode {
            this.addChildAt(child, this._children.length);
            return child;
        }

        public addChildAt(child: GTreeNode, index: number): GTreeNode {
            if (!child)
                throw new Error("child is null");

            var numChildren: number = this._children.length;

            if (index >= 0 && index <= numChildren) {
                if (child._parent == this) {
                    this.setChildIndex(child, index);
                }
                else {
                    if (child._parent)
                        child._parent.removeChild(child);

                    var cnt: number = this._children.length;
                    if (index == cnt)
                        this._children.push(child);
                    else
                        this._children.splice(index, 0, child);

                    child._parent = this;
                    child._level = this._level + 1;
                    child._setTree(this._tree);
                    if (this._tree != null && this == this._tree.rootNode || this._cell != null && this._cell.parent != null && this._expanded)
                        this._tree._afterInserted(child);
                }

                return child;
            }
            else {
                throw new RangeError("Invalid child index");
            }
        }

        public removeChild(child: GTreeNode): GTreeNode {
            var childIndex: number = this._children.indexOf(child);
            if (childIndex != -1) {
                this.removeChildAt(childIndex);
            }
            return child;
        }

        public removeChildAt(index: number): GTreeNode {
            if (index >= 0 && index < this.numChildren) {
                var child: GTreeNode = this._children[index];
                this._children.splice(index, 1);

                child._parent = null;
                if (this._tree != null) {
                    child._setTree(null);
                    this._tree._afterRemoved(child);
                }

                return child;
            }
            else {
                throw "Invalid child index";
            }
        }

        public removeChildren(beginIndex: number = 0, endIndex: number = -1): void {
            if (endIndex < 0 || endIndex >= this.numChildren)
                endIndex = this.numChildren - 1;

            for (var i: number = beginIndex; i <= endIndex; ++i)
                this.removeChildAt(beginIndex);
        }

        public getChildAt(index: number): GTreeNode {
            if (index >= 0 && index < this.numChildren)
                return this._children[index];
            else
                throw "Invalid child index";
        }

        public getChildIndex(child: GTreeNode): number {
            return this._children.indexOf(child);
        }

        public getPrevSibling(): GTreeNode {
            if (this._parent == null)
                return null;

            var i: number = this._parent._children.indexOf(this);
            if (i <= 0)
                return null;

            return this._parent._children[i - 1];
        }

        public getNextSibling(): GTreeNode {
            if (this._parent == null)
                return null;

            var i: number = this._parent._children.indexOf(this);
            if (i < 0 || i >= this._parent._children.length - 1)
                return null;

            return this._parent._children[i + 1];
        }

        public setChildIndex(child: GTreeNode, index: number): void {
            var oldIndex: number = this._children.indexOf(child);
            if (oldIndex == -1)
                throw "Not a child of this container";

            var cnt: number = this._children.length;
            if (index < 0)
                index = 0;
            else if (index > cnt)
                index = cnt;

            if (oldIndex == index)
                return;

            this._children.splice(oldIndex, 1);
            this._children.splice(index, 0, child);
            if (this._tree != null && this == this._tree.rootNode || this._cell != null && this._cell.parent != null && this._expanded)
                this._tree._afterMoved(child);
        }

        public swapChildren(child1: GTreeNode, child2: GTreeNode): void {
            var index1: number = this._children.indexOf(child1);
            var index2: number = this._children.indexOf(child2);
            if (index1 == -1 || index2 == -1)
                throw "Not a child of this container";
            this.swapChildrenAt(index1, index2);
        }

        public swapChildrenAt(index1: number, index2: number): void {
            var child1: GTreeNode = this._children[index1];
            var child2: GTreeNode = this._children[index2];

            this.setChildIndex(child1, index2);
            this.setChildIndex(child2, index1);
        }

        public get numChildren(): number {
            return this._children.length;
        }

        public expandToRoot(): void {
            var p: GTreeNode = this;
            while (p) {
                p.expanded = true;
                p = p.parent;
            }
        }

        public get tree(): GTree {
            return this._tree;
        }

        public _setTree(value: GTree): void {
            this._tree = value;
            if (this._tree != null && this._tree.treeNodeWillExpand && this._expanded)
                this._tree.treeNodeWillExpand(this, true);

            if (this._children != null) {
                var cnt: number = this._children.length;
                for (var i: number = 0; i < cnt; i++) {
                    var node: GTreeNode = this._children[i];
                    node._level = this._level + 1;
                    node._setTree(value);
                }
            }
        }
    }
}
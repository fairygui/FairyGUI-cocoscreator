export class GTreeNode {
    constructor(hasChild, resURL) {
        this._level = 0;
        this._resURL = resURL;
        if (hasChild)
            this._children = new Array();
    }
    set expanded(value) {
        if (this._children == null)
            return;
        if (this._expanded != value) {
            this._expanded = value;
            if (this._tree) {
                if (this._expanded)
                    this._tree._afterExpanded(this);
                else
                    this._tree._afterCollapsed(this);
            }
        }
    }
    get expanded() {
        return this._expanded;
    }
    get isFolder() {
        return this._children != null;
    }
    get parent() {
        return this._parent;
    }
    get text() {
        if (this._cell)
            return this._cell.text;
        else
            return null;
    }
    set text(value) {
        if (this._cell)
            this._cell.text = value;
    }
    get icon() {
        if (this._cell)
            return this._cell.icon;
        else
            return null;
    }
    set icon(value) {
        if (this._cell)
            this._cell.icon = value;
    }
    get cell() {
        return this._cell;
    }
    get level() {
        return this._level;
    }
    _setLevel(value) {
        this._level = value;
    }
    addChild(child) {
        this.addChildAt(child, this._children.length);
        return child;
    }
    addChildAt(child, index) {
        if (!child)
            throw new Error("child is null");
        var numChildren = this._children.length;
        if (index >= 0 && index <= numChildren) {
            if (child._parent == this) {
                this.setChildIndex(child, index);
            }
            else {
                if (child._parent)
                    child._parent.removeChild(child);
                var cnt = this._children.length;
                if (index == cnt)
                    this._children.push(child);
                else
                    this._children.splice(index, 0, child);
                child._parent = this;
                child._level = this._level + 1;
                child._setTree(this._tree);
                if (this._tree && this == this._tree.rootNode || this._cell && this._cell.parent && this._expanded)
                    this._tree._afterInserted(child);
            }
            return child;
        }
        else {
            throw new RangeError("Invalid child index");
        }
    }
    removeChild(child) {
        var childIndex = this._children.indexOf(child);
        if (childIndex != -1) {
            this.removeChildAt(childIndex);
        }
        return child;
    }
    removeChildAt(index) {
        if (index >= 0 && index < this.numChildren) {
            var child = this._children[index];
            this._children.splice(index, 1);
            child._parent = null;
            if (this._tree) {
                child._setTree(null);
                this._tree._afterRemoved(child);
            }
            return child;
        }
        else {
            throw "Invalid child index";
        }
    }
    removeChildren(beginIndex, endIndex) {
        beginIndex = beginIndex || 0;
        if (endIndex == null)
            endIndex = -1;
        if (endIndex < 0 || endIndex >= this.numChildren)
            endIndex = this.numChildren - 1;
        for (var i = beginIndex; i <= endIndex; ++i)
            this.removeChildAt(beginIndex);
    }
    getChildAt(index) {
        if (index >= 0 && index < this.numChildren)
            return this._children[index];
        else
            throw "Invalid child index";
    }
    getChildIndex(child) {
        return this._children.indexOf(child);
    }
    getPrevSibling() {
        if (this._parent == null)
            return null;
        var i = this._parent._children.indexOf(this);
        if (i <= 0)
            return null;
        return this._parent._children[i - 1];
    }
    getNextSibling() {
        if (this._parent == null)
            return null;
        var i = this._parent._children.indexOf(this);
        if (i < 0 || i >= this._parent._children.length - 1)
            return null;
        return this._parent._children[i + 1];
    }
    setChildIndex(child, index) {
        var oldIndex = this._children.indexOf(child);
        if (oldIndex == -1)
            throw "Not a child of this container";
        var cnt = this._children.length;
        if (index < 0)
            index = 0;
        else if (index > cnt)
            index = cnt;
        if (oldIndex == index)
            return;
        this._children.splice(oldIndex, 1);
        this._children.splice(index, 0, child);
        if (this._tree && this == this._tree.rootNode || this._cell && this._cell.parent && this._expanded)
            this._tree._afterMoved(child);
    }
    swapChildren(child1, child2) {
        var index1 = this._children.indexOf(child1);
        var index2 = this._children.indexOf(child2);
        if (index1 == -1 || index2 == -1)
            throw "Not a child of this container";
        this.swapChildrenAt(index1, index2);
    }
    swapChildrenAt(index1, index2) {
        var child1 = this._children[index1];
        var child2 = this._children[index2];
        this.setChildIndex(child1, index2);
        this.setChildIndex(child2, index1);
    }
    get numChildren() {
        return this._children.length;
    }
    expandToRoot() {
        var p = this;
        while (p) {
            p.expanded = true;
            p = p.parent;
        }
    }
    get tree() {
        return this._tree;
    }
    _setTree(value) {
        this._tree = value;
        if (this._tree && this._tree.treeNodeWillExpand && this._expanded)
            this._tree.treeNodeWillExpand(this, true);
        if (this._children) {
            var cnt = this._children.length;
            for (var i = 0; i < cnt; i++) {
                var node = this._children[i];
                node._level = this._level + 1;
                node._setTree(value);
            }
        }
    }
}

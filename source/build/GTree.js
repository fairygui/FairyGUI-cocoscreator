import { Event as FUIEvent } from "./event/Event";
import { GComponent } from "./GComponent";
import { GList } from "./GList";
import { GObject } from "./GObject";
import { GTreeNode } from "./GTreeNode";
export class GTree extends GList {
    constructor() {
        super();
        this._indent = 15;
        this._rootNode = new GTreeNode(true);
        this._rootNode._setTree(this);
        this._rootNode.expanded = true;
    }
    get rootNode() {
        return this._rootNode;
    }
    get indent() {
        return this._indent;
    }
    set indent(value) {
        this._indent = value;
    }
    get clickToExpand() {
        return this._clickToExpand;
    }
    set clickToExpand(value) {
        this._clickToExpand = value;
    }
    getSelectedNode() {
        if (this.selectedIndex != -1)
            return this.getChildAt(this.selectedIndex)._treeNode;
        else
            return null;
    }
    getSelectedNodes(result) {
        if (!result)
            result = new Array();
        s_list.length = 0;
        super.getSelection(s_list);
        var cnt = s_list.length;
        var ret = new Array();
        for (var i = 0; i < cnt; i++) {
            var node = this.getChildAt(s_list[i])._treeNode;
            ret.push(node);
        }
        return ret;
    }
    selectNode(node, scrollItToView) {
        var parentNode = node.parent;
        while (parentNode && parentNode != this._rootNode) {
            parentNode.expanded = true;
            parentNode = parentNode.parent;
        }
        if (!node._cell)
            return;
        this.addSelection(this.getChildIndex(node._cell), scrollItToView);
    }
    unselectNode(node) {
        if (!node._cell)
            return;
        this.removeSelection(this.getChildIndex(node._cell));
    }
    expandAll(folderNode) {
        if (!folderNode)
            folderNode = this._rootNode;
        folderNode.expanded = true;
        var cnt = folderNode.numChildren;
        for (var i = 0; i < cnt; i++) {
            var node = folderNode.getChildAt(i);
            if (node.isFolder)
                this.expandAll(node);
        }
    }
    collapseAll(folderNode) {
        if (!folderNode)
            folderNode = this._rootNode;
        if (folderNode != this._rootNode)
            folderNode.expanded = false;
        var cnt = folderNode.numChildren;
        for (var i = 0; i < cnt; i++) {
            var node = folderNode.getChildAt(i);
            if (node.isFolder)
                this.collapseAll(node);
        }
    }
    createCell(node) {
        var child = this.getFromPool(node._resURL);
        if (!(child instanceof GComponent))
            throw new Error("cannot create tree node object.");
        child._treeNode = node;
        node._cell = child;
        var indentObj = child.getChild("indent");
        if (indentObj)
            indentObj.width = (node.level - 1) * this._indent;
        var cc;
        cc = child.getController("expanded");
        if (cc) {
            cc.on(FUIEvent.STATUS_CHANGED, this.__expandedStateChanged, this);
            cc.selectedIndex = node.expanded ? 1 : 0;
        }
        cc = child.getController("leaf");
        if (cc)
            cc.selectedIndex = node.isFolder ? 0 : 1;
        if (node.isFolder)
            node._cell.on(FUIEvent.TOUCH_BEGIN, this.__cellMouseDown, this);
        if (this.treeNodeRender)
            this.treeNodeRender(node, child);
    }
    _afterInserted(node) {
        if (!node._cell)
            this.createCell(node);
        var index = this.getInsertIndexForNode(node);
        this.addChildAt(node._cell, index);
        if (this.treeNodeRender)
            this.treeNodeRender(node, node._cell);
        if (node.isFolder && node.expanded)
            this.checkChildren(node, index);
    }
    getInsertIndexForNode(node) {
        var prevNode = node.getPrevSibling();
        if (prevNode == null)
            prevNode = node.parent;
        var insertIndex = this.getChildIndex(prevNode._cell) + 1;
        var myLevel = node.level;
        var cnt = this.numChildren;
        for (var i = insertIndex; i < cnt; i++) {
            var testNode = this.getChildAt(i)._treeNode;
            if (testNode.level <= myLevel)
                break;
            insertIndex++;
        }
        return insertIndex;
    }
    _afterRemoved(node) {
        this.removeNode(node);
    }
    _afterExpanded(node) {
        if (node == this._rootNode) {
            this.checkChildren(this._rootNode, 0);
            return;
        }
        if (this.treeNodeWillExpand != null)
            this.treeNodeWillExpand(node, true);
        if (node._cell == null)
            return;
        if (this.treeNodeRender)
            this.treeNodeRender(node, node._cell);
        var cc = node._cell.getController("expanded");
        if (cc)
            cc.selectedIndex = 1;
        if (node._cell.parent)
            this.checkChildren(node, this.getChildIndex(node._cell));
    }
    _afterCollapsed(node) {
        if (node == this._rootNode) {
            this.checkChildren(this._rootNode, 0);
            return;
        }
        if (this.treeNodeWillExpand)
            this.treeNodeWillExpand(node, false);
        if (node._cell == null)
            return;
        if (this.treeNodeRender)
            this.treeNodeRender(node, node._cell);
        var cc = node._cell.getController("expanded");
        if (cc)
            cc.selectedIndex = 0;
        if (node._cell.parent)
            this.hideFolderNode(node);
    }
    _afterMoved(node) {
        var startIndex = this.getChildIndex(node._cell);
        var endIndex;
        if (node.isFolder)
            endIndex = this.getFolderEndIndex(startIndex, node.level);
        else
            endIndex = startIndex + 1;
        var insertIndex = this.getInsertIndexForNode(node);
        var i;
        var cnt = endIndex - startIndex;
        var obj;
        if (insertIndex < startIndex) {
            for (i = 0; i < cnt; i++) {
                obj = this.getChildAt(startIndex + i);
                this.setChildIndex(obj, insertIndex + i);
            }
        }
        else {
            for (i = 0; i < cnt; i++) {
                obj = this.getChildAt(startIndex);
                this.setChildIndex(obj, insertIndex);
            }
        }
    }
    getFolderEndIndex(startIndex, level) {
        var cnt = this.numChildren;
        for (var i = startIndex + 1; i < cnt; i++) {
            var node = this.getChildAt(i)._treeNode;
            if (node.level <= level)
                return i;
        }
        return cnt;
    }
    checkChildren(folderNode, index) {
        var cnt = folderNode.numChildren;
        for (var i = 0; i < cnt; i++) {
            index++;
            var node = folderNode.getChildAt(i);
            if (node._cell == null)
                this.createCell(node);
            if (!node._cell.parent)
                this.addChildAt(node._cell, index);
            if (node.isFolder && node.expanded)
                index = this.checkChildren(node, index);
        }
        return index;
    }
    hideFolderNode(folderNode) {
        var cnt = folderNode.numChildren;
        for (var i = 0; i < cnt; i++) {
            var node = folderNode.getChildAt(i);
            if (node._cell)
                this.removeChild(node._cell);
            if (node.isFolder && node.expanded)
                this.hideFolderNode(node);
        }
    }
    removeNode(node) {
        if (node._cell) {
            if (node._cell.parent)
                this.removeChild(node._cell);
            this.returnToPool(node._cell);
            node._cell._treeNode = null;
            node._cell = null;
        }
        if (node.isFolder) {
            var cnt = node.numChildren;
            for (var i = 0; i < cnt; i++) {
                var node2 = node.getChildAt(i);
                this.removeNode(node2);
            }
        }
    }
    __cellMouseDown(evt) {
        var node = GObject.cast(evt.currentTarget)._treeNode;
        this._expandedStatusInEvt = node.expanded;
    }
    __expandedStateChanged(cc) {
        var node = cc.parent._treeNode;
        node.expanded = cc.selectedIndex == 1;
    }
    dispatchItemEvent(item, evt) {
        if (this._clickToExpand != 0) {
            var node = item._treeNode;
            if (node && this._expandedStatusInEvt == node.expanded) {
                if (this._clickToExpand == 2) {
                    //if (evt.clickCount == 2)
                    // node.expanded = !node.expanded;
                }
                else
                    node.expanded = !node.expanded;
            }
        }
        super.dispatchItemEvent(item, evt);
    }
    setup_beforeAdd(buffer, beginPos) {
        super.setup_beforeAdd(buffer, beginPos);
        buffer.seek(beginPos, 9);
        this._indent = buffer.readInt();
        this._clickToExpand = buffer.readByte();
    }
    readItems(buffer) {
        var cnt;
        var i;
        var nextPos;
        var str;
        var isFolder;
        var lastNode;
        var level;
        var prevLevel = 0;
        cnt = buffer.readShort();
        for (i = 0; i < cnt; i++) {
            nextPos = buffer.readShort();
            nextPos += buffer.position;
            str = buffer.readS();
            if (str == null) {
                str = this.defaultItem;
                if (!str) {
                    buffer.position = nextPos;
                    continue;
                }
            }
            isFolder = buffer.readBool();
            level = buffer.readByte();
            var node = new GTreeNode(isFolder, str);
            node.expanded = true;
            if (i == 0)
                this._rootNode.addChild(node);
            else {
                if (level > prevLevel)
                    lastNode.addChild(node);
                else if (level < prevLevel) {
                    for (var j = level; j <= prevLevel; j++)
                        lastNode = lastNode.parent;
                    lastNode.addChild(node);
                }
                else
                    lastNode.parent.addChild(node);
            }
            lastNode = node;
            prevLevel = level;
            this.setupItem(buffer, node.cell);
            buffer.position = nextPos;
        }
    }
}
var s_list = new Array();

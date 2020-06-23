namespace fgui {
    export class GTree extends GList {

        public treeNodeRender: (node: GTreeNode, obj: GComponent) => void;
        public treeNodeWillExpand: (node: GTreeNode, expanded: boolean) => void;

        private _indent: number;
        private _clickToExpand: number;
        private _rootNode: GTreeNode;
        private _expandedStatusInEvt: boolean;

        constructor() {
            super();

            this._indent = 15;

            this._rootNode = new GTreeNode(true);
            this._rootNode._setTree(this);
            this._rootNode.expanded = true;
        }

        public get rootNode(): GTreeNode {
            return this._rootNode;
        }

        public get indent(): number {
            return this._indent;
        }

        public set indent(value: number) {
            this._indent = value;
        }

        public get clickToExpand(): number {
            return this._clickToExpand;
        }

        public set clickToExpand(value: number) {
            this._clickToExpand = value;
        }

        public getSelectedNode(): GTreeNode {
            if (this.selectedIndex != -1)
                return this.getChildAt(this.selectedIndex)._treeNode;
            else
                return null;
        }

        public getSelectedNodes(result?: Array<GTreeNode>): Array<GTreeNode> {
            if (!result)
                result = new Array<GTreeNode>();

            s_list.length = 0;
            super.getSelection(s_list);
            var cnt: number = s_list.length;
            var ret: Array<GTreeNode> = new Array<GTreeNode>();
            for (var i: number = 0; i < cnt; i++) {
                var node: GTreeNode = this.getChildAt(s_list[i])._treeNode;
                ret.push(node);
            }
            return ret;
        }

        public selectNode(node: GTreeNode, scrollItToView?: boolean): void {
            var parentNode: GTreeNode = node.parent;
            while (parentNode && parentNode != this._rootNode) {
                parentNode.expanded = true;
                parentNode = parentNode.parent;
            }

            if (!node._cell)
                return;

            this.addSelection(this.getChildIndex(node._cell), scrollItToView);
        }

        public unselectNode(node: GTreeNode): void {
            if (!node._cell)
                return;

            this.removeSelection(this.getChildIndex(node._cell));
        }

        public expandAll(folderNode?: GTreeNode): void {
            if (!folderNode)
                folderNode = this._rootNode;

            folderNode.expanded = true;
            var cnt: number = folderNode.numChildren;
            for (var i: number = 0; i < cnt; i++) {
                var node: GTreeNode = folderNode.getChildAt(i);
                if (node.isFolder)
                    this.expandAll(node);
            }
        }

        public collapseAll(folderNode?: GTreeNode): void {
            if (!folderNode)
                folderNode = this._rootNode;

            if (folderNode != this._rootNode)
                folderNode.expanded = false;
            var cnt: number = folderNode.numChildren;
            for (var i: number = 0; i < cnt; i++) {
                var node: GTreeNode = folderNode.getChildAt(i);
                if (node.isFolder)
                    this.collapseAll(node);
            }
        }

        private createCell(node: GTreeNode): void {
            var child: GObject = this.getFromPool(node._resURL);
            if (!(child instanceof GComponent))
                throw new Error("cannot create tree node object.");

            child._treeNode = node;
            node._cell = child;

            var indentObj: GObject = child.getChild("indent");
            if (indentObj)
                indentObj.width = (node.level - 1) * this._indent;

            var cc: Controller;

            cc = child.getController("expanded");
            if (cc) {
                cc.on(Event.STATUS_CHANGED, this.__expandedStateChanged, this);
                cc.selectedIndex = node.expanded ? 1 : 0;
            }

            cc = child.getController("leaf");
            if (cc)
                cc.selectedIndex = node.isFolder ? 0 : 1;

            if (node.isFolder)
                node._cell.on(Event.TOUCH_BEGIN, this.__cellMouseDown, this);

            if (this.treeNodeRender)
                this.treeNodeRender(node, child);
        }

        public _afterInserted(node: GTreeNode): void {
            if (!node._cell)
                this.createCell(node);

            var index: number = this.getInsertIndexForNode(node);
            this.addChildAt(node._cell, index);
            if (this.treeNodeRender)
                this.treeNodeRender(node, node._cell);

            if (node.isFolder && node.expanded)
                this.checkChildren(node, index);
        }

        private getInsertIndexForNode(node: GTreeNode): number {
            var prevNode: GTreeNode = node.getPrevSibling();
            if (prevNode == null)
                prevNode = node.parent;
            var insertIndex: number = this.getChildIndex(prevNode._cell) + 1;
            var myLevel: number = node.level;
            var cnt: number = this.numChildren;
            for (var i: number = insertIndex; i < cnt; i++) {
                var testNode: GTreeNode = this.getChildAt(i)._treeNode;
                if (testNode.level <= myLevel)
                    break;

                insertIndex++;
            }

            return insertIndex;
        }

        public _afterRemoved(node: GTreeNode): void {
            this.removeNode(node);
        }

        public _afterExpanded(node: GTreeNode): void {
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

            var cc: Controller = node._cell.getController("expanded");
            if (cc)
                cc.selectedIndex = 1;

            if (node._cell.parent)
                this.checkChildren(node, this.getChildIndex(node._cell));
        }

        public _afterCollapsed(node: GTreeNode): void {
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

            var cc: Controller = node._cell.getController("expanded");
            if (cc)
                cc.selectedIndex = 0;

            if (node._cell.parent)
                this.hideFolderNode(node);
        }

        public _afterMoved(node: GTreeNode): void {
            var startIndex: number = this.getChildIndex(node._cell);
            var endIndex: number;
            if (node.isFolder)
                endIndex = this.getFolderEndIndex(startIndex, node.level);
            else
                endIndex = startIndex + 1;
            var insertIndex: number = this.getInsertIndexForNode(node);
            var i: number;
            var cnt: number = endIndex - startIndex;
            var obj: GObject;
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

        private getFolderEndIndex(startIndex: number, level: number): number {
            var cnt: number = this.numChildren;
            for (var i: number = startIndex + 1; i < cnt; i++) {
                var node: GTreeNode = this.getChildAt(i)._treeNode;
                if (node.level <= level)
                    return i;
            }

            return cnt;
        }

        private checkChildren(folderNode: GTreeNode, index: number): number {
            var cnt: number = folderNode.numChildren;
            for (var i: number = 0; i < cnt; i++) {
                index++;
                var node: GTreeNode = folderNode.getChildAt(i);
                if (node._cell == null)
                    this.createCell(node);

                if (!node._cell.parent)
                    this.addChildAt(node._cell, index);

                if (node.isFolder && node.expanded)
                    index = this.checkChildren(node, index);
            }

            return index;
        }

        private hideFolderNode(folderNode: GTreeNode): void {
            var cnt: number = folderNode.numChildren;
            for (var i: number = 0; i < cnt; i++) {
                var node: GTreeNode = folderNode.getChildAt(i);
                if (node._cell)
                    this.removeChild(node._cell);
                if (node.isFolder && node.expanded)
                    this.hideFolderNode(node);
            }
        }

        private removeNode(node: GTreeNode): void {
            if (node._cell) {
                if (node._cell.parent)
                    this.removeChild(node._cell);
                this.returnToPool(node._cell);
                node._cell._treeNode = null;
                node._cell = null;
            }

            if (node.isFolder) {
                var cnt: number = node.numChildren;
                for (var i: number = 0; i < cnt; i++) {
                    var node2: GTreeNode = node.getChildAt(i);
                    this.removeNode(node2);
                }
            }
        }

        private __cellMouseDown(evt: Event): void {
            var node: GTreeNode = GObject.cast(evt.currentTarget)._treeNode;
            this._expandedStatusInEvt = node.expanded;
        }

        private __expandedStateChanged(cc: Controller): void {
            var node: GTreeNode = cc.parent._treeNode;
            node.expanded = cc.selectedIndex == 1;
        }

        protected dispatchItemEvent(item: GObject, evt: Event): void {
            if (this._clickToExpand != 0) {
                var node: GTreeNode = item._treeNode;
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

        public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
            super.setup_beforeAdd(buffer, beginPos);

            buffer.seek(beginPos, 9);

            this._indent = buffer.readInt();
            this._clickToExpand = buffer.readByte();
        }

        protected readItems(buffer: ByteBuffer): void {
            var cnt: number;
            var i: number;
            var nextPos: number;
            var str: string;
            var isFolder: boolean;
            var lastNode: GTreeNode;
            var level: number;
            var prevLevel: number = 0;

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

                var node: GTreeNode = new GTreeNode(isFolder, str);
                node.expanded = true;
                if (i == 0)
                    this._rootNode.addChild(node);
                else {
                    if (level > prevLevel)
                        lastNode.addChild(node);
                    else if (level < prevLevel) {
                        for (var j: number = level; j <= prevLevel; j++)
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

    var s_list: Array<number> = new Array<number>();
}
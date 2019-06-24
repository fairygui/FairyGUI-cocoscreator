namespace fgui {
    export class TreeView {
        private _list: GList;
        private _root: TreeNode;
        private _indent: number;

		/**
		 * 当需要为节点创建一个显示对象时调用
		 */
        public treeNodeCreateCell: (node: TreeNode) => GComponent;
		/**
		 * 当节点需要渲染时调用
		 */
        public treeNodeRender: (node: TreeNode) => void;
		/**
		 * 当目录节点展开或者收缩时调用。可以用节点的expanded属性判断目标状态。
		 */
        public treeNodeWillExpand: (node: TreeNode) => void;
		/**
		 * 当节点被点击时调用
		 */
        public treeNodeClick: (node: TreeNode, evt: Event) => void;;

        public constructor(list: GList) {
            this._list = list;
            this._list.removeChildrenToPool();
            this._list.on(Event.CLICK_ITEM, this.onClickItem, this);

            this._root = new TreeNode(true);
            this._root._setTree(this);
            this._root._setCell(this._list);
            this._root.expanded = true;

            this._indent = 15;
        }

        public get list(): GList {
            return this._list;
        }

        public get root(): TreeNode {
            return this._root;
        }

        public get indent(): number {
            return this._indent;
        }

        public set indent(value: number) {
            this._indent = value;
        }

        public getSelectedNode(): TreeNode {
            if (this._list.selectedIndex != -1)
                return <TreeNode>this._list.getChildAt(this._list.selectedIndex).data;
            else
                return null;
        }

        public getSelection(): Array<TreeNode> {
            var sels: Array<number> = this._list.getSelection();
            var cnt: number = sels.length;
            var ret: Array<TreeNode> = new Array<TreeNode>();
            for (var i: number = 0; i < cnt; i++) {
                var node: TreeNode = <TreeNode>this._list.getChildAt(sels[i]).data;
                ret.push(node);
            }
            return ret;
        }

        public addSelection(node: TreeNode, scrollItToView?: boolean): void {
            var parentNode: TreeNode = node.parent;
            while (parentNode != null && parentNode != this._root) {
                parentNode.expanded = true;
                parentNode = parentNode.parent;
            }

            if (!node.cell)
                return;

            this._list.addSelection(this._list.getChildIndex(node.cell), scrollItToView);
        }

        public removeSelection(node: TreeNode): void {
            if (!node.cell)
                return;

            this._list.removeSelection(this._list.getChildIndex(node.cell));
        }

        public clearSelection(): void {
            this._list.clearSelection();
        }

        public getNodeIndex(node: TreeNode): number {
            return this._list.getChildIndex(node.cell);
        }

        public updateNode(node: TreeNode): void {
            if (node.cell == null)
                return;

            if (this.treeNodeRender)
                this.treeNodeRender(node);
        }

        public updateNodes(nodes: Array<TreeNode>): void {
            var cnt: number = nodes.length;
            for (var i: number = 0; i < cnt; i++) {
                var node: TreeNode = nodes[i];
                if (node.cell == null)
                    return;

                if (this.treeNodeRender)
                    this.treeNodeRender(node);
            }
        }

        public expandAll(folderNode: TreeNode): void {
            folderNode.expanded = true;
            var cnt: number = folderNode.numChildren;
            for (var i: number = 0; i < cnt; i++) {
                var node: TreeNode = folderNode.getChildAt(i);
                if (node.isFolder)
                    this.expandAll(node);
            }
        }

        public collapseAll(folderNode: TreeNode): void {
            if (folderNode != this._root)
                folderNode.expanded = false;
            var cnt: number = folderNode.numChildren;
            for (var i: number = 0; i < cnt; i++) {
                var node: TreeNode = folderNode.getChildAt(i);
                if (node.isFolder)
                    this.collapseAll(node);
            }
        }

        private createCell(node: TreeNode): void {
            if (this.treeNodeCreateCell)
                node._setCell(this.treeNodeCreateCell(node));
            else
                node._setCell(<GComponent>this._list.itemPool.getObject(this._list.defaultItem));
            node.cell.data = node;

            var indentObj: GObject = node.cell.getChild("indent");
            if (indentObj != null)
                indentObj.width = (node.level - 1) * this._indent;

            var expandButton: GButton = <GButton>node.cell.getChild("expandButton");
            if (expandButton) {
                if (node.isFolder) {
                    expandButton.visible = true;
                    expandButton.onClick(this.onClickExpandButton, this);
                    expandButton.data = node;
                    expandButton.selected = node.expanded;
                }
                else
                    expandButton.visible = false;
            }

            if (this.treeNodeRender)
                this.treeNodeRender(node);
        }

        public _afterInserted(node: TreeNode): void {
            this.createCell(node);

            var index: number = this.getInsertIndexForNode(node);
            this._list.addChildAt(node.cell, index);
            if (this.treeNodeRender)
                this.treeNodeRender(node);

            if (node.isFolder && node.expanded)
                this.checkChildren(node, index);
        }

        private getInsertIndexForNode(node: TreeNode): number {
            var prevNode: TreeNode = node.getPrevSibling();
            if (prevNode == null)
                prevNode = node.parent;
            var insertIndex: number = this._list.getChildIndex(prevNode.cell) + 1;
            var myLevel: number = node.level;
            var cnt: number = this._list.numChildren;
            for (var i: number = insertIndex; i < cnt; i++) {
                var testNode: TreeNode = <TreeNode>this._list.getChildAt(i).data;
                if (testNode.level <= myLevel)
                    break;

                insertIndex++;
            }

            return insertIndex;
        }

        public _afterRemoved(node: TreeNode): void {
            this.removeNode(node);
        }

        public _afterExpanded(node: TreeNode): void {
            if (node != this._root && this.treeNodeWillExpand)
                this.treeNodeWillExpand(node);

            if (node.cell == null)
                return;

            if (node != this._root) {
                if (this.treeNodeRender)
                    this.treeNodeRender(node);

                var expandButton: GButton = <GButton>node.cell.getChild("expandButton");
                if (expandButton)
                    expandButton.selected = true;
            }

            if (node.cell.parent != null)
                this.checkChildren(node, this._list.getChildIndex(node.cell));
        }

        public _afterCollapsed(node: TreeNode): void {
            if (node != this._root && this.treeNodeWillExpand)
                this.treeNodeWillExpand(node);

            if (node.cell == null)
                return;

            if (node != this._root) {
                if (this.treeNodeRender)
                    this.treeNodeRender(node);

                var expandButton: GButton = <GButton>node.cell.getChild("expandButton");
                if (expandButton)
                    expandButton.selected = false;
            }

            if (node.cell.parent != null)
                this.hideFolderNode(node);
        }

        public _afterMoved(node: TreeNode): void {
            if (!node.isFolder)
                this._list.removeChild(node.cell);
            else
                this.hideFolderNode(node);

            var index: number = this.getInsertIndexForNode(node);
            this._list.addChildAt(node.cell, index);

            if (node.isFolder && node.expanded)
                this.checkChildren(node, index);
        }

        private checkChildren(folderNode: TreeNode, index: number): number {
            var cnt: number = folderNode.numChildren;
            for (var i: number = 0; i < cnt; i++) {
                index++;
                var node: TreeNode = folderNode.getChildAt(i);
                if (node.cell == null)
                    this.createCell(node);

                if (!node.cell.parent)
                    this._list.addChildAt(node.cell, index);

                if (node.isFolder && node.expanded)
                    index = this.checkChildren(node, index);
            }

            return index;
        }

        private hideFolderNode(folderNode: TreeNode): void {
            var cnt: number = folderNode.numChildren;
            for (var i: number = 0; i < cnt; i++) {
                var node: TreeNode = folderNode.getChildAt(i);
                if (node.cell && node.cell.parent != null)
                    this._list.removeChild(node.cell);
                if (node.isFolder && node.expanded)
                    this.hideFolderNode(node);
            }
        }

        private removeNode(node: TreeNode): void {
            if (node.cell != null) {
                if (node.cell.parent != null)
                    this._list.removeChild(node.cell);
                this._list.returnToPool(node.cell);
                node.cell.data = null;
                node._setCell(null);
            }

            if (node.isFolder) {
                var cnt: number = node.numChildren;
                for (var i: number = 0; i < cnt; i++) {
                    var node2: TreeNode = node.getChildAt(i);
                    this.removeNode(node2);
                }
            }
        }

        private onClickExpandButton(evt: Event): void {
            evt.stopPropagation();

            var expandButton: GButton = <GButton>GObject.cast(evt.currentTarget);
            var node: TreeNode = <TreeNode>expandButton.parent.data;
            if (this._list.scrollPane != null) {
                var posY: number = this._list.scrollPane.posY;
                if (expandButton.selected)
                    node.expanded = true;
                else
                    node.expanded = false;
                this._list.scrollPane.posY = posY;
                this._list.scrollPane.scrollToView(node.cell);
            }
            else {
                if (expandButton.selected)
                    node.expanded = true;
                else
                    node.expanded = false;
            }
        }

        private onClickItem(item: GObject, evt: Event): void {
            var posY: number;
            if (this._list.scrollPane != null)
                posY = this._list.scrollPane.posY;

            var node: TreeNode = <TreeNode>item.data;
            if (this.treeNodeClick)
                this.treeNodeClick(node, evt);

            if (this._list.scrollPane != null) {
                this._list.scrollPane.posY = posY;
                if (node.cell)
                    this._list.scrollPane.scrollToView(node.cell);
            }
        }
    }
}

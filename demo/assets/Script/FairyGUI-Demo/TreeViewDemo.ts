const { ccclass, property } = cc._decorator;

@ccclass
export default class TreeViewDemo extends cc.Component {
    private _view: fgui.GComponent;
    private _tree1: fgui.GTree;
    private _tree2: fgui.GTree;
    private _fileURL: string;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/TreeView", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("TreeView", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);
        this._fileURL = "ui://TreeView/file";

        this._tree1 = this._view.getChild("tree").asTree;
        this._tree1.on(fgui.Event.CLICK_ITEM, this.__clickNode, this);
        this._tree2 = this._view.getChild("tree2").asTree;
        this._tree2.on(fgui.Event.CLICK_ITEM, this.__clickNode, this);
        this._tree2.treeNodeRender = this.renderTreeNode.bind(this);

        var topNode: fgui.GTreeNode = new fgui.GTreeNode(true);
        topNode.data = "I'm a top node";
        this._tree2.rootNode.addChild(topNode);
        for (var i: number = 0; i < 5; i++) {
            var node: fgui.GTreeNode = new fgui.GTreeNode(false);
            node.data = "Hello " + i;
            topNode.addChild(node);
        }

        var aFolderNode: fgui.GTreeNode = new fgui.GTreeNode(true);
        aFolderNode.data = "A folder node";
        topNode.addChild(aFolderNode);
        for (var i: number = 0; i < 5; i++) {
            var node: fgui.GTreeNode = new fgui.GTreeNode(false);
            node.data = "Good " + i;
            aFolderNode.addChild(node);
        }

        for (var i: number = 0; i < 3; i++) {
            var node: fgui.GTreeNode = new fgui.GTreeNode(false);
            node.data = "World " + i;
            topNode.addChild(node);
        }

        var anotherTopNode: fgui.GTreeNode = new fgui.GTreeNode(false);
        anotherTopNode.data = ["I'm a top node too", "ui://TreeView/heart"];
        this._tree2.rootNode.addChild(anotherTopNode);
    }

    private renderTreeNode(node: fgui.GTreeNode, obj: fgui.GComponent) {
        if (node.isFolder) {
            obj.text = node.data;
        }
        else if (node.data instanceof Array) {
            obj.icon = (<any>node.data)[1];
            obj.text = (<any>node.data)[0];
        }
        else {
            obj.icon = this._fileURL;
            obj.text = node.data;
        }
    }

    private __clickNode(itemObject: fgui.GObject) {
        var node: fgui.GTreeNode = itemObject.treeNode;
        console.log(node.text);
    }
}

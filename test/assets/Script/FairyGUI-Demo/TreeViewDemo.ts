const {ccclass, property} = cc._decorator;

@ccclass
export default class TreeViewDemo extends cc.Component {
    private _view: fgui.GComponent;
	private _treeView: fgui.TreeView;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/TreeView", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("TreeView", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._treeView = new fgui.TreeView(this._view.getChild("tree").asList);
        this._treeView.treeNodeClick = this.__clickNode.bind(this);
        this._treeView.treeNodeRender = this.renderTreeNode.bind(this);

        var topNode: fgui.TreeNode = new fgui.TreeNode(true);
        topNode.data = "I'm a top node";
        this._treeView.root.addChild(topNode);
        for (var i: number = 0; i < 5; i++) {
            var node: fgui.TreeNode = new fgui.TreeNode(false);
            node.data = "Hello " + i;
            topNode.addChild(node);
        }

        var aFolderNode: fgui.TreeNode = new fgui.TreeNode(true);
        aFolderNode.data = "A folder node";
        topNode.addChild(aFolderNode);
        for (var i: number = 0; i < 5; i++) {
            var node: fgui.TreeNode = new fgui.TreeNode(false);
            node.data = "Good " + i;
            aFolderNode.addChild(node);
        }

        for (var i: number = 0; i < 3; i++) {
            var node: fgui.TreeNode = new fgui.TreeNode(false);
            node.data = "World " + i;
            topNode.addChild(node);
        }

        var anotherTopNode: fgui.TreeNode = new fgui.TreeNode(false);
        anotherTopNode.data = { title: "I'm a top node too", icon: "ui://TreeView/heart" };
        this._treeView.root.addChild(anotherTopNode);
    }

    private renderTreeNode(node: fgui.TreeNode) {
        var btn: fgui.GButton = <fgui.GButton>node.cell;
        if (node.isFolder) {
            if (node.expanded)
                btn.icon = "ui://TreeView/folder_opened";
            else
                btn.icon = "ui://TreeView/folder_closed";
            btn.title = node.data;
        }
        else if (node.data.icon) {
            btn.icon = node.data.icon;
            btn.title = node.data.title;
        }
        else {
            btn.icon = "ui://TreeView/file";
            btn.title = node.data;
        }
    }

    private __clickNode(node: fgui.TreeNode, evt: fgui.Event) {
        if (node.isFolder)
            node.expanded = !node.expanded;
    }
}

import { Component, director, game, Node } from "cc";
import { PackageItemType, ObjectType } from "./FieldTypes";
import { constructingDepth } from "./GObject";
import { UIConfig } from "./UIConfig";
import { UIObjectFactory } from "./UIObjectFactory";
import { UIPackage } from "./UIPackage";
export class AsyncOperation {
    createObject(pkgName, resName) {
        if (this._node)
            throw 'Already running';
        var pkg = UIPackage.getByName(pkgName);
        if (pkg) {
            var pi = pkg.getItemByName(resName);
            if (!pi)
                throw new Error("resource not found: " + resName);
            this.internalCreateObject(pi);
        }
        else
            throw new Error("package not found: " + pkgName);
    }
    createObjectFromURL(url) {
        if (this._node)
            throw 'Already running';
        var pi = UIPackage.getItemByURL(url);
        if (pi)
            this.internalCreateObject(pi);
        else
            throw new Error("resource not found: " + url);
    }
    cancel() {
        if (this._node) {
            this._node.destroy();
            this._node = null;
        }
    }
    internalCreateObject(item) {
        this._node = new Node("[AsyncCreating:" + item.name + "]");
        game.addPersistRootNode(this._node);
        this._node.on("#", this.completed, this);
        this._node.addComponent(AsyncOperationRunner).init(item);
    }
    completed(result) {
        this.cancel();
        if (this.callback)
            this.callback(result);
    }
}
class AsyncOperationRunner extends Component {
    constructor() {
        super();
        this._itemList = new Array();
        this._objectPool = new Array();
    }
    init(item) {
        this._itemList.length = 0;
        this._objectPool.length = 0;
        var di = { pi: item, type: item.objectType };
        di.childCount = this.collectComponentChildren(item);
        this._itemList.push(di);
        this._index = 0;
    }
    onDestroy() {
        this._itemList.length = 0;
        var cnt = this._objectPool.length;
        if (cnt > 0) {
            for (var i = 0; i < cnt; i++)
                this._objectPool[i].dispose();
            this._objectPool.length = 0;
        }
    }
    collectComponentChildren(item) {
        var buffer = item.rawData;
        buffer.seek(0, 2);
        var di;
        var pi;
        var i;
        var dataLen;
        var curPos;
        var pkg;
        var dcnt = buffer.readShort();
        for (i = 0; i < dcnt; i++) {
            dataLen = buffer.readShort();
            curPos = buffer.position;
            buffer.seek(curPos, 0);
            var type = buffer.readByte();
            var src = buffer.readS();
            var pkgId = buffer.readS();
            buffer.position = curPos;
            if (src != null) {
                if (pkgId != null)
                    pkg = UIPackage.getById(pkgId);
                else
                    pkg = item.owner;
                pi = pkg != null ? pkg.getItemById(src) : null;
                di = { pi: pi, type: type };
                if (pi && pi.type == PackageItemType.Component)
                    di.childCount = this.collectComponentChildren(pi);
            }
            else {
                di = { type: type };
                if (type == ObjectType.List) //list
                    di.listItemCount = this.collectListChildren(buffer);
            }
            this._itemList.push(di);
            buffer.position = curPos + dataLen;
        }
        return dcnt;
    }
    collectListChildren(buffer) {
        buffer.seek(buffer.position, 8);
        var listItemCount = 0;
        var i;
        var nextPos;
        var url;
        var pi;
        var di;
        var defaultItem = buffer.readS();
        var itemCount = buffer.readShort();
        for (i = 0; i < itemCount; i++) {
            nextPos = buffer.readShort();
            nextPos += buffer.position;
            url = buffer.readS();
            if (url == null)
                url = defaultItem;
            if (url) {
                pi = UIPackage.getItemByURL(url);
                if (pi) {
                    di = { pi: pi, type: pi.objectType };
                    if (pi.type == PackageItemType.Component)
                        di.childCount = this.collectComponentChildren(pi);
                    this._itemList.push(di);
                    listItemCount++;
                }
            }
            buffer.position = nextPos;
        }
        return listItemCount;
    }
    update() {
        var obj;
        var di;
        var poolStart;
        var k;
        var t = director.getTotalTime() / 1000;
        var frameTime = UIConfig.frameTimeForAsyncUIConstruction;
        var totalItems = this._itemList.length;
        while (this._index < totalItems) {
            di = this._itemList[this._index];
            if (di.pi) {
                obj = UIObjectFactory.newObject(di.pi);
                this._objectPool.push(obj);
                constructingDepth.n++;
                if (di.pi.type == PackageItemType.Component) {
                    poolStart = this._objectPool.length - di.childCount - 1;
                    obj.constructFromResource2(this._objectPool, poolStart);
                    this._objectPool.splice(poolStart, di.childCount);
                }
                else {
                    obj.constructFromResource();
                }
                constructingDepth.n--;
            }
            else {
                obj = UIObjectFactory.newObject(di.type);
                this._objectPool.push(obj);
                if (di.type == ObjectType.List && di.listItemCount > 0) {
                    poolStart = this._objectPool.length - di.listItemCount - 1;
                    for (k = 0; k < di.listItemCount; k++) //把他们都放到pool里，这样GList在创建时就不需要创建对象了
                        obj.itemPool.returnObject(this._objectPool[k + poolStart]);
                    this._objectPool.splice(poolStart, di.listItemCount);
                }
            }
            this._index++;
            if ((this._index % 5 == 0) && director.getTotalTime() / 1000 - t >= frameTime)
                return;
        }
        var result = this._objectPool[0];
        this._itemList.length = 0;
        this._objectPool.length = 0;
        this.node.emit("#", result);
    }
}

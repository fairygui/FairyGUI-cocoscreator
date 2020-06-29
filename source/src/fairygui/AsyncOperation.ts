namespace fgui {

    export class AsyncOperation {
        public callback: (obj: GObject) => void;

        private _node: cc.Node;

        public createObject(pkgName: string, resName: string): void {
            if (this._node)
                throw 'Already running';

            var pkg: UIPackage = UIPackage.getByName(pkgName);
            if (pkg) {
                var pi: PackageItem = pkg.getItemByName(resName);
                if (!pi)
                    throw new Error("resource not found: " + resName);

                this.internalCreateObject(pi);
            }
            else
                throw new Error("package not found: " + pkgName);
        }

        public createObjectFromURL(url: string): void {
            if (this._node)
                throw 'Already running';

            var pi: PackageItem = UIPackage.getItemByURL(url);
            if (pi)
                this.internalCreateObject(pi);
            else
                throw new Error("resource not found: " + url);
        }

        public cancel(): void {
            if (this._node) {
                this._node.destroy();
                this._node = null;
            }
        }

        private internalCreateObject(item: PackageItem): void {
            this._node = new cc.Node("[AsyncCreating:" + item.name + "]");
            this._node.parent = cc.director.getScene();
            this._node.on("#", this.completed, this);
            this._node.addComponent(AsyncOperationRunner).init(item);
        }

        private completed(result: GObject): void {
            this.cancel();

            if (this.callback)
                this.callback(result);
        }
    }

    class AsyncOperationRunner extends cc.Component {

        private _itemList: Array<DisplayListItem>;
        private _objectPool: Array<GObject>;
        private _index: number;

        public constructor() {
            super();

            this._itemList = new Array<DisplayListItem>();
            this._objectPool = new Array<GObject>();
        }

        public init(item: PackageItem): void {
            this._itemList.length = 0;
            this._objectPool.length = 0;

            var di: DisplayListItem = { pi: item, type: item.objectType };
            di.childCount = this.collectComponentChildren(item);
            this._itemList.push(di);

            this._index = 0;
        }

        protected onDestroy(): void {
            this._itemList.length = 0;
            var cnt: number = this._objectPool.length;
            if (cnt > 0) {
                for (var i: number = 0; i < cnt; i++)
                    this._objectPool[i].dispose();
                this._objectPool.length = 0;
            }
        }

        private collectComponentChildren(item: PackageItem): number {
            var buffer: ByteBuffer = item.rawData;
            buffer.seek(0, 2);

            var di: DisplayListItem;
            var pi: PackageItem;
            var i: number;
            var dataLen: number;
            var curPos: number;
            var pkg: UIPackage;

            var dcnt: number = buffer.readShort();
            for (i = 0; i < dcnt; i++) {
                dataLen = buffer.readShort();
                curPos = buffer.position;

                buffer.seek(curPos, 0);

                var type: number = buffer.readByte();
                var src: string = buffer.readS();
                var pkgId: string = buffer.readS();

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

        private collectListChildren(buffer: ByteBuffer): number {
            buffer.seek(buffer.position, 8);

            var listItemCount: number = 0;
            var i: number;
            var nextPos: number;
            var url: string;
            var pi: PackageItem;
            var di: DisplayListItem;
            var defaultItem: string = buffer.readS();
            var itemCount: number = buffer.readShort();

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

        protected update(): void {
            var obj: GObject;
            var di: DisplayListItem;
            var poolStart: number;
            var k: number;
            var t: number = ToolSet.getTime();
            var frameTime: number = UIConfig.frameTimeForAsyncUIConstruction;
            var totalItems: number = this._itemList.length;

            while (this._index < totalItems) {
                di = this._itemList[this._index];
                if (di.pi) {
                    obj = UIObjectFactory.newObject(di.pi);
                    this._objectPool.push(obj);

                    UIPackage._constructing++;
                    if (di.pi.type == PackageItemType.Component) {
                        poolStart = this._objectPool.length - di.childCount - 1;

                        (<GComponent>obj).constructFromResource2(this._objectPool, poolStart);

                        this._objectPool.splice(poolStart, di.childCount);
                    }
                    else {
                        obj.constructFromResource();
                    }
                    UIPackage._constructing--;
                }
                else {
                    obj = UIObjectFactory.newObject(di.type);
                    this._objectPool.push(obj);

                    if (di.type == ObjectType.List && di.listItemCount > 0) {
                        poolStart = this._objectPool.length - di.listItemCount - 1;

                        for (k = 0; k < di.listItemCount; k++) //把他们都放到pool里，这样GList在创建时就不需要创建对象了
                            (<GList>obj).itemPool.returnObject(this._objectPool[k + poolStart]);

                        this._objectPool.splice(poolStart, di.listItemCount);
                    }
                }

                this._index++;
                if ((this._index % 5 == 0) && ToolSet.getTime() - t >= frameTime)
                    return;
            }

            var result: GObject = this._objectPool[0];
            this._itemList.length = 0;
            this._objectPool.length = 0;

            this.node.emit("#", result);
        }
    }

    interface DisplayListItem {
        type: ObjectType;
        pi?: PackageItem;
        childCount?: number;
        listItemCount?: number;
    }
}

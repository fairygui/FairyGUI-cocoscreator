
namespace fgui {

    export class UIPackage {
        private _id: string;
        private _name: string;
        private _items: Array<PackageItem>;
        private _itemsById: any;
        private _itemsByName: any;
        private _url: string;
        private _sprites: any;
        private _dependencies: Array<any>;
        private _branches: Array<string>;
        public _branchIndex: number;

        public static _constructing: number = 0;

        private static _instById: any = {};
        private static _instByName: any = {};
        private static _branch: string = "";
        private static _vars: any = {};

        public constructor() {
            this._items = new Array<PackageItem>();
            this._itemsById = {};
            this._itemsByName = {};
            this._sprites = {};
            this._dependencies = Array<any>();
            this._branches = Array<string>();
            this._branchIndex = -1;
        }

        public static get branch(): string {
            return UIPackage._branch;
        }

        public static set branch(value: string) {
            UIPackage._branch = value;
            for (var pkgId in UIPackage._instById) {
                var pkg: UIPackage = UIPackage._instById[pkgId];
                if (pkg._branches) {
                    pkg._branchIndex = pkg._branches.indexOf(value);
                }
            }
        }

        public static getVar(key: string): any {
            return UIPackage._vars[key];
        }

        public static setVar(key: string, value: any) {
            UIPackage._vars[key] = value;
        }

        public static getById(id: string): UIPackage {
            return UIPackage._instById[id];
        }

        public static getByName(name: string): UIPackage {
            return UIPackage._instByName[name];
        }

        public static addPackage(url: string): UIPackage {
            let pkg: UIPackage = UIPackage._instById[url];
            if (pkg)
                return pkg;

            let asset: any = cc.loader.getRes(url);
            if (!asset)
                throw "Resource '" + url + "' not ready";

            if (!asset.rawBuffer)
                throw "Missing asset data. Call UIConfig.registerLoader first!";

            pkg = new UIPackage();
            pkg.loadPackage(new ByteBuffer(asset.rawBuffer), url);
            UIPackage._instById[pkg.id] = pkg;
            UIPackage._instByName[pkg.name] = pkg;
            UIPackage._instById[pkg._url] = pkg;
            return pkg;
        }

        public static loadPackage(url: string, completeCallback: ((error: any) => void) | null): void {
            cc.loader.loadRes(url, function (err, asset) {
                if (err) {
                    completeCallback(err);
                    return;
                }

                if (!asset.rawBuffer)
                    throw "Missing asset data. Call UIConfig.registerLoader first!";

                let pkg: UIPackage = new UIPackage();
                pkg.loadPackage(new ByteBuffer(asset.rawBuffer), url);
                let cnt: number = pkg._items.length;
                let urls = [];
                for (var i: number = 0; i < cnt; i++) {
                    var pi: PackageItem = pkg._items[i];
                    if (pi.type == PackageItemType.Atlas || pi.type == PackageItemType.Sound)
                        urls.push(pi.file);
                }

                cc.loader.loadResArray(urls, function (err, assets) {
                    if (!err) {
                        UIPackage._instById[pkg.id] = pkg;
                        UIPackage._instByName[pkg.name] = pkg;
                    }

                    completeCallback(err);
                });
            });
        }

        public static removePackage(packageIdOrName: string): void {
            var pkg: UIPackage = UIPackage._instById[packageIdOrName];
            if (!pkg)
                pkg = UIPackage._instByName[packageIdOrName];
            if (!pkg)
                throw "No package found: " + packageIdOrName;
            pkg.dispose();
            delete UIPackage._instById[pkg.id];
            if (pkg._url != null)
                delete UIPackage._instById[pkg._url];
            delete UIPackage._instByName[pkg.name];
        }

        public static createObject(pkgName: string, resName: string, userClass: any = null): GObject {
            var pkg: UIPackage = UIPackage.getByName(pkgName);
            if (pkg)
                return pkg.createObject(resName, userClass);
            else
                return null;
        }

        public static createObjectFromURL(url: string, userClass: any = null): GObject {
            var pi: PackageItem = UIPackage.getItemByURL(url);
            if (pi)
                return pi.owner.internalCreateObject(pi, userClass);
            else
                return null;
        }

        public static getItemURL(pkgName: string, resName: string): string {
            var pkg: UIPackage = UIPackage.getByName(pkgName);
            if (!pkg)
                return null;

            var pi: PackageItem = pkg._itemsByName[resName];
            if (!pi)
                return null;

            return "ui://" + pkg.id + pi.id;
        }

        public static getItemByURL(url: string): PackageItem {
            var pos1: number = url.indexOf("//");
            if (pos1 == -1)
                return null;

            var pos2: number = url.indexOf("/", pos1 + 2);
            if (pos2 == -1) {
                if (url.length > 13) {
                    var pkgId: string = url.substr(5, 8);
                    var pkg: UIPackage = UIPackage.getById(pkgId);
                    if (pkg != null) {
                        var srcId: string = url.substr(13);
                        return pkg.getItemById(srcId);
                    }
                }
            }
            else {
                var pkgName: string = url.substr(pos1 + 2, pos2 - pos1 - 2);
                pkg = UIPackage.getByName(pkgName);
                if (pkg != null) {
                    var srcName: string = url.substr(pos2 + 1);
                    return pkg.getItemByName(srcName);
                }
            }

            return null;
        }

        public static normalizeURL(url: string): string {
            if (url == null)
                return null;

            var pos1: number = url.indexOf("//");
            if (pos1 == -1)
                return null;

            var pos2: number = url.indexOf("/", pos1 + 2);
            if (pos2 == -1)
                return url;

            var pkgName: string = url.substr(pos1 + 2, pos2 - pos1 - 2);
            var srcName: string = url.substr(pos2 + 1);
            return UIPackage.getItemURL(pkgName, srcName);
        }

        public static setStringsSource(source: string): void {
            TranslationHelper.loadFromXML(source);
        }

        private loadPackage(buffer: ByteBuffer, url: string): void {
            if (buffer.readUint() != 0x46475549)
                throw "FairyGUI: old package format found in '" + url + "'";

            this._url = url;
            buffer.version = buffer.readInt();
            var ver2: boolean = buffer.version >= 2;
            var compressed: boolean = buffer.readBool();
            this._id = buffer.readString();
            this._name = buffer.readString();
            buffer.skip(20);

            var indexTablePos: number = buffer.position;
            var cnt: number;
            var i: number;
            var nextPos: number;
            var str: string;
            var branchIncluded: boolean;

            buffer.seek(indexTablePos, 4);

            cnt = buffer.readInt();
            var stringTable: Array<string> = new Array<string>(cnt);
            buffer.stringTable = stringTable;

            for (i = 0; i < cnt; i++)
                stringTable[i] = buffer.readString();

            if (buffer.seek(indexTablePos, 5)) {
                cnt = buffer.readInt();
                for (i = 0; i < cnt; i++) {
                    let index = buffer.readUshort();
                    let len = buffer.readInt();
                    stringTable[index] = buffer.readString(len);
                }
            }

            buffer.seek(indexTablePos, 0);
            cnt = buffer.readShort();
            for (i = 0; i < cnt; i++)
                this._dependencies.push({ id: buffer.readS(), name: buffer.readS() });

            if (ver2) {
                cnt = buffer.readShort();
                if (cnt > 0) {
                    this._branches = buffer.readSArray(cnt);
                    if (UIPackage._branch)
                        this._branchIndex = this._branches.indexOf(UIPackage._branch);
                }

                branchIncluded = cnt > 0;
            }

            buffer.seek(indexTablePos, 1);

            var pi: PackageItem;
            url = url + "_";

            cnt = buffer.readShort();
            for (i = 0; i < cnt; i++) {
                nextPos = buffer.readInt();
                nextPos += buffer.position;

                pi = new PackageItem();
                pi.owner = this;
                pi.type = buffer.readByte();
                pi.id = buffer.readS();
                pi.name = buffer.readS();
                buffer.readS(); //path
                pi.file = buffer.readS();
                buffer.readBool();//exported
                pi.width = buffer.readInt();
                pi.height = buffer.readInt();

                switch (pi.type) {
                    case PackageItemType.Image:
                        {
                            pi.objectType = ObjectType.Image;
                            var scaleOption: number = buffer.readByte();
                            if (scaleOption == 1) {
                                pi.scale9Grid = new cc.Rect();
                                pi.scale9Grid.x = buffer.readInt();
                                pi.scale9Grid.y = buffer.readInt();
                                pi.scale9Grid.width = buffer.readInt();
                                pi.scale9Grid.height = buffer.readInt();

                                pi.tileGridIndice = buffer.readInt();
                            }
                            else if (scaleOption == 2)
                                pi.scaleByTile = true;

                            pi.smoothing = buffer.readBool();
                            break;
                        }

                    case PackageItemType.MovieClip:
                        {
                            pi.smoothing = buffer.readBool();
                            pi.objectType = ObjectType.MovieClip;
                            pi.rawData = buffer.readBuffer();
                            break;
                        }

                    case PackageItemType.Font:
                        {
                            pi.rawData = buffer.readBuffer();
                            break;
                        }

                    case PackageItemType.Component:
                        {
                            var extension: number = buffer.readByte();
                            if (extension > 0)
                                pi.objectType = extension;
                            else
                                pi.objectType = ObjectType.Component;
                            pi.rawData = buffer.readBuffer();

                            UIObjectFactory.resolveExtension(pi);
                            break;
                        }

                    case PackageItemType.Atlas:
                    case PackageItemType.Sound:
                    case PackageItemType.Misc:
                        {
                            pi.file = url + cc.path.mainFileName(pi.file);
                            break;
                        }
                }

                if (ver2) {
                    str = buffer.readS();//branch
                    if (str)
                        pi.name = str + "/" + pi.name;

                    var branchCnt: number = buffer.readUbyte();
                    if (branchCnt > 0) {
                        if (branchIncluded)
                            pi.branches = buffer.readSArray(branchCnt);
                        else
                            this._itemsById[buffer.readS()] = pi;
                    }

                    var highResCnt: number = buffer.readUbyte();
                    if (highResCnt > 0)
                        pi.highResolution = buffer.readSArray(highResCnt);
                }

                this._items.push(pi);
                this._itemsById[pi.id] = pi;
                if (pi.name != null)
                    this._itemsByName[pi.name] = pi;

                buffer.position = nextPos;
            }

            buffer.seek(indexTablePos, 2);

            cnt = buffer.readShort();
            for (i = 0; i < cnt; i++) {
                nextPos = buffer.readShort();
                nextPos += buffer.position;

                var itemId: string = buffer.readS();
                pi = this._itemsById[buffer.readS()];

                var sprite: AtlasSprite = new AtlasSprite();
                sprite.atlas = pi;
                sprite.rect.x = buffer.readInt();
                sprite.rect.y = buffer.readInt();
                sprite.rect.width = buffer.readInt();
                sprite.rect.height = buffer.readInt();
                sprite.rotated = buffer.readBool();
                if (ver2 && buffer.readBool()) {
                    sprite.offset.x = buffer.readInt();
                    sprite.offset.y = buffer.readInt();
                    sprite.originalSize.width = buffer.readInt();
                    sprite.originalSize.height = buffer.readInt();
                }
                else {
                    sprite.originalSize.width = sprite.rect.width;
                    sprite.originalSize.height = sprite.rect.height;
                }
                this._sprites[itemId] = sprite;

                buffer.position = nextPos;
            }

            if (buffer.seek(indexTablePos, 3)) {
                cnt = buffer.readShort();
                for (i = 0; i < cnt; i++) {
                    nextPos = buffer.readInt();
                    nextPos += buffer.position;

                    pi = this._itemsById[buffer.readS()];
                    if (pi && pi.type == PackageItemType.Image)
                        pi.hitTestData = new PixelHitTestData(buffer);

                    buffer.position = nextPos;
                }
            }
        }

        public dispose(): void {
            var cnt: number = this._items.length;
            for (var i: number = 0; i < cnt; i++) {
                var pi: PackageItem = this._items[i];
                if (pi.asset)
                    cc.loader.releaseAsset(pi.asset);
            }
        }

        public get id(): string {
            return this._id;
        }

        public get name(): string {
            return this._name;
        }

        public get url(): string {
            return this._url;
        }

        public createObject(resName: string, userClass: any = null): GObject {
            var pi: PackageItem = this._itemsByName[resName];
            if (pi)
                return this.internalCreateObject(pi, userClass);
            else
                return null;
        }

        public internalCreateObject(item: PackageItem, userClass: any = null): GObject {
            var g: GObject;
            if (item.type == PackageItemType.Component) {
                if (userClass != null)
                    g = new userClass();
                else
                    g = UIObjectFactory.newObject(item);
            }
            else
                g = UIObjectFactory.newObject(item);

            if (g == null)
                return null;

            UIPackage._constructing++;
            g.packageItem = item;
            g.constructFromResource();
            UIPackage._constructing--;
            return g;
        }

        public getItemById(itemId: string): PackageItem {
            return this._itemsById[itemId];
        }

        public getItemByName(resName: string): PackageItem {
            return this._itemsByName[resName];
        }

        public getItemAssetByName(resName: string): any {
            var pi: PackageItem = this._itemsByName[resName];
            if (pi == null) {
                throw "Resource not found -" + resName;
            }

            return this.getItemAsset(pi);
        }

        public getItemAsset(item: PackageItem): cc.Asset {
            switch (item.type) {
                case PackageItemType.Image:
                    if (!item.decoded) {
                        item.decoded = true;
                        var sprite: AtlasSprite = this._sprites[item.id];
                        if (sprite != null) {
                            let atlasTexture: cc.Texture2D = <cc.Texture2D>this.getItemAsset(sprite.atlas);
                            if (atlasTexture != null) {
                                let sf = new cc.SpriteFrame(atlasTexture, sprite.rect, sprite.rotated,
                                    new cc.Vec2(sprite.offset.x - (sprite.originalSize.width - sprite.rect.width) / 2, -(sprite.offset.y - (sprite.originalSize.height - sprite.rect.height) / 2)),
                                    sprite.originalSize);
                                if (item.scale9Grid) {
                                    sf.insetLeft = item.scale9Grid.x;
                                    sf.insetTop = item.scale9Grid.y;
                                    sf.insetRight = item.width - item.scale9Grid.xMax;
                                    sf.insetBottom = item.height - item.scale9Grid.yMax;
                                }
                                item.asset = sf;
                            }
                        }
                    }
                    return item.asset;

                case PackageItemType.Atlas:
                    if (!item.decoded) {
                        item.decoded = true;
                        item.asset = cc.loader.getRes(item.file);
                        if (!item.asset)
                            console.log("Resource '" + item.file + "' not found, please check default.res.json!");
                    }
                    return item.asset;

                case PackageItemType.Sound:
                    if (!item.decoded) {
                        item.decoded = true;
                        item.asset = cc.loader.getRes(item.file);
                        if (!item.asset)
                            console.log("Resource '" + item.file + "' not found, please check default.res.json!");
                    }
                    return item.asset;

                case PackageItemType.Font:
                    if (!item.decoded) {
                        item.decoded = true;
                        this.loadFont(item);
                    }
                    return item.asset;

                case PackageItemType.MovieClip:
                    if (!item.decoded) {
                        item.decoded = true;
                        this.loadMovieClip(item);
                    }
                    return null;

                case PackageItemType.Misc:
                    if (item.file)
                        return cc.loader.getRes(item.file);
                    else
                        return null;

                default:
                    return null;
            }
        }

        public loadAllAssets(): void {
            var cnt: number = this._items.length;
            for (var i: number = 0; i < cnt; i++) {
                var pi: PackageItem = this._items[i];
                this.getItemAsset(pi);
            }
        }

        private loadMovieClip(item: PackageItem): void {
            var buffer: ByteBuffer = item.rawData;

            buffer.seek(0, 0);

            item.interval = buffer.readInt() / 1000;
            item.swing = buffer.readBool();
            item.repeatDelay = buffer.readInt() / 1000;

            buffer.seek(0, 1);

            var frameCount: number = buffer.readShort();
            item.frames = Array<Frame>(frameCount);

            var spriteId: string;
            var frame: Frame;
            var sprite: AtlasSprite;

            for (var i: number = 0; i < frameCount; i++) {
                var nextPos: number = buffer.readShort();
                nextPos += buffer.position;

                frame = new Frame();
                frame.rect.x = buffer.readInt();
                frame.rect.y = buffer.readInt();
                frame.rect.width = buffer.readInt();
                frame.rect.height = buffer.readInt();
                frame.addDelay = buffer.readInt() / 1000;
                spriteId = buffer.readS();

                if (spriteId != null && (sprite = this._sprites[spriteId]) != null) {
                    let atlasTexture: cc.Texture2D = <cc.Texture2D>this.getItemAsset(sprite.atlas);
                    if (atlasTexture != null) {
                        let sx: number = item.width / frame.rect.width;
                        frame.texture = new cc.SpriteFrame(atlasTexture, sprite.rect, sprite.rotated,
                            new cc.Vec2(frame.rect.x - (item.width - frame.rect.width) / 2, -(frame.rect.y - (item.height - frame.rect.height) / 2)),
                            new cc.Size(item.width, item.height));
                    }
                }
                item.frames[i] = frame;

                buffer.position = nextPos;
            }
        }

        private loadFont(item: PackageItem): void {
            var font: any = new cc.LabelAtlas();
            item.asset = font;

            font._fntConfig = {
                commonHeight: 0,
                fontSize: 0,
                kerningDict: {},
                fontDefDictionary: {}
            };
            let dict = font._fntConfig.fontDefDictionary;

            var buffer: ByteBuffer = item.rawData;

            buffer.seek(0, 0);

            let ttf = buffer.readBool();
            let canTint = buffer.readBool();
            let resizable = buffer.readBool();
            buffer.readBool(); //has channel
            let fontSize = buffer.readInt();
            var xadvance: number = buffer.readInt();
            var lineHeight: number = buffer.readInt();

            let mainTexture: cc.Texture2D;
            var mainSprite: AtlasSprite = this._sprites[item.id];
            if (mainSprite != null)
                mainTexture = <cc.Texture2D>(this.getItemAsset(mainSprite.atlas));

            buffer.seek(0, 1);

            var bg: any = null;
            var cnt: number = buffer.readInt();
            for (var i: number = 0; i < cnt; i++) {
                var nextPos: number = buffer.readShort();
                nextPos += buffer.position;

                bg = {};
                var ch: number = buffer.readUshort();
                dict[ch] = bg;

                let rect: cc.Rect = new cc.Rect();
                bg.rect = rect;

                var img: string = buffer.readS();
                rect.x = buffer.readInt();
                rect.y = buffer.readInt();
                bg.xOffset = buffer.readInt();
                bg.yOffset = buffer.readInt();
                rect.width = buffer.readInt();
                rect.height = buffer.readInt();
                bg.xAdvance = buffer.readInt();
                bg.channel = buffer.readByte();
                if (bg.channel == 1)
                    bg.channel = 3;
                else if (bg.channel == 2)
                    bg.channel = 2;
                else if (bg.channel == 3)
                    bg.channel = 1;

                if (ttf) {
                    rect.x += mainSprite.rect.x;
                    rect.y += mainSprite.rect.y;
                }
                else {
                    let sprite: AtlasSprite = this._sprites[img];
                    if (sprite) {
                        rect.set(sprite.rect);
                        bg.xOffset += sprite.offset.x;
                        bg.yOffset += sprite.offset.y;
                        if (fontSize == 0)
                            fontSize = sprite.originalSize.height;
                        if (!mainTexture) {
                            sprite.atlas.load();
                            mainTexture = <cc.Texture2D>sprite.atlas.asset;
                        }
                    }

                    if (bg.xAdvance == 0) {
                        if (xadvance == 0)
                            bg.xAdvance = bg.xOffset + bg.rect.width;
                        else
                            bg.xAdvance = xadvance;
                    }
                }

                buffer.position = nextPos;
            }


            font.fontSize = fontSize;
            font._fntConfig.fontSize = fontSize;
            font._fntConfig.commonHeight = lineHeight == 0 ? fontSize : lineHeight;
            font._fntConfig.resizable = resizable;
            font._fntConfig.canTint = canTint;

            let spriteFrame = new cc.SpriteFrame();
            spriteFrame.setTexture(mainTexture);
            font.spriteFrame = spriteFrame;
            font.onLoad();
        }
    }

    class AtlasSprite {
        public atlas: PackageItem;
        public rect: cc.Rect;
        public offset: cc.Vec2;
        public originalSize: cc.Size;
        public rotated: boolean;

        public constructor() {
            this.rect = new cc.Rect();
            this.offset = new cc.Vec2(0, 0);
            this.originalSize = new cc.Size(0, 0);
        }
    }
}
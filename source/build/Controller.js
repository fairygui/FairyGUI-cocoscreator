import { Event as FUIEvent } from "./event/Event";
import { UIPackage } from "./UIPackage";
var _nextPageId = 0;
export class Controller extends EventTarget {
    constructor() {
        super();
        this._pageIds = [];
        this._pageNames = [];
        this._selectedIndex = -1;
        this._previousIndex = -1;
    }
    dispose() {
    }
    get selectedIndex() {
        return this._selectedIndex;
    }
    set selectedIndex(value) {
        if (this._selectedIndex != value) {
            if (value > this._pageIds.length - 1)
                throw "index out of bounds: " + value;
            this.changing = true;
            this._previousIndex = this._selectedIndex;
            this._selectedIndex = value;
            this.parent.applyController(this);
            this.emit(FUIEvent.STATUS_CHANGED, this);
            this.changing = false;
        }
    }
    onChanged(callback, thisArg) {
        this.on(FUIEvent.STATUS_CHANGED, callback, thisArg);
    }
    offChanged(callback, thisArg) {
        this.off(FUIEvent.STATUS_CHANGED, callback, thisArg);
    }
    //功能和设置selectedIndex一样，但不会触发事件
    setSelectedIndex(value) {
        if (this._selectedIndex != value) {
            if (value > this._pageIds.length - 1)
                throw "index out of bounds: " + value;
            this.changing = true;
            this._previousIndex = this._selectedIndex;
            this._selectedIndex = value;
            this.parent.applyController(this);
            this.changing = false;
        }
    }
    get previsousIndex() {
        return this._previousIndex;
    }
    get selectedPage() {
        if (this._selectedIndex == -1)
            return null;
        else
            return this._pageNames[this._selectedIndex];
    }
    set selectedPage(val) {
        var i = this._pageNames.indexOf(val);
        if (i == -1)
            i = 0;
        this.selectedIndex = i;
    }
    //功能和设置selectedPage一样，但不会触发事件
    setSelectedPage(value) {
        var i = this._pageNames.indexOf(value);
        if (i == -1)
            i = 0;
        this.setSelectedIndex(i);
    }
    get previousPage() {
        if (this._previousIndex == -1)
            return null;
        else
            return this._pageNames[this._previousIndex];
    }
    get pageCount() {
        return this._pageIds.length;
    }
    getPageName(index) {
        return this._pageNames[index];
    }
    addPage(name) {
        name = name || "";
        this.addPageAt(name, this._pageIds.length);
    }
    addPageAt(name, index) {
        name = name || "";
        var nid = "" + (_nextPageId++);
        if (index == null || index == this._pageIds.length) {
            this._pageIds.push(nid);
            this._pageNames.push(name);
        }
        else {
            this._pageIds.splice(index, 0, nid);
            this._pageNames.splice(index, 0, name);
        }
    }
    removePage(name) {
        var i = this._pageNames.indexOf(name);
        if (i != -1) {
            this._pageIds.splice(i, 1);
            this._pageNames.splice(i, 1);
            if (this._selectedIndex >= this._pageIds.length)
                this.selectedIndex = this._selectedIndex - 1;
            else
                this.parent.applyController(this);
        }
    }
    removePageAt(index) {
        this._pageIds.splice(index, 1);
        this._pageNames.splice(index, 1);
        if (this._selectedIndex >= this._pageIds.length)
            this.selectedIndex = this._selectedIndex - 1;
        else
            this.parent.applyController(this);
    }
    clearPages() {
        this._pageIds.length = 0;
        this._pageNames.length = 0;
        if (this._selectedIndex != -1)
            this.selectedIndex = -1;
        else
            this.parent.applyController(this);
    }
    hasPage(aName) {
        return this._pageNames.indexOf(aName) != -1;
    }
    getPageIndexById(aId) {
        return this._pageIds.indexOf(aId);
    }
    getPageIdByName(aName) {
        var i = this._pageNames.indexOf(aName);
        if (i != -1)
            return this._pageIds[i];
        else
            return null;
    }
    getPageNameById(aId) {
        var i = this._pageIds.indexOf(aId);
        if (i != -1)
            return this._pageNames[i];
        else
            return null;
    }
    getPageId(index) {
        return this._pageIds[index];
    }
    get selectedPageId() {
        if (this._selectedIndex == -1)
            return null;
        else
            return this._pageIds[this._selectedIndex];
    }
    set selectedPageId(val) {
        var i = this._pageIds.indexOf(val);
        this.selectedIndex = i;
    }
    set oppositePageId(val) {
        var i = this._pageIds.indexOf(val);
        if (i > 0)
            this.selectedIndex = 0;
        else if (this._pageIds.length > 1)
            this.selectedIndex = 1;
    }
    get previousPageId() {
        if (this._previousIndex == -1)
            return null;
        else
            return this._pageIds[this._previousIndex];
    }
    runActions() {
        if (this._actions) {
            var cnt = this._actions.length;
            for (var i = 0; i < cnt; i++) {
                this._actions[i].run(this, this.previousPageId, this.selectedPageId);
            }
        }
    }
    setup(buffer) {
        var beginPos = buffer.position;
        buffer.seek(beginPos, 0);
        this.name = buffer.readS();
        if (buffer.readBool())
            this.autoRadioGroupDepth = true;
        buffer.seek(beginPos, 1);
        var i;
        var nextPos;
        var cnt = buffer.readShort();
        for (i = 0; i < cnt; i++) {
            this._pageIds.push(buffer.readS());
            this._pageNames.push(buffer.readS());
        }
        var homePageIndex = 0;
        if (buffer.version >= 2) {
            var homePageType = buffer.readByte();
            switch (homePageType) {
                case 1:
                    homePageIndex = buffer.readShort();
                    break;
                case 2:
                    homePageIndex = this._pageNames.indexOf(UIPackage.branch);
                    if (homePageIndex == -1)
                        homePageIndex = 0;
                    break;
                case 3:
                    homePageIndex = this._pageNames.indexOf(UIPackage.getVar(buffer.readS()));
                    if (homePageIndex == -1)
                        homePageIndex = 0;
                    break;
            }
        }
        buffer.seek(beginPos, 2);
        cnt = buffer.readShort();
        if (cnt > 0) {
            if (!this._actions)
                this._actions = new Array();
            for (i = 0; i < cnt; i++) {
                nextPos = buffer.readShort();
                nextPos += buffer.position;
                var action = createAction(buffer.readByte());
                action.setup(buffer);
                this._actions.push(action);
                buffer.position = nextPos;
            }
        }
        if (this.parent && this._pageIds.length > 0)
            this._selectedIndex = homePageIndex;
        else
            this._selectedIndex = -1;
    }
}
import { PlayTransitionAction } from "./action/PlayTransitionAction";
import { ChangePageAction } from "./action/ChangePageAction";
import { EventTarget } from "cc";
function createAction(type) {
    switch (type) {
        case 0:
            return new PlayTransitionAction();
        case 1:
            return new ChangePageAction();
    }
    return null;
}

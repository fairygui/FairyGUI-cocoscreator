export class ControllerAction {
    constructor() {
    }
    run(controller, prevPage, curPage) {
        if ((!this.fromPage || this.fromPage.length == 0 || this.fromPage.indexOf(prevPage) != -1)
            && (!this.toPage || this.toPage.length == 0 || this.toPage.indexOf(curPage) != -1))
            this.enter(controller);
        else
            this.leave(controller);
    }
    enter(controller) {
    }
    leave(controller) {
    }
    setup(buffer) {
        var cnt;
        var i;
        cnt = buffer.readShort();
        this.fromPage = [];
        for (i = 0; i < cnt; i++)
            this.fromPage[i] = buffer.readS();
        cnt = buffer.readShort();
        this.toPage = [];
        for (i = 0; i < cnt; i++)
            this.toPage[i] = buffer.readS();
    }
}

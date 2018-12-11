namespace fgui {
    export class TweenManager {
        private static _activeTweens: Array<GTweener> = new Array<GTweener>(30);
        private static _tweenerPool: Array<GTweener> = new Array<GTweener>();
        private static _totalActiveTweens: number = 0;

        private static _root: cc.Node;

        public static createTween(): GTweener {
            if (!TweenManager._root) {
                TweenManager._root = new cc.Node("[TweenManager]");
                cc.game["addPersistRootNode"](TweenManager._root);
                cc.director.getScheduler().schedule(TweenManager.update, TweenManager._root, 0, false);
            }

            var tweener: GTweener;
            var cnt: number = TweenManager._tweenerPool.length;
            if (cnt > 0) {
                tweener = TweenManager._tweenerPool.pop();
            }
            else
                tweener = new GTweener();
            tweener._init();
            TweenManager._activeTweens[TweenManager._totalActiveTweens++] = tweener;

            if (TweenManager._totalActiveTweens == TweenManager._activeTweens.length)
                TweenManager._activeTweens.length = TweenManager._activeTweens.length + Math.ceil(TweenManager._activeTweens.length * 0.5);

            return tweener;
        }

        public static isTweening(target: any, propType: any): boolean {
            if (target == null)
                return false;

            var anyType: boolean = propType == null || propType == undefined;
            for (var i: number = 0; i < TweenManager._totalActiveTweens; i++) {
                var tweener: GTweener = TweenManager._activeTweens[i];
                if (tweener != null && tweener.target == target && !tweener._killed
                    && (anyType || tweener._propType == propType))
                    return true;
            }

            return false;
        }

        public static killTweens(target: any, completed: boolean, propType: any): boolean {
            if (target == null)
                return false;

            var flag: boolean = false;
            var cnt: number = TweenManager._totalActiveTweens;
            var anyType: boolean = propType == null || propType == undefined;
            for (var i: number = 0; i < cnt; i++) {
                var tweener: GTweener = TweenManager._activeTweens[i];
                if (tweener != null && tweener.target == target && !tweener._killed
                    && (anyType || tweener._propType == propType)) {
                    tweener.kill(completed);
                    flag = true;
                }
            }

            return flag;
        }

        public static getTween(target: any, propType: any): GTweener {
            if (target == null)
                return null;

            var cnt: number = TweenManager._totalActiveTweens;
            var anyType: boolean = propType == null || propType == undefined;
            for (var i: number = 0; i < cnt; i++) {
                var tweener: GTweener = TweenManager._activeTweens[i];
                if (tweener != null && tweener.target == target && !tweener._killed
                    && (anyType || tweener._propType == propType)) {
                    return tweener;
                }
            }

            return null;
        }

        private static update(dt: number): boolean {
            let tweens: Array<GTweener> = TweenManager._activeTweens;
            var cnt: number = TweenManager._totalActiveTweens;
            var freePosStart: number = -1;
            for (var i: number = 0; i < cnt; i++) {
                var tweener: GTweener = tweens[i];
                if (tweener == null) {
                    if (freePosStart == -1)
                        freePosStart = i;
                }
                else if (tweener._killed) {
                    tweener._reset();
                    TweenManager._tweenerPool.push(tweener);
                    tweens[i] = null;

                    if (freePosStart == -1)
                        freePosStart = i;
                }
                else {
                    if (!tweener._paused)
                        tweener._update(dt);

                    if (freePosStart != -1) {
                        tweens[freePosStart] = tweener;
                        tweens[i] = null;
                        freePosStart++;
                    }
                }
            }

            if (freePosStart >= 0) {
                if (TweenManager._totalActiveTweens != cnt) //new tweens added
                {
                    var j: number = cnt;
                    cnt = TweenManager._totalActiveTweens - cnt;
                    for (i = 0; i < cnt; i++)
                        tweens[freePosStart++] = tweens[j++];
                }
                TweenManager._totalActiveTweens = freePosStart;
            }

            return false;
        }
    }
}
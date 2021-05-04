import { director, game, macro, Node } from "cc";
import { GObject } from "../GObject";
import { Pool } from "../utils/Pool";
import { GTweener } from "./GTweener";

export class TweenManager {
    public static createTween(): GTweener {
        if (!_root) {
            _root = new Node("[TweenManager]");
            game.addPersistRootNode(_root);
            director.getScheduler().schedule(TweenManager.update, _root, 0, macro.REPEAT_FOREVER, 0, false);
        }

        var tweener: GTweener = _tweenerPool.borrow();
        _activeTweens[_totalActiveTweens++] = tweener;

        return tweener;
    }

    public static isTweening(target: any, propType?: any): boolean {
        if (target == null)
            return false;

        var anyType: boolean = !propType;
        for (var i: number = 0; i < _totalActiveTweens; i++) {
            var tweener: GTweener = _activeTweens[i];
            if (tweener && tweener.target == target && !tweener._killed
                && (anyType || tweener._propType == propType))
                return true;
        }

        return false;
    }

    public static killTweens(target: any, completed?: boolean, propType?: any): boolean {
        if (target == null)
            return false;

        var flag: boolean = false;
        var cnt: number = _totalActiveTweens;
        var anyType: boolean = !propType;
        for (var i: number = 0; i < cnt; i++) {
            var tweener: GTweener = _activeTweens[i];
            if (tweener && tweener.target == target && !tweener._killed
                && (anyType || tweener._propType == propType)) {
                tweener.kill(completed);
                flag = true;
            }
        }

        return flag;
    }

    public static getTween(target: any, propType?: any): GTweener {
        if (target == null)
            return null;

        var cnt: number = _totalActiveTweens;
        var anyType: boolean = !propType;
        for (var i: number = 0; i < cnt; i++) {
            var tweener: GTweener = _activeTweens[i];
            if (tweener && tweener.target == target && !tweener._killed
                && (anyType || tweener._propType == propType)) {
                return tweener;
            }
        }

        return null;
    }

    private static update(dt: number): boolean {
        let tweens: Array<GTweener> = _activeTweens;
        var cnt: number = _totalActiveTweens;
        var freePosStart: number = -1;
        for (var i: number = 0; i < cnt; i++) {
            var tweener: GTweener = tweens[i];
            if (tweener == null) {
                if (freePosStart == -1)
                    freePosStart = i;
            }
            else if (tweener._killed) {
                tweener._reset();
                _tweenerPool.returns(tweener);
                tweens[i] = null;

                if (freePosStart == -1)
                    freePosStart = i;
            }
            else {
                if (tweener._target && ('isDisposed' in tweener._target) && tweener._target.isDisposed)
                    tweener._killed = true;
                else if (!tweener._paused)
                    tweener._update(dt);

                if (freePosStart != -1) {
                    tweens[freePosStart] = tweener;
                    tweens[i] = null;
                    freePosStart++;
                }
            }
        }

        if (freePosStart >= 0) {
            if (_totalActiveTweens != cnt) //new tweens added
            {
                var j: number = cnt;
                cnt = _totalActiveTweens - cnt;
                for (i = 0; i < cnt; i++)
                    tweens[freePosStart++] = tweens[j++];
            }
            _totalActiveTweens = freePosStart;
        }

        return false;
    }
}

var _activeTweens: GTweener[] = new Array();
var _tweenerPool: Pool<GTweener> = new Pool<GTweener>(GTweener, e => e._init(), e => e._reset());
var _totalActiveTweens: number = 0;
var _inited: boolean = false;
var _root: Node;
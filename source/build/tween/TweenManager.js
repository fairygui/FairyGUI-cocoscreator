import { director, game, macro, Node } from "cc";
import { Pool } from "../utils/Pool";
import { GTweener } from "./GTweener";
export class TweenManager {
    static createTween() {
        if (!_root) {
            _root = new Node("[TweenManager]");
            game.addPersistRootNode(_root);
            director.getScheduler().schedule(TweenManager.update, _root, 0, macro.REPEAT_FOREVER, 0, false);
        }
        var tweener = _tweenerPool.borrow();
        _activeTweens[_totalActiveTweens++] = tweener;
        return tweener;
    }
    static isTweening(target, propType) {
        if (target == null)
            return false;
        var anyType = !propType;
        for (var i = 0; i < _totalActiveTweens; i++) {
            var tweener = _activeTweens[i];
            if (tweener && tweener.target == target && !tweener._killed
                && (anyType || tweener._propType == propType))
                return true;
        }
        return false;
    }
    static killTweens(target, completed, propType) {
        if (target == null)
            return false;
        var flag = false;
        var cnt = _totalActiveTweens;
        var anyType = !propType;
        for (var i = 0; i < cnt; i++) {
            var tweener = _activeTweens[i];
            if (tweener && tweener.target == target && !tweener._killed
                && (anyType || tweener._propType == propType)) {
                tweener.kill(completed);
                flag = true;
            }
        }
        return flag;
    }
    static getTween(target, propType) {
        if (target == null)
            return null;
        var cnt = _totalActiveTweens;
        var anyType = !propType;
        for (var i = 0; i < cnt; i++) {
            var tweener = _activeTweens[i];
            if (tweener && tweener.target == target && !tweener._killed
                && (anyType || tweener._propType == propType)) {
                return tweener;
            }
        }
        return null;
    }
    static update(dt) {
        let tweens = _activeTweens;
        var cnt = _totalActiveTweens;
        var freePosStart = -1;
        for (var i = 0; i < cnt; i++) {
            var tweener = tweens[i];
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
                var j = cnt;
                cnt = _totalActiveTweens - cnt;
                for (i = 0; i < cnt; i++)
                    tweens[freePosStart++] = tweens[j++];
            }
            _totalActiveTweens = freePosStart;
        }
        return false;
    }
}
var _activeTweens = new Array();
var _tweenerPool = new Pool(GTweener, e => e._init(), e => e._reset());
var _totalActiveTweens = 0;
var _inited = false;
var _root;

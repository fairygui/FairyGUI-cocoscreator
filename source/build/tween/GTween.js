import { TweenManager } from "./TweenManager";
export class GTween {
    static to(start, end, duration) {
        return TweenManager.createTween()._to(start, end, duration);
    }
    static to2(start, start2, end, end2, duration) {
        return TweenManager.createTween()._to2(start, start2, end, end2, duration);
    }
    static to3(start, start2, start3, end, end2, end3, duration) {
        return TweenManager.createTween()._to3(start, start2, start3, end, end2, end3, duration);
    }
    static to4(start, start2, start3, start4, end, end2, end3, end4, duration) {
        return TweenManager.createTween()._to4(start, start2, start3, start4, end, end2, end3, end4, duration);
    }
    static toColor(start, end, duration) {
        return TweenManager.createTween()._toColor(start, end, duration);
    }
    static delayedCall(delay) {
        return TweenManager.createTween().setDelay(delay);
    }
    static shake(startX, startY, amplitude, duration) {
        return TweenManager.createTween()._shake(startX, startY, amplitude, duration);
    }
    static isTweening(target, propType) {
        return TweenManager.isTweening(target, propType);
    }
    static kill(target, complete, propType) {
        TweenManager.killTweens(target, complete, propType);
    }
    static getTween(target, propType) {
        return TweenManager.getTween(target, propType);
    }
}
GTween.catchCallbackExceptions = true;

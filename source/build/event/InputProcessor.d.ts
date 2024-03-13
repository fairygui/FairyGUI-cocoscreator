/// <reference path="../../lib/cc.d.ts" />
import { Component, Vec2 } from "cc";
import { GObject } from "../GObject";
import { Event as FUIEvent } from "./Event";
export declare class InputProcessor extends Component {
    private _owner;
    private _touchListener;
    private _touchPos;
    private _touches;
    private _rollOutChain;
    private _rollOverChain;
    _captureCallback: (evt: FUIEvent) => void;
    constructor();
    onLoad(): void;
    onEnable(): void;
    onDisable(): void;
    getAllTouches(touchIds?: Array<number>): Array<number>;
    getTouchPosition(touchId?: number): Vec2;
    getTouchTarget(): GObject;
    addTouchMonitor(touchId: number, target: GObject): void;
    removeTouchMonitor(target: GObject): void;
    cancelClick(touchId: number): void;
    simulateClick(target: GObject): void;
    private touchBeginHandler;
    private touchMoveHandler;
    private touchEndHandler;
    private touchCancelHandler;
    private mouseDownHandler;
    private mouseUpHandler;
    private mouseMoveHandler;
    private mouseWheelHandler;
    private updateInfo;
    private getInfo;
    private setBegin;
    private setEnd;
    private clickTest;
    private handleRollOver;
    private getEvent;
}

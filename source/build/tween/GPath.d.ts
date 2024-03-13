/// <reference path="../../lib/cc.d.ts" />
import { Vec2 } from "cc";
import { GPathPoint } from "./GPathPoint";
export declare class GPath {
    private _segments;
    private _points;
    private _fullLength;
    constructor();
    get length(): number;
    create2(pt1: GPathPoint, pt2: GPathPoint, pt3?: GPathPoint, pt4?: GPathPoint): void;
    create(points: Array<GPathPoint>): void;
    private createSplineSegment;
    clear(): void;
    getPointAt(t: number, result?: Vec2): Vec2;
    get segmentCount(): number;
    getAnchorsInSegment(segmentIndex: number, points?: Array<Vec2>): Array<Vec2>;
    getPointsInSegment(segmentIndex: number, t0: number, t1: number, points?: Array<Vec2>, ts?: Array<number>, pointDensity?: number): Array<Vec2>;
    getAllPoints(points?: Array<Vec2>, ts?: Array<number>, pointDensity?: number): Array<Vec2>;
    private onCRSplineCurve;
    private onBezierCurve;
}

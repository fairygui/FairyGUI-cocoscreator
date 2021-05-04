import { math, Vec2 } from "cc";
import { CurveType, GPathPoint } from "./GPathPoint";

export class GPath {
    private _segments: Array<Segment>;
    private _points: Array<Vec2>;
    private _fullLength: number;

    constructor() {
        this._segments = new Array<Segment>();
        this._points = new Array<Vec2>();
    }

    public get length(): number {
        return this._fullLength;
    }

    public create2(pt1: GPathPoint, pt2: GPathPoint, pt3?: GPathPoint, pt4?: GPathPoint): void {
        var points: Array<GPathPoint> = new Array<GPathPoint>();
        points.push(pt1);
        points.push(pt2);
        if (pt3)
            points.push(pt3);
        if (pt4)
            points.push(pt4);
        this.create(points);
    }

    public create(points: Array<GPathPoint>): void {
        this._segments.length = 0;
        this._points.length = 0;
        this._fullLength = 0;

        var cnt: number = points.length;
        if (cnt == 0)
            return;

        var splinePoints: Array<Vec2> = [];

        var prev: GPathPoint = points[0];
        if (prev.curveType == CurveType.CRSpline)
            splinePoints.push(new Vec2(prev.x, prev.y));

        for (var i: number = 1; i < cnt; i++) {
            var current: GPathPoint = points[i];

            if (prev.curveType != CurveType.CRSpline) {
                var seg: Segment = {};
                seg.type = prev.curveType;
                seg.ptStart = this._points.length;
                if (prev.curveType == CurveType.Straight) {
                    seg.ptCount = 2;
                    this._points.push(new Vec2(prev.x, prev.y));
                    this._points.push(new Vec2(current.x, current.y));
                }
                else if (prev.curveType == CurveType.Bezier) {
                    seg.ptCount = 3;
                    this._points.push(new Vec2(prev.x, prev.y));
                    this._points.push(new Vec2(current.x, current.y));
                    this._points.push(new Vec2(prev.control1_x, prev.control1_y));
                }
                else if (prev.curveType == CurveType.CubicBezier) {
                    seg.ptCount = 4;
                    this._points.push(new Vec2(prev.x, prev.y));
                    this._points.push(new Vec2(current.x, current.y));
                    this._points.push(new Vec2(prev.control1_x, prev.control1_y));
                    this._points.push(new Vec2(prev.control2_x, prev.control2_y));
                }
                seg.length = distance(prev.x, prev.y, current.x, current.y);
                this._fullLength += seg.length;
                this._segments.push(seg);
            }

            if (current.curveType != CurveType.CRSpline) {
                if (splinePoints.length > 0) {
                    splinePoints.push(new Vec2(current.x, current.y));
                    this.createSplineSegment(splinePoints);
                }
            }
            else
                splinePoints.push(new Vec2(current.x, current.y));

            prev = current;
        }

        if (splinePoints.length > 1)
            this.createSplineSegment(splinePoints);
    }

    private createSplineSegment(splinePoints: Array<Vec2>): void {
        var cnt: number = splinePoints.length;
        splinePoints.splice(0, 0, splinePoints[0]);
        splinePoints.push(splinePoints[cnt]);
        splinePoints.push(splinePoints[cnt]);
        cnt += 3;

        var seg: Segment = {};
        seg.type = CurveType.CRSpline;
        seg.ptStart = this._points.length;
        seg.ptCount = cnt;

        this._points = this._points.concat(splinePoints);

        seg.length = 0;
        for (var i: number = 1; i < cnt; i++) {
            seg.length += distance(splinePoints[i - 1].x, splinePoints[i - 1].y,
                splinePoints[i].x, splinePoints[i].y);
        }
        this._fullLength += seg.length;
        this._segments.push(seg);
        splinePoints.length = 0;
    }

    public clear(): void {
        this._segments.length = 0;
        this._points.length = 0;
    }

    public getPointAt(t: number, result?: Vec2): Vec2 {
        if (!result)
            result = new Vec2();
        else
            result.set(0, 0);

        t = math.clamp01(t);
        var cnt: number = this._segments.length;
        if (cnt == 0) {
            return result;
        }

        var seg: Segment;
        if (t == 1) {
            seg = this._segments[cnt - 1];

            if (seg.type == CurveType.Straight) {
                result.x = math.lerp(this._points[seg.ptStart].x, this._points[seg.ptStart + 1].x, t);
                result.y = math.lerp(this._points[seg.ptStart].y, this._points[seg.ptStart + 1].y, t);

                return result;
            }
            else if (seg.type == CurveType.Bezier || seg.type == CurveType.CubicBezier)
                return this.onBezierCurve(seg.ptStart, seg.ptCount, t, result);
            else
                return this.onCRSplineCurve(seg.ptStart, seg.ptCount, t, result);
        }

        var len: number = t * this._fullLength;
        for (var i: number = 0; i < cnt; i++) {
            seg = this._segments[i];

            len -= seg.length;
            if (len < 0) {
                t = 1 + len / seg.length;

                if (seg.type == CurveType.Straight) {
                    result.x = math.lerp(this._points[seg.ptStart].x, this._points[seg.ptStart + 1].x, t);
                    result.y = math.lerp(this._points[seg.ptStart].y, this._points[seg.ptStart + 1].y, t);
                }
                else if (seg.type == CurveType.Bezier || seg.type == CurveType.CubicBezier)
                    result = this.onBezierCurve(seg.ptStart, seg.ptCount, t, result);
                else
                    result = this.onCRSplineCurve(seg.ptStart, seg.ptCount, t, result);

                break;
            }
        }

        return result;
    }

    public get segmentCount(): number {
        return this._segments.length;
    }

    public getAnchorsInSegment(segmentIndex: number, points?: Array<Vec2>): Array<Vec2> {
        if (points == null)
            points = new Array<Vec2>();

        var seg: Segment = this._segments[segmentIndex];
        for (var i: number = 0; i < seg.ptCount; i++)
            points.push(new Vec2(this._points[seg.ptStart + i].x, this._points[seg.ptStart + i].y));

        return points;
    }

    public getPointsInSegment(segmentIndex: number, t0: number, t1: number, points?: Array<Vec2>, ts?: Array<number>, pointDensity?: number): Array<Vec2> {
        if (points == null)
            points = new Array<Vec2>();
        if (!pointDensity || isNaN(pointDensity))
            pointDensity = 0.1;

        if (ts)
            ts.push(t0);
        var seg: Segment = this._segments[segmentIndex];
        if (seg.type == CurveType.Straight) {
            points.push(new Vec2(math.lerp(this._points[seg.ptStart].x, this._points[seg.ptStart + 1].x, t0),
            math.lerp(this._points[seg.ptStart].y, this._points[seg.ptStart + 1].y, t0)));
            points.push(new Vec2(math.lerp(this._points[seg.ptStart].x, this._points[seg.ptStart + 1].x, t1),
            math.lerp(this._points[seg.ptStart].y, this._points[seg.ptStart + 1].y, t1)));
        }
        else {
            var func: Function;
            if (seg.type == CurveType.Bezier || seg.type == CurveType.CubicBezier)
                func = this.onBezierCurve;
            else
                func = this.onCRSplineCurve;

            points.push(func.call(this, seg.ptStart, seg.ptCount, t0, new Vec2()));
            var SmoothAmount: number = Math.min(seg.length * pointDensity, 50);
            for (var j: number = 0; j <= SmoothAmount; j++) {
                var t: number = j / SmoothAmount;
                if (t > t0 && t < t1) {
                    points.push(func.call(this, seg.ptStart, seg.ptCount, t, new Vec2()));
                    if (ts)
                        ts.push(t);
                }
            }
            points.push(func.call(this, seg.ptStart, seg.ptCount, t1, new Vec2()));
        }

        if (ts)
            ts.push(t1);

        return points;
    }

    public getAllPoints(points?: Array<Vec2>, ts?: Array<number>, pointDensity?: number): Array<Vec2> {
        if (points == null)
            points = new Array<Vec2>();
        if (!pointDensity || isNaN(pointDensity))
            pointDensity = 0.1;

        var cnt: number = this._segments.length;
        for (var i: number = 0; i < cnt; i++)
            this.getPointsInSegment(i, 0, 1, points, ts, pointDensity);

        return points;
    }

    private onCRSplineCurve(ptStart: number, ptCount: number, t: number, result: Vec2): Vec2 {
        var adjustedIndex: number = Math.floor(t * (ptCount - 4)) + ptStart; //Since the equation works with 4 points, we adjust the starting point depending on t to return a point on the specific segment

        var p0x: number = this._points[adjustedIndex].x;
        var p0y: number = this._points[adjustedIndex].y;
        var p1x: number = this._points[adjustedIndex + 1].x;
        var p1y: number = this._points[adjustedIndex + 1].y;
        var p2x: number = this._points[adjustedIndex + 2].x;
        var p2y: number = this._points[adjustedIndex + 2].y;
        var p3x: number = this._points[adjustedIndex + 3].x;
        var p3y: number = this._points[adjustedIndex + 3].y;

        var adjustedT: number = (t == 1) ? 1 : math.repeat(t * (ptCount - 4), 1); // Then we adjust t to be that value on that new piece of segment... for t == 1f don't use repeat (that would return 0f);

        var t0: number = ((-adjustedT + 2) * adjustedT - 1) * adjustedT * 0.5;
        var t1: number = (((3 * adjustedT - 5) * adjustedT) * adjustedT + 2) * 0.5;
        var t2: number = ((-3 * adjustedT + 4) * adjustedT + 1) * adjustedT * 0.5;
        var t3: number = ((adjustedT - 1) * adjustedT * adjustedT) * 0.5;

        result.x = p0x * t0 + p1x * t1 + p2x * t2 + p3x * t3;
        result.y = p0y * t0 + p1y * t1 + p2y * t2 + p3y * t3;

        return result;
    }

    private onBezierCurve(ptStart: number, ptCount: number, t: number, result: Vec2): Vec2 {
        var t2: number = 1 - t;
        var p0x: number = this._points[ptStart].x;
        var p0y: number = this._points[ptStart].y;
        var p1x: number = this._points[ptStart + 1].x;
        var p1y: number = this._points[ptStart + 1].y;
        var cp0x: number = this._points[ptStart + 2].x;
        var cp0y: number = this._points[ptStart + 2].y;

        if (ptCount == 4) {
            var cp1x: number = this._points[ptStart + 3].x;
            var cp1y: number = this._points[ptStart + 3].y;
            result.x = t2 * t2 * t2 * p0x + 3 * t2 * t2 * t * cp0x + 3 * t2 * t * t * cp1x + t * t * t * p1x;
            result.y = t2 * t2 * t2 * p0y + 3 * t2 * t2 * t * cp0y + 3 * t2 * t * t * cp1y + t * t * t * p1y;
        }
        else {
            result.x = t2 * t2 * p0x + 2 * t2 * t * cp0x + t * t * p1x;
            result.y = t2 * t2 * p0y + 2 * t2 * t * cp0y + t * t * p1y;
        }

        return result;
    }
}

interface Segment {
    type?: number;
    length?: number;
    ptStart?: number;
    ptCount?: number;
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
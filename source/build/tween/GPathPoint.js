export var CurveType;
(function (CurveType) {
    CurveType[CurveType["CRSpline"] = 0] = "CRSpline";
    CurveType[CurveType["Bezier"] = 1] = "Bezier";
    CurveType[CurveType["CubicBezier"] = 2] = "CubicBezier";
    CurveType[CurveType["Straight"] = 3] = "Straight";
})(CurveType || (CurveType = {}));
export class GPathPoint {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.control1_x = 0;
        this.control1_y = 0;
        this.control2_x = 0;
        this.control2_y = 0;
        this.curveType = 0;
    }
    static newPoint(x, y, curveType) {
        var pt = new GPathPoint();
        pt.x = x || 0;
        pt.y = y || 0;
        pt.control1_x = 0;
        pt.control1_y = 0;
        pt.control2_x = 0;
        pt.control2_y = 0;
        pt.curveType = curveType || CurveType.CRSpline;
        return pt;
    }
    static newBezierPoint(x, y, control1_x, control1_y) {
        var pt = new GPathPoint();
        pt.x = x || 0;
        pt.y = y || 0;
        pt.control1_x = control1_x || 0;
        pt.control1_y = control1_y || 0;
        pt.control2_x = 0;
        pt.control2_y = 0;
        pt.curveType = CurveType.Bezier;
        return pt;
    }
    static newCubicBezierPoint(x, y, control1_x, control1_y, control2_x, control2_y) {
        var pt = new GPathPoint();
        pt.x = x || 0;
        pt.y = y || 0;
        pt.control1_x = control1_x || 0;
        pt.control1_y = control1_y || 0;
        pt.control2_x = control2_x || 0;
        pt.control2_y = control2_y || 0;
        pt.curveType = CurveType.CubicBezier;
        return pt;
    }
    clone() {
        var ret = new GPathPoint();
        ret.x = this.x;
        ret.y = this.y;
        ret.control1_x = this.control1_x;
        ret.control1_y = this.control1_y;
        ret.control2_x = this.control2_x;
        ret.control2_y = this.control2_y;
        ret.curveType = this.curveType;
        return ret;
    }
}

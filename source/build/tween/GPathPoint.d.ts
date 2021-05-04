export declare enum CurveType {
    CRSpline = 0,
    Bezier = 1,
    CubicBezier = 2,
    Straight = 3
}
export declare class GPathPoint {
    x: number;
    y: number;
    control1_x: number;
    control1_y: number;
    control2_x: number;
    control2_y: number;
    curveType: number;
    constructor();
    static newPoint(x: number, y: number, curveType: number): GPathPoint;
    static newBezierPoint(x: number, y: number, control1_x: number, control1_y: number): GPathPoint;
    static newCubicBezierPoint(x: number, y: number, control1_x: number, control1_y: number, control2_x: number, control2_y: number): GPathPoint;
    clone(): GPathPoint;
}

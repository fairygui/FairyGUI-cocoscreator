namespace fgui {
    export enum CurveType {
        CRSpline,
        Bezier,
        CubicBezier,
        Straight
    }

    export class GPathPoint {
        public x: number;
        public y: number;

        public control1_x: number;
        public control1_y: number;

        public control2_x: number;
        public control2_y: number;

        public curveType: number;

        constructor() {
            this.x = 0;
            this.y = 0;
            this.control1_x = 0;
            this.control1_y = 0;
            this.control2_x = 0;
            this.control2_y = 0;
            this.curveType = 0;
        }

        public static newPoint(x: number = 0, y: number = 0, curveType: number = 0): GPathPoint {
            var pt: GPathPoint = new GPathPoint();
            pt.x = x;
            pt.y = y;
            pt.control1_x = 0;
            pt.control1_y = 0;
            pt.control2_x = 0;
            pt.control2_y = 0;
            pt.curveType = curveType;

            return pt;
        }

        public static newBezierPoint(x: number = 0, y: number = 0,
            control1_x: number = 0, control1_y: number = 0): GPathPoint {
            var pt: GPathPoint = new GPathPoint();
            pt.x = x;
            pt.y = y;
            pt.control1_x = control1_x;
            pt.control1_y = control1_y;
            pt.control2_x = 0;
            pt.control2_y = 0;
            pt.curveType = CurveType.Bezier;

            return pt;
        }

        public static newCubicBezierPoint(x: number = 0, y: number = 0,
            control1_x: number = 0, control1_y: number = 0,
            control2_x: number = 0, control2_y: number = 0): GPathPoint {
            var pt: GPathPoint = new GPathPoint();
            pt.x = x;
            pt.y = y;
            pt.control1_x = control1_x;
            pt.control1_y = control1_y;
            pt.control2_x = control2_x;
            pt.control2_y = control2_y;
            pt.curveType = CurveType.CubicBezier;

            return pt;
        }

        public clone(): GPathPoint {
            var ret: GPathPoint = new GPathPoint();
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
}

namespace fgui {

    export class ColorMatrix {
        public matrix: Array<number>;

        // identity matrix constant:
        private static IDENTITY_MATRIX: Array<number> = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
        private static LENGTH: number = ColorMatrix.IDENTITY_MATRIX.length;

        private static LUMA_R: number = 0.299;
        private static LUMA_G: number = 0.587;
        private static LUMA_B: number = 0.114;

        public static create(p_brightness: number, p_contrast: number, p_saturation: number, p_hue: number): ColorMatrix {
            var ret: ColorMatrix = new ColorMatrix();
            ret.adjustColor(p_brightness, p_contrast, p_saturation, p_hue);
            return ret;
        }

        public constructor() {
            this.matrix = new Array<number>(ColorMatrix.LENGTH);
            this.reset();
        }

        // public methods:
        public reset(): void {
            for (var i: number = 0; i < ColorMatrix.LENGTH; i++) {
                this.matrix[i] = ColorMatrix.IDENTITY_MATRIX[i];
            }
        }

        public invert(): void {
            this.multiplyMatrix([-1, 0, 0, 0, 255,
                0, -1, 0, 0, 255,
                0, 0, -1, 0, 255,
                0, 0, 0, 1, 0]);
        }

        public adjustColor(p_brightness: number, p_contrast: number, p_saturation: number, p_hue: number): void {
            this.adjustHue(p_hue);
            this.adjustContrast(p_contrast);
            this.adjustBrightness(p_brightness);
            this.adjustSaturation(p_saturation);
        }

        public adjustBrightness(p_val: number): void {
            p_val = this.cleanValue(p_val, 1) * 255;
            this.multiplyMatrix([
                1, 0, 0, 0, p_val,
                0, 1, 0, 0, p_val,
                0, 0, 1, 0, p_val,
                0, 0, 0, 1, 0
            ]);
        }

        public adjustContrast(p_val: number): void {
            p_val = this.cleanValue(p_val, 1);
            var s: number = p_val + 1;
            var o: number = 128 * (1 - s);
            this.multiplyMatrix([
                s, 0, 0, 0, o,
                0, s, 0, 0, o,
                0, 0, s, 0, o,
                0, 0, 0, 1, 0
            ]);
        }

        public adjustSaturation(p_val: number): void {
            p_val = this.cleanValue(p_val, 1);
            p_val += 1;

            var invSat: number = 1 - p_val;
            var invLumR: number = invSat * ColorMatrix.LUMA_R;
            var invLumG: number = invSat * ColorMatrix.LUMA_G;
            var invLumB: number = invSat * ColorMatrix.LUMA_B;

            this.multiplyMatrix([
                (invLumR + p_val), invLumG, invLumB, 0, 0,
                invLumR, (invLumG + p_val), invLumB, 0, 0,
                invLumR, invLumG, (invLumB + p_val), 0, 0,
                0, 0, 0, 1, 0
            ]);
        }

        public adjustHue(p_val: number): void {
            p_val = this.cleanValue(p_val, 1);
            p_val *= Math.PI;

            var cos: number = Math.cos(p_val);
            var sin: number = Math.sin(p_val);

            this.multiplyMatrix([
                ((ColorMatrix.LUMA_R + (cos * (1 - ColorMatrix.LUMA_R))) + (sin * -(ColorMatrix.LUMA_R))), ((ColorMatrix.LUMA_G + (cos * -(ColorMatrix.LUMA_G))) + (sin * -(ColorMatrix.LUMA_G))), ((ColorMatrix.LUMA_B + (cos * -(ColorMatrix.LUMA_B))) + (sin * (1 - ColorMatrix.LUMA_B))), 0, 0,
                ((ColorMatrix.LUMA_R + (cos * -(ColorMatrix.LUMA_R))) + (sin * 0.143)), ((ColorMatrix.LUMA_G + (cos * (1 - ColorMatrix.LUMA_G))) + (sin * 0.14)), ((ColorMatrix.LUMA_B + (cos * -(ColorMatrix.LUMA_B))) + (sin * -0.283)), 0, 0,
                ((ColorMatrix.LUMA_R + (cos * -(ColorMatrix.LUMA_R))) + (sin * -((1 - ColorMatrix.LUMA_R)))), ((ColorMatrix.LUMA_G + (cos * -(ColorMatrix.LUMA_G))) + (sin * ColorMatrix.LUMA_G)), ((ColorMatrix.LUMA_B + (cos * (1 - ColorMatrix.LUMA_B))) + (sin * ColorMatrix.LUMA_B)), 0, 0,
                0, 0, 0, 1, 0
            ]);
        }

        public concat(p_matrix: Array<number>): void {
            if (p_matrix.length != ColorMatrix.LENGTH) { return; }
            this.multiplyMatrix(p_matrix);
        }

        public clone(): ColorMatrix {
            var result: ColorMatrix = new ColorMatrix();
            result.copyMatrix(this.matrix);
            return result;
        }

        protected copyMatrix(p_matrix: Array<number>): void {
            var l: number = ColorMatrix.LENGTH;
            for (var i: number = 0; i < l; i++) {
                this.matrix[i] = p_matrix[i];
            }
        }

        protected multiplyMatrix(p_matrix: Array<number>): void {
            var col: Array<number> = [];

            var i: number = 0;

            for (var y: number = 0; y < 4; ++y) {
                for (var x: number = 0; x < 5; ++x) {
                    col[i + x] = p_matrix[i] * this.matrix[x] +
                        p_matrix[i + 1] * this.matrix[x + 5] +
                        p_matrix[i + 2] * this.matrix[x + 10] +
                        p_matrix[i + 3] * this.matrix[x + 15] +
                        (x == 4 ? p_matrix[i + 4] : 0);
                }

                i += 5;
            }

            this.copyMatrix(col);
        }

        protected cleanValue(p_val: number, p_limit: number): number {
            return Math.min(p_limit, Math.max(-p_limit, p_val));
        }
    }
}
import Point from './Point';
import { PI_2 } from '../const';

/**
 * The PixiJS Matrix class as an object, which makes it a lot faster,
 * here is a representation of it :
 * | a | c | tx|
 * | b | d | ty|
 * | 0 | 0 | 1 |
 *
 * @class
 * @memberof PIXI
 */
export default class Matrix {
    /**
     * @param {number} [a=1] - x scale
     * @param {number} [b=0] - x skew
     * @param {number} [c=0] - y skew
     * @param {number} [d=1] - y scale
     * @param {number} [tx=0] - x translation
     * @param {number} [ty=0] - y translation
     */
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
        /**
         * @member {number}
         * @default 1
         */
        this.a = a;

        /**
         * @member {number}
         * @default 0
         */
        this.b = b;

        /**
         * @member {number}
         * @default 0
         */
        this.c = c;

        /**
         * @member {number}
         * @default 1
         */
        this.d = d;

        /**
         * @member {number}
         * @default 0
         */
        this.tx = tx;

        /**
         * @member {number}
         * @default 0
         */
        this.ty = ty;

        this.array = null;
    }

    /**
     * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
     *
     * a = array[0]
     * b = array[1]
     * c = array[3]
     * d = array[4]
     * tx = array[2]
     * ty = array[5]
     *
     * @param {number[]} array - The array that the matrix will be populated from.
     */
    fromArray(array) {
        this.a = array[0];
        this.b = array[1];
        this.c = array[3];
        this.d = array[4];
        this.tx = array[2];
        this.ty = array[5];
    }

    /**
     * sets the matrix properties
     *
     * @param {number} a - Matrix component
     * @param {number} b - Matrix component
     * @param {number} c - Matrix component
     * @param {number} d - Matrix component
     * @param {number} tx - Matrix component
     * @param {number} ty - Matrix component
     *
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    set(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;

        return this;
    }

    /**
     * Creates an array from the current Matrix object.
     *
     * @param {boolean} transpose - Whether we need to transpose the matrix or not
     * @param {Float32Array} [out=new Float32Array(9)] - If provided the array will be assigned to out
     * @return {number[]} the newly created array which contains the matrix
     */
    toArray(transpose, out) {
        if (!this.array) {
            this.array = new Float32Array(9);
        }

        const array = out || this.array;

        if (transpose) {
            array[0] = this.a;
            array[1] = this.b;
            array[2] = 0;
            array[3] = this.c;
            array[4] = this.d;
            array[5] = 0;
            array[6] = this.tx;
            array[7] = this.ty;
            array[8] = 1;
        }
        else {
            array[0] = this.a;
            array[1] = this.c;
            array[2] = this.tx;
            array[3] = this.b;
            array[4] = this.d;
            array[5] = this.ty;
            array[6] = 0;
            array[7] = 0;
            array[8] = 1;
        }

        return array;
    }

    /**
     * Get a new position with the current transformation applied.
     * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
     * 获取一个使用当前 Matrix 转换之后的点
     * 可以用它来获取子坐标中的点在世界坐标空间的位置
     * 参考 {PIXI.DisplayObject} property toGlobal
     *
     * |a c tx|   |x|   |a*x+c*y+tx|
     * |b d ty| x |y| = |b*x+d*y+ty|
     * |0 0 1 |   |1|   |1         |
     *
     * @param {PIXI.Point} pos - The origin
     * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
     * @return {PIXI.Point} The new point, transformed through this matrix
     */
    apply(pos, newPos) {
        newPos = newPos || new Point();

        const x = pos.x;
        const y = pos.y;

        newPos.x = (this.a * x) + (this.c * y) + this.tx;
        newPos.y = (this.b * x) + (this.d * y) + this.ty;

        return newPos;
    }

    /**
     * Get a new position with the inverse of the current transformation applied.
     * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
     * 获取一个使用逆矩阵转换之后的点
     * 可以用它来获取世界坐标空间中的点，在子坐标空间中的位置
     * 参考 {PIXI.DisplayObject} property toLocal
     *
     * @param {PIXI.Point} pos - The origin
     * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
     * @return {PIXI.Point} The new point, inverse-transformed through this matrix
     */
    applyInverse(pos, newPos) {
        newPos = newPos || new Point();

        const id = 1 / ((this.a * this.d) + (this.c * -this.b));

        const x = pos.x;
        const y = pos.y;

        newPos.x = (this.d * id * x) + (-this.c * id * y) + (((this.ty * this.c) - (this.tx * this.d)) * id);
        newPos.y = (this.a * id * y) + (-this.b * id * x) + (((-this.ty * this.a) + (this.tx * this.b)) * id);

        return newPos;
    }

    /**
     * Translates the matrix on the x and y.
     * 位移
     *
     * @param {number} x How much to translate x by
     * @param {number} y How much to translate y by
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    translate(x, y) {
        this.tx += x;
        this.ty += y;

        return this;
    }

    /**
     * Applies a scale transformation to the matrix.
     * 缩放
     *
     * |x 0 0|   |a c tx|   |a*x c*x tx*x|
     * |0 y 0| x |b d ty| = |b*y d*y ty*y|
     * |0 0 1|   |0 0 1 |   |0   0   1   |
     *
     * @param {number} x The amount to scale horizontally
     * @param {number} y The amount to scale vertically
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    scale(x, y) {
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        // Q:scale 为什么会影响tx和ty的值
        // A:控制点不是注册点的时候，缩放会影响注册点的位置
        this.tx *= x;
        this.ty *= y;

        return this;
    }

    /**
     * Applies a rotation transformation to the matrix.
     * 旋转
     *
     * |cos -sin 0|   |a c tx|   |cos*a-sin*b cos*c-sin*d cos*tx-sin*ty|
     * |sin cos  0| x |b d ty| = |sin*a+cos*d sin*c+cos*d sin*tx+cos*ty|
     * |0   0    1|   |0 0 1 |   |0           0           1            |
     *
     * @param {number} angle - The angle in radians.
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const a1 = this.a;
        const c1 = this.c;
        const tx1 = this.tx;

        this.a = (a1 * cos) - (this.b * sin);
        this.b = (a1 * sin) + (this.b * cos);
        this.c = (c1 * cos) - (this.d * sin);
        this.d = (c1 * sin) + (this.d * cos);
        this.tx = (tx1 * cos) - (this.ty * sin);
        this.ty = (tx1 * sin) + (this.ty * cos);

        return this;
    }

    /**
     * Appends the given Matrix to this Matrix.
     *
     * |a c tx|   |ma mc mtx|    |a*ma+c*mb a*mc+c*md a*mtx+c*mty+tx|
     * |b d ty| x |mb md mty|  = |b*ma+d*mb b*mc+d*md b*mtx+d*mty+ty|
     * |0 0 1 |   |0  0  1  |    |0         0         1             |
     *
     * @param {PIXI.Matrix} matrix - The matrix to append.
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    append(matrix) {
        const a1 = this.a;
        const b1 = this.b;
        const c1 = this.c;
        const d1 = this.d;

        this.a = (matrix.a * a1) + (matrix.b * c1);
        this.b = (matrix.a * b1) + (matrix.b * d1);
        this.c = (matrix.c * a1) + (matrix.d * c1);
        this.d = (matrix.c * b1) + (matrix.d * d1);

        this.tx = (matrix.tx * a1) + (matrix.ty * c1) + this.tx;
        this.ty = (matrix.tx * b1) + (matrix.ty * d1) + this.ty;

        return this;
    }

    /**
     * Sets the matrix based on all the available properties
     *
     * 关于这个问题的争论：
     * https://github.com/pixijs/pixi.js/issues/4417
     *
     * @param {number} x - Position on the x axis
     * @param {number} y - Position on the y axis
     * @param {number} pivotX - Pivot on the x axis
     * @param {number} pivotY - Pivot on the y axis
     * @param {number} scaleX - Scale on the x axis
     * @param {number} scaleY - Scale on the y axis
     * @param {number} rotation - Rotation in radians
     * @param {number} skewX - Skew on the x axis
     * @param {number} skewY - Skew on the y axis
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    setTransform(x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
        const sr = Math.sin(rotation);
        const cr = Math.cos(rotation);

        const cy = Math.cos(skewY);
        const sy = Math.sin(skewY);
        const nsx = -Math.sin(skewX);
        const cx = Math.cos(skewX);

        /**
         *
         *          |scaleX 0     |
         *          |0      scaleY|
         *
         * |cr -sr| |a      c     |
         * |sr cr | |b      d     |
         *
         * */
        const a = cr * scaleX;
        const b = sr * scaleX;
        const c = -sr * scaleY;
        const d = cr * scaleY;

        /**
         *         |cy nsx pivotX|
         *         |sy cx  pivotY|
         *         |0  0   1     |
         *
         * |a c x| |.a .c .tx    |
         * |b d y| |.b .d .ty    |
         *
         * */

        this.a = (cy * a) + (sy * c);
        this.b = (cy * b) + (sy * d);
        this.c = (nsx * a) + (cx * c);
        this.d = (nsx * b) + (cx * d);

        this.tx = x + ((pivotX * a) + (pivotY * c));
        this.ty = y + ((pivotX * b) + (pivotY * d));
        return this;
    }
    // setTransform处理合并时，保留俩者（pixijs库下和xesdog库上）
    setTransform(x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY)
    {
        this.a = Math.cos(rotation + skewY) * scaleX;
        this.b = Math.sin(rotation + skewY) * scaleX;
        this.c = -Math.sin(rotation - skewX) * scaleY;
        this.d = Math.cos(rotation - skewX) * scaleY;

        this.tx = x - ((pivotX * this.a) + (pivotY * this.c));
        this.ty = y - ((pivotX * this.b) + (pivotY * this.d));

        return this;
    }

    /**
     * Prepends the given Matrix to this Matrix.
     *
     * @param {PIXI.Matrix} matrix - The matrix to prepend
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    prepend(matrix) {
        const tx1 = this.tx;

        if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
            const a1 = this.a;
            const c1 = this.c;

            this.a = (a1 * matrix.a) + (this.b * matrix.c);
            this.b = (a1 * matrix.b) + (this.b * matrix.d);
            this.c = (c1 * matrix.a) + (this.d * matrix.c);
            this.d = (c1 * matrix.b) + (this.d * matrix.d);
        }

        this.tx = (tx1 * matrix.a) + (this.ty * matrix.c) + matrix.tx;
        this.ty = (tx1 * matrix.b) + (this.ty * matrix.d) + matrix.ty;

        return this;
    }

    /**
     * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
     *
     * @param {PIXI.Transform|PIXI.TransformStatic} transform - The transform to apply the properties to.
     * @return {PIXI.Transform|PIXI.TransformStatic} The transform with the newly applied properties
     */
    decompose(transform) {
        // sort out rotation / skew..
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;

        const skewX = -Math.atan2(-c, d);
        const skewY = Math.atan2(b, a);

        const delta = Math.abs(skewX + skewY);

        //   合并处理来自xesdog的调整
        //  if (delta < 0.00001) {
        if (delta < 0.00001 || Math.abs(PI_2 - delta) < 0.00001)
        {
            transform.rotation = skewY;

            if (a < 0 && d >= 0) {
                transform.rotation += (transform.rotation <= 0) ? Math.PI : -Math.PI;
            }

            transform.skew.x = transform.skew.y = 0;
        }
       // else { 合并处理
        else
        {
            transform.rotation = 0;
            transform.skew.x = skewX;
            transform.skew.y = skewY;
        }

        // next set scale
        transform.scale.x = Math.sqrt((a * a) + (b * b));
        transform.scale.y = Math.sqrt((c * c) + (d * d));

        // next set position
        transform.position.x = this.tx;
        transform.position.y = this.ty;

        return transform;
    }

    /**
     * Inverts this matrix
     *
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    invert() {
        const a1 = this.a;
        const b1 = this.b;
        const c1 = this.c;
        const d1 = this.d;
        const tx1 = this.tx;
        const n = (a1 * d1) - (b1 * c1);

        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = ((c1 * this.ty) - (d1 * tx1)) / n;
        this.ty = -((a1 * this.ty) - (b1 * tx1)) / n;

        return this;
    }

    /**
     * Resets this Matix to an identity (default) matrix.
     *
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    identity() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;

        return this;
    }

    /**
     * Creates a new Matrix object with the same values as this one.
     *
     * @return {PIXI.Matrix} A copy of this matrix. Good for chaining method calls.
     */
    clone() {
        const matrix = new Matrix();

        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;

        return matrix;
    }

    /**
     * Changes the values of the given matrix to be the same as the ones in this matrix
     *
     * @param {PIXI.Matrix} matrix - The matrix to copy from.
     * @return {PIXI.Matrix} The matrix given in parameter with its values updated.
     */
    copy(matrix) {
        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;

        return matrix;
    }

    /**
     * A default (identity) matrix
     *
     * @static
     * @const
     */
    static get IDENTITY() {
        return new Matrix();
    }

    /**
     * A temp matrix
     *
     * @static
     * @const
     */
    static get TEMP_MATRIX() {
        return new Matrix();
    }
}

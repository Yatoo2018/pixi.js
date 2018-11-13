import EventEmitter from 'eventemitter3';
import {TRANSFORM_MODE} from '../const';
import settings from '../settings';
import TransformStatic from './TransformStatic';
import Transform from './Transform';
import Bounds from './Bounds';
import {Rectangle} from '../math';
// _tempDisplayObjectParent = new DisplayObject();

/**
 * The base class for all objects that are rendered on the screen.
 * This is an abstract class and should not be used on its own rather it should be extended.
 * 所有显示对象的基类
 *
 * @class
 * @extends EventEmitter
 * @memberof PIXI
 */
export default class DisplayObject extends EventEmitter {
    /**
     *
     */
    constructor() {
        super();

        const TransformClass = settings.TRANSFORM_MODE === TRANSFORM_MODE.STATIC ? TransformStatic : Transform;

        this.tempDisplayObjectParent = null;

        // TODO: need to create Transform from factory
        /**
         * World transform and local transform of this object.
         * This will become read-only later, please do not assign anything there unless you know what are you doing
         *
         * @member {PIXI.TransformBase}
         */
        this.transform = new TransformClass();

        /**
         * The opacity of the object.
         *
         * @member {number}
         */
        this.alpha = 1;

        /**
         * The visibility of the object. If false the object will not be drawn, and
         * the updateTransform function will not be called.
         *
         * Only affects recursive calls from parent. You can ask for bounds or call updateTransform manually
         *
         * @member {boolean}
         */
        this.visible = true;

        /**
         * Can this object be rendered, if false the object will not be drawn but the updateTransform
         * methods will still be called.
         * 该对象是否被能够被渲染，如果设置为false，该对象不被渲染，但是updateTransform方法依然会被执行
         *
         * Only affects recursive calls from parent. You can ask for bounds manually
         *
         * @member {boolean}
         */
        this.renderable = true;

        /**
         * The display object container that contains this display object.
         * 父容器
         *
         * @member {PIXI.Container}
         * @readonly
         */
        this.parent = null;

        /**
         * The multiplied alpha of the displayObject
         *
         * @member {number}
         * @readonly
         */
        this.worldAlpha = 1;

        /**
         * The area the filter is applied to. This is used as more of an optimisation
         * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle
         *
         *
         * Also works as an interaction mask
         *
         * @member {PIXI.Rectangle}
         */
        this.filterArea = null;

        this._filters = null;
        this._enabledFilters = null;

        /**
         * The bounds object, this is used to calculate and store the bounds of the displayObject
         *
         * @member {PIXI.Rectangle}
         * @private
         */
        this._bounds = new Bounds();
        this._boundsID = 0;
        this._lastBoundsID = -1;
        this._boundsRect = null;
        this._localBoundsRect = null;

        /**
         * The original, cached mask of the object
         *
         * @member {PIXI.Graphics|PIXI.Sprite}
         * @private
         */
        this._mask = null;

        /**
         * If the object has been destroyed via destroy(). If true, it should not be used.
         *
         * @member {boolean}
         * @private
         * @readonly
         */
        this._destroyed = false;

        /**
         * Fired when this DisplayObject is added to a Container.
         *
         * @event PIXI.DisplayObject#added
         * @param {PIXI.Container} container - The container added to.
         */

        /**
         * Fired when this DisplayObject is removed from a Container.
         *
         * @event PIXI.DisplayObject#removed
         * @param {PIXI.Container} container - The container removed from.
         */
    }

    /**
     * @private
     * @member {PIXI.DisplayObject}
     */
    get _tempDisplayObjectParent() {
        if (this.tempDisplayObjectParent === null) {
            this.tempDisplayObjectParent = new DisplayObject();
        }

        return this.tempDisplayObjectParent;
    }

    /**
     * Updates the object transform for rendering
     *
     * TODO - Optimization pass!
     */
    updateTransform() {
        this.transform.updateTransform(this.parent.transform);
        // multiply the alphas..
        this.worldAlpha = this.alpha * this.parent.worldAlpha;

        this._bounds.updateID++;
    }

    /**
     * recursively updates transform of all objects from the root to this one
     * internal function for toLocal()
     * 递归更新从根节点到当前的所有对象的 transform 属性
     */
    _recursivePostUpdateTransform() {
        if (this.parent) {
            this.parent._recursivePostUpdateTransform();
            this.transform.updateTransform(this.parent.transform);
        }
        else {
            this.transform.updateTransform(this._tempDisplayObjectParent.transform);
        }
    }

    /**
     * Retrieves the bounds of the displayObject as a rectangle object.
     * 获取显示对象边框
     *
     * @param {boolean} skipUpdate - setting to true will stop the transforms of the scene graph from
     *  being updated. This means the calculation returned MAY be out of date BUT will give you a
     *  nice performance boost
     *  设置为true，将跳过transform的更新，计算的结果可能过时了，但是能够提升性能
     *
     * @param {PIXI.Rectangle} rect - Optional rectangle to store the result of the bounds calculation
     * 可选，用来存储计算结果
     *
     * @return {PIXI.Rectangle} the rectangular bounding area
     */
    getBounds(skipUpdate, rect) {
        if (!skipUpdate) {
            if (!this.parent) {
                this.parent = this._tempDisplayObjectParent;
                this.updateTransform();
                this.parent = null;
            }
            else {
                this._recursivePostUpdateTransform();
                this.updateTransform();
            }
        }

        if (this._boundsID !== this._lastBoundsID) {
            this.calculateBounds();
        }

        if (!rect) {
            if (!this._boundsRect) {
                this._boundsRect = new Rectangle();
            }

            rect = this._boundsRect;
        }

        return this._bounds.getRectangle(rect);
    }

    /**
     * Retrieves the local bounds of the displayObject as a rectangle object
     *
     * 将该对象单独拎出来处理，处理完成之后再将parent赋值回去
     *
     * @param {PIXI.Rectangle} [rect] - Optional rectangle to store the result of the bounds calculation
     * @return {PIXI.Rectangle} the rectangular bounding area
     */
    getLocalBounds(rect) {
        const transformRef = this.transform;
        const parentRef = this.parent;

        this.parent = null;
        this.transform = this._tempDisplayObjectParent.transform;

        if (!rect) {
            if (!this._localBoundsRect) {
                this._localBoundsRect = new Rectangle();
            }

            rect = this._localBoundsRect;
        }

        const bounds = this.getBounds(false, rect);

        this.parent = parentRef;
        this.transform = transformRef;

        return bounds;
    }

    /**
     * Calculates the global position of the display object
     *
     * 计算显示对象的全局位置
     *
     * @param {PIXI.Point} position - The world origin to calculate from
     * @param {PIXI.Point} [point] - A Point object in which to store the value, optional
     *  (otherwise will create a new Point)
     * @param {boolean} [skipUpdate=false] - Should we skip the update transform.
     * @return {PIXI.Point} A point object representing the position of this object
     */
    toGlobal(position, point, skipUpdate = false) {
        if (!skipUpdate) {
            this._recursivePostUpdateTransform();

            // this parent check is for just in case the item is a root object.
            // If it is we need to give it a temporary parent so that displayObjectUpdateTransform works correctly
            // this is mainly to avoid a parent check in the main loop. Every little helps for performance :)
            if (!this.parent) {
                this.parent = this._tempDisplayObjectParent;
                this.displayObjectUpdateTransform();
                this.parent = null;
            }
            else {
                this.displayObjectUpdateTransform();
            }
        }

        // don't need to update the lot
        return this.worldTransform.apply(position, point);
    }

    /**
     * Calculates the local position of the display object relative to another point
     *
     * @param {PIXI.Point} position - The world origin to calculate from
     * @param {PIXI.DisplayObject} [from] - The DisplayObject to calculate the global position from
     * @param {PIXI.Point} [point] - A Point object in which to store the value, optional
     *  (otherwise will create a new Point)
     * @param {boolean} [skipUpdate=false] - Should we skip the update transform
     * @return {PIXI.Point} A point object representing the position of this object
     */
    toLocal(position, from, point, skipUpdate) {
        if (from) {
            position = from.toGlobal(position, point, skipUpdate);
        }

        if (!skipUpdate) {
            this._recursivePostUpdateTransform();

            // this parent check is for just in case the item is a root object.
            // If it is we need to give it a temporary parent so that displayObjectUpdateTransform works correctly
            // this is mainly to avoid a parent check in the main loop. Every little helps for performance :)
            if (!this.parent) {
                this.parent = this._tempDisplayObjectParent;
                this.displayObjectUpdateTransform();
                this.parent = null;
            }
            else {
                this.displayObjectUpdateTransform();
            }
        }

        // simply apply the matrix..
        return this.worldTransform.applyInverse(position, point);
    }

    /**
     * Renders the object using the WebGL renderer
     *
     * @param {PIXI.WebGLRenderer} renderer - The renderer
     */
    renderWebGL(renderer) // eslint-disable-line no-unused-vars
    {
        // OVERWRITE;
    }

    /**
     * Renders the object using the Canvas renderer
     *
     * @param {PIXI.CanvasRenderer} renderer - The renderer
     */
    renderCanvas(renderer) // eslint-disable-line no-unused-vars
    {
        // OVERWRITE;
    }

    /**
     * Set the parent Container of this DisplayObject
     * 设置显示对象的parent
     *
     * @param {PIXI.Container} container - The Container to add this DisplayObject to
     * 容器
     * @return {PIXI.Container} The Container that this DisplayObject was added to
     * 返回该容器
     */
    setParent(container) {
        if (!container || !container.addChild) {
            throw new Error('setParent: Argument must be a Container');
        }

        container.addChild(this);

        return container;
    }

    /**
     * Convenience function to set the position, scale, skew and pivot at once.
     * 方便设置position，scale，skew以及pivot
     *
     * @param {number} [x=0] - The X position
     * @param {number} [y=0] - The Y position
     * @param {number} [scaleX=1] - The X scale value
     * @param {number} [scaleY=1] - The Y scale value
     * @param {number} [rotation=0] - The rotation
     * @param {number} [skewX=0] - The X skew value
     * @param {number} [skewY=0] - The Y skew value
     * @param {number} [pivotX=0] - The X pivot value
     * @param {number} [pivotY=0] - The Y pivot value
     * @return {PIXI.DisplayObject} The DisplayObject instance
     */
    setTransform(x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0, skewX = 0, skewY = 0, pivotX = 0, pivotY = 0) {
        this.position.x = x;
        this.position.y = y;
        this.scale.x = !scaleX ? 1 : scaleX;
        this.scale.y = !scaleY ? 1 : scaleY;
        this.rotation = rotation;
        this.skew.x = skewX;
        this.skew.y = skewY;
        this.pivot.x = pivotX;
        this.pivot.y = pivotY;

        return this;
    }

    /**
     * Base destroy method for generic display objects. This will automatically
     * remove the display object from its parent Container as well as remove
     * all current event listeners and internal references. Do not use a DisplayObject
     * after calling `destroy`.
     * 通用显示对象的基础destroy方法
     * 将自动从父容器中移除，以及移除所有侦听事件和内部引用
     * 不要在执行`destroy`之后使用该显示对象
     *
     */
    destroy() {
        this.removeAllListeners();
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.transform = null;

        this.parent = null;

        this._bounds = null;
        this._currentBounds = null;
        this._mask = null;

        this.filterArea = null;

        this.interactive = false;
        this.interactiveChildren = false;

        this._destroyed = true;
    }

    /**
     * The position of the displayObject on the x axis relative to the local coordinates of the parent.
     * An alias to position.x
     *
     * @member {number}
     */
    get x() {
        return this.position.x;
    }

    set x(value) // eslint-disable-line require-jsdoc
    {
        this.transform.position.x = value;
    }

    /**
     * The position of the displayObject on the y axis relative to the local coordinates of the parent.
     * An alias to position.y
     *
     * @member {number}
     */
    get y() {
        return this.position.y;
    }

    set y(value) // eslint-disable-line require-jsdoc
    {
        this.transform.position.y = value;
    }

    /**
     * Current transform of the object based on world (parent) factors
     *
     * @member {PIXI.Matrix}
     * @readonly
     */
    get worldTransform() {
        return this.transform.worldTransform;
    }

    /**
     * Current transform of the object based on local factors: position, scale, other stuff
     *
     * @member {PIXI.Matrix}
     * @readonly
     */
    get localTransform() {
        return this.transform.localTransform;
    }

    /**
     * The coordinate of the object relative to the local coordinates of the parent.
     * Assignment by value since pixi-v4.
     *
     * @member {PIXI.Point|PIXI.ObservablePoint}
     */
    get position() {
        return this.transform.position;
    }

    set position(value) // eslint-disable-line require-jsdoc
    {
        this.transform.position.copy(value);
    }

    /**
     * The scale factor of the object.
     * Assignment by value since pixi-v4.
     *
     * @member {PIXI.Point|PIXI.ObservablePoint}
     */
    get scale() {
        return this.transform.scale;
    }

    set scale(value) // eslint-disable-line require-jsdoc
    {
        this.transform.scale.copy(value);
    }

    /**
     * The pivot point of the displayObject that it rotates around.
     * Assignment by value since pixi-v4.
     *
     * @member {PIXI.Point|PIXI.ObservablePoint}
     */
    get pivot() {
        return this.transform.pivot;
    }

    set pivot(value) // eslint-disable-line require-jsdoc
    {
        this.transform.pivot.copy(value);
    }

    /**
     * The skew factor for the object in radians.
     * Assignment by value since pixi-v4.
     *
     * @member {PIXI.ObservablePoint}
     */
    get skew() {
        return this.transform.skew;
    }

    set skew(value) // eslint-disable-line require-jsdoc
    {
        this.transform.skew.copy(value);
    }

    /**
     * The rotation of the object in radians.
     *
     * @member {number}
     */
    get rotation() {
        return this.transform.rotation;
    }

    set rotation(value) // eslint-disable-line require-jsdoc
    {
        this.transform.rotation = value;
    }

    /**
     * Indicates if the object is globally visible.
     * 声明是否全局显示
     *
     * @member {boolean}
     * @readonly
     */
    get worldVisible() {
        let item = this;

        do {
            if (!item.visible) {
                return false;
            }

            item = item.parent;
        } while (item);

        return true;
    }

    /**
     * Sets a mask for the displayObject. A mask is an object that limits the visibility of an
     * object to the shape of the mask applied to it. In PIXI a regular mask must be a
     * PIXI.Graphics or a PIXI.Sprite object. This allows for much faster masking in canvas as it
     * utilises shape clipping. To remove a mask, set this property to null.
     * 设置显示对象的遮罩
     * 遮罩设置一个shape来限制显示对象的显示区域
     * 在PIXI一个规则的遮罩米需是一个PIXI.Graphics或者PIXI.Sprite对象
     * 这会使你更快的利用shape做裁剪
     * 要移除遮罩，只需将该值设置为null
     *
     * @todo For the moment, PIXI.CanvasRenderer doesn't support PIXI.Sprite as mask.
     * 目前，PIXI.CanvasRenderer暂不支持PIXI.Sprite作为遮罩
     *
     * @member {PIXI.Graphics|PIXI.Sprite}
     */
    get mask() {
        return this._mask;
    }

    set mask(value) // eslint-disable-line require-jsdoc
    {
        if (this._mask) {
            this._mask.renderable = true;
            this._mask.isMask = false;
        }

        this._mask = value;

        if (this._mask) {
            this._mask.renderable = false;
            this._mask.isMask = true;
        }
    }

    /**
     * Sets the filters for the displayObject.
     * * IMPORTANT: This is a webGL only feature and will be ignored by the canvas renderer.
     * To remove filters simply set this property to 'null'
     * 设置显示对象滤镜
     * 注意：这仅是WebGL的特性，在canvas渲染中将被忽略
     * 可以通过设置为null来移除它
     *
     * @member {PIXI.Filter[]}
     */
    get filters() {
        return this._filters && this._filters.slice();
    }

    set filters(value) // eslint-disable-line require-jsdoc
    {
        this._filters = value && value.slice();
    }
}

// performance increase to avoid using call.. (10x faster)
DisplayObject.prototype.displayObjectUpdateTransform = DisplayObject.prototype.updateTransform;

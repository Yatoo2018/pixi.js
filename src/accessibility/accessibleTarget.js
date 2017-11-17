/**
 * {@link PIXI.accessibility.AccessibilityManager}的访问对象默认属性值
 *
 * @function accessibleTarget
 * @memberof PIXI.accessibility
 * @example
 *      function MyObject() {}
 *
 *      Object.assign(
 *          MyObject.prototype,
 *          PIXI.accessibility.accessibleTarget
 *      );
 */
export default {
    /**
     * 标识对象是否可访问，如果是`true`的话，访问管理器会根据属性设置覆盖一层阴影div。
     *
     * @member {boolean}
     */
    accessible: false,

    /**
     * 设置访问对象阴影div的title属性
     * 如果`accessibleTitle`和`accessibleHint`都为空的话，这个属性将会默认为'displayObject [tabIndex]'
     *
     * @member {string}
     */
    accessibleTitle: null,

    /**
     * 设置阴影div的提示信息属性
     * Sets the aria-label attribute of the shadow div
     *
     * @member {string}
     */
    accessibleHint: null,

    /**
     * @todo Needs docs.
     */
    tabIndex: 0,

    /**
     * @todo Needs docs.
     */
    _accessibleActive: false,

    /**
     * @todo Needs docs.
     */
    _accessibleDiv: false,
};

/**
 * 这个命名空间包含了终端用户的一些物理互动性的渲染器插件，比如屏幕呈现、键盘导航等等。
 *
 * 不要直接实例化这个插件，它已经包含在`renderer.plugins`属性中了。
 * 请看 {@link PIXI.CanvasRenderer#plugins} 或者{@link PIXI.WebGLRenderer#plugins}.
 * @namespace PIXI.accessibility
 */
export { default as accessibleTarget } from './accessibleTarget';
export { default as AccessibilityManager } from './AccessibilityManager';

/**
 * 命名空间prepare为预渲染显示对象提供了特殊的渲染器插件，这些插件可以异步的加载需要加载的资源、纹理、图像等。
 *
 * 不要直接实例化这些插件，你可以在`renderer.plugins`属性中找到它们。
 *
 * 请看{@link PIXI.CanvasRenderer#plugins}或者{@link PIXI.WebGLRenderer#plugins}。
 * @example
 * // Create a new application
 * const app = new PIXI.Application();
 * document.body.appendChild(app.view);
 *
 * // Don't start rendering right away
 * app.stop();
 *
 * // create a display object
 * const rect = new PIXI.Graphics()
 *     .beginFill(0x00ff00)
 *     .drawRect(40, 40, 200, 200);
 *
 * // Add to the stage
 * app.stage.addChild(rect);
 *
 * // Don't start rendering until the graphic is uploaded to the GPU
 * app.renderer.plugins.prepare.upload(app.stage, () => {
 *     app.start();
 * });
 * @namespace PIXI.prepare
 */
export { default as webgl } from './webgl/WebGLPrepare';
export { default as canvas } from './canvas/CanvasPrepare';
export { default as BasePrepare } from './BasePrepare';
export { default as CountLimiter } from './limiters/CountLimiter';
export { default as TimeLimiter } from './limiters/TimeLimiter';

PixiJS — The HTML5 Creation Engine
=============

![pixi.js logo](http://www.goodboydigital.com/pixijs/pixiV4_wide_full.jpg)

[![Inline docs](http://inch-ci.org/github/pixijs/pixi.js.svg?branch=dev)](http://inch-ci.org/github/pixijs/pixi.js)
[![Build Status](https://travis-ci.org/pixijs/pixi.js.svg?branch=dev)](https://travis-ci.org/pixijs/pixi.js)

开发本产品的目的是为了让所有设备上都能运行的一个轻量化的、快速的2D引擎库。PixiJS渲染器让所有人都能在不用了解WebGL知识的情况下体验硬件加速的快感。而且，它很快，真的真快。

If you want to keep up to date with the latest PixiJS news then feel free to follow us on twitter
([@doormat23](https://twitter.com/doormat23), [@rolnaaba](https://twitter.com/rolnaaba), [@bigtimebuddy](https://twitter.com/bigtimebuddy), [@ivanpopelyshev](https://twitter.com/ivanpopelyshev))
and we will keep you posted! You can also check back on [our site](http://www.pixijs.com)
as any breakthroughs will be posted up there too!

**Your support helps us make PixiJS even better. Make your pledge on [Patreon](https://www.patreon.com/user?u=2384552&ty=h&u=2384552) and we'll love you forever!**

### 为什么用PixiJS和什么时候用它

PixiJS是一个让你充满创造性的、交互式的视图操作的、跨平台的、更是不用考虑设备兼容性以及深入学习WebGL的渲染库。

PixiJS完全支持[WebGL](https://en.wikipedia.org/wiki/WebGL) ，而且如果需要的话可以无缝降级为HTML5的[canvas](https://en.wikipedia.org/wiki/Canvas_element) 。作为一个框架，PixiJS将会是交互设计师特别是近期从Adobe Flash转过来的好帮手。你可以用它来制作动画场景、交互网站、应用程序和HTML5的游戏等。没有了跨平台兼容性的问题和降级问题的困扰，你会更加享受这个开发过程。如果你想要创造流畅精确的交互体验、不去管繁重的api和底层的代码、以及避开所有浏览器带来的问题的话，你需要给你的下一个项目施一点PixiJS魔法！

**Boost your development and feel free to use your imagination!**

### 学习 ###
- 网站: 更多关于PixiJS [官网](http://www.pixijs.com/).
- 如何开始: 访问@kittykatattack的综合[教程](https://github.com/kittykatattack/learningPixi).
- 示例: 找到玩转PixiJS的正确切入点[demo](http://pixijs.github.io/examples/)!
- 文档: 查看PixiJS的API[文档](https://pixijs.github.io/docs/).
- Wiki: Other misc tutorials and resources are [on the Wiki](https://github.com/pixijs/pixi.js/wiki).

### 社区 ###
- Forums: Check out the [forum](http://www.html5gamedevs.com/forum/15-pixijs/) and [Stackoverflow](http://stackoverflow.com/search?q=pixi.js), both friendly places to ask your pixi questions.
- Inspiration: Check out the [gallery](http://www.pixijs.com/gallery) to see some of the amazing things people have created!
- Chat: You can join us on [Gitter](https://gitter.im/pixijs/pixi.js) To chat about PixiJS. We also now have a Slack channel. If you would like to join it please Send me an email (mat@goodboydigital.com) and I will invite you in.


### 组织 ###

It's easy to get started with PixiJS! Simply download a [prebuilt build](https://github.com/pixijs/pixi.js/wiki/FAQs#where-can-i-get-a-build)!

Alternatively, PixiJS can be installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or simply using a content delivery network (CDN) URL to embed PixiJS directly on your HTML page.

_Note: After v4.5.0, support for the [Bower](https://bower.io) package manager has been dropped. Please see the [release notes](https://github.com/pixijs/pixi.js/releases/tag/v4.5.0) for more information._

#### NPM 安装

```
$> npm install pixi.js
```

#### CDN 安装 (via cdnjs)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.5.1/pixi.min.js"></script>
```

_注意: `4.5.1` 可被替换为任何[版本](https://github.com/pixijs/pixi.js/releases) ._

### Demos ###

- [WebGL Filters!](http://pixijs.github.io/pixi-filters/examples/)
- [Run pixie run](http://www.goodboydigital.com/runpixierun)
- [Fight for Everyone](http://www.goodboydigital.com/casestudies/fightforeveryone)
- [Flash vs HTML](http://flashvhtml.com)
- [Bunny Demo](http://www.goodboydigital.com/pixijs/bunnymark)
- [Storm Brewing](http://www.goodboydigital.com/pixijs/storm)
- [Filters Demo](http://www.goodboydigital.com/pixijs/examples/15/indexAll.html)
- [Render Texture Demo](http://www.goodboydigital.com/pixijs/examples/11)
- [Primitives Demo](http://www.goodboydigital.com/pixijs/examples/13)
- [Masking Demo](http://www.goodboydigital.com/pixijs/examples/14)
- [Interaction Demo](http://www.goodboydigital.com/pixijs/examples/6)
- [photonstorm's Balls Demo](http://gametest.mobi/pixi/balls)
- [photonstorm's Morph Demo](http://gametest.mobi/pixi/morph)

Thanks to [@photonstorm](https://twitter.com/photonstorm) for providing
those last 2 examples and allowing us to share the source code :)

### 捐献 ###

Want to be part of the PixiJS project? Great! All are welcome! We will get there quicker
together :) Whether you find a bug, have a great feature request or you fancy owning a task
from the road map above feel free to get in touch.

Make sure to read the [Contributing Guide](https://github.com/pixijs/pixi.js/blob/master/CONTRIBUTING.md)
before submitting changes.

### 新特性 ###

- WebGL renderer (with automatic smart batching allowing for REALLY fast performance)
- Canvas renderer (Fastest in town!)
- Full scene graph
- Super easy to use API (similar to the flash display list API)
- Support for texture atlases
- Asset loader / sprite sheet loader
- Auto-detect which renderer should be used
- Full Mouse and Multi-touch Interaction
- Text
- BitmapFont text
- Multiline Text
- Render Texture
- Primitive Drawing
- Masking
- Filters
- [User Plugins](https://github.com/pixijs/pixi.js/wiki/v3-Pixi-Plugins)

### 基础用法示例 ###

```js
// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
var app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

// load the texture we need
PIXI.loader.add('bunny', 'bunny.png').load(function(loader, resources) {

    // This creates a texture from a 'bunny.png' image.
    var bunny = new PIXI.Sprite(resources.bunny.texture);

    // Setup the position of the bunny
    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;

    // Rotate around the center
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // Add the bunny to the scene we are building.
    app.stage.addChild(bunny);

    // Listen for frame updates
    app.ticker.add(function() {
         // each frame we spin the bunny around a bit
        bunny.rotation += 0.01;
    });
});
```

### 如何构建 ###

需要注意的是对于大多数用户来说不需要构建，如果你想要的仅仅是使用PixiJS的话，直接下载已经构建好的[版本](https://github.com/pixijs/pixi.js/releases)就可以。
你只有在开发它的时候才需要构建它。
如果你没有Node.js和NPM，请安装，然后用NPM在克隆目录安装和构建依赖：

```
$> npm install
```

然后，构建源码，运行：

```
$> npm run dist
```

这样会产生带有全插件的压缩的版本`dist/pixi.min.js` ，还有一个未压缩的版本`dist/pixi.js`

如果有个别插件你不想要的话，加入命令"interaction"、 "extras"

```
$> npm run dist -- --exclude extras --exclude interaction
```

简化版命令 `-e`:

```
$> npm run dist -- -e extras -e interaction -e filters
```

### 如何生成文档 ###

生成文档命令:

```
$> npm run docs
```

文档使用 [Jaguar.js](https://github.com/pixijs/jaguarjs-jsdoc) 和jsdoc, 配置文件[scripts/jsdoc.conf.json](scripts/jsdoc.conf.json)

### License ###

This content is released under the (http://opensource.org/licenses/MIT) MIT License.

[![Analytics](https://ga-beacon.appspot.com/UA-39213431-2/pixi.js/index)](https://github.com/igrigorik/ga-beacon)

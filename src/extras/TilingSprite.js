var core = require('../core'),
    TextureUvs = require('../core/textures/TextureUvs'),
    utils = require('../core/utils/')

/**
 * A tiling sprite is a fast way of rendering a tiling image
 *
 * @class
 * @extends Sprite
 * @namespace PIXI
 * @param texture {Texture} the texture of the tiling sprite
 * @param width {number}  the width of the tiling sprite
 * @param height {number} the height of the tiling sprite
 */
function TilingSprite(texture, width, height)
{
    core.Sprite.call(this, texture);



    /**
     * The scaling of the image that is being tiled
     *
     * @member {Point}
     */
    this.tileScale = new core.math.Point(1,1);


    /**
     * The offset position of the image that is being tiled
     *
     * @member {Point}
     */
    this.tilePosition = new core.math.Point(0,0);



    ///// private

    /**
     * The with of the tiling sprite
     *
     * @member {number}
     */
    this._width = width || 100;

    /**
     * The height of the tiling sprite
     *
     * @member {number}
     */
    this._height = height || 100;

     /**
     * A point that represents the scale of the texture object
     *
     * @member {Point}
     */
    this._tileScaleOffset = new core.math.Point(1,1);


    this._tilingTexture = null;
    this._refreshTexture = false;

    this._uvs = new TextureUvs();
}

TilingSprite.prototype = Object.create(core.Sprite.prototype);
TilingSprite.prototype.constructor = TilingSprite;
module.exports = TilingSprite;


Object.defineProperties(TilingSprite.prototype, {
    /**
     * The width of the sprite, setting this will actually modify the scale to achieve the value set
     *
     * @member {number}
     * @memberof TilingSprite#
     */
    width: {
        get: function ()
        {
            return this._width;
        },
        set: function (value)
        {
            this._width = value;
        }
    },

    /**
     * The height of the TilingSprite, setting this will actually modify the scale to achieve the value set
     *
     * @member {number}
     * @memberof TilingSprite#
     */
    height: {
        get: function ()
        {
            return this._height;
        },
        set: function (value)
        {
            this._height = value;
        }
    }
});

/**
 * When the texture is updated, this event will fire,
 *
 * @private
 */
TilingSprite.prototype._onTextureUpdate = function ()
{
    core.Sprite.prototype._onTextureUpdate.call(this);

    this._refreshTexture = true;
};

/**
 * Renders the object using the WebGL renderer
 *
 * @param renderer {WebGLRenderer}
 */
TilingSprite.prototype._renderWebGL = function (renderer)
{
    if (!this._tilingTexture || this._refreshTexture)
    {
        this.generate_TilingTexture(renderer, this.texture, true);
    }
    else
    {
        // tweak our texture temporarily..

        var texture = this._tilingTexture;


        var uvs = this._uvs;

        this.tilePosition.x %= texture.baseTexture.width * this._tileScaleOffset.x;
        this.tilePosition.y %= texture.baseTexture.height * this._tileScaleOffset.y;

        var offsetX =  this.tilePosition.x/(texture.baseTexture.width*this._tileScaleOffset.x);
        var offsetY =  this.tilePosition.y/(texture.baseTexture.height*this._tileScaleOffset.y);

        var scaleX =  (this._width / texture.baseTexture.width)  /// (this.tileScale.x * this._tileScaleOffset.x);
        var scaleY =  (this._height / texture.baseTexture.height) /// (this.tileScale.y * this._tileScaleOffset.y);


        uvs.x0 = 0 - offsetX;
        uvs.y0 = 0 - offsetY;

        uvs.x1 = (1 * scaleX) - offsetX;
        uvs.y1 = 0 - offsetY;

        uvs.x2 = (1 * scaleX) - offsetX;
        uvs.y2 = (1 * scaleY) - offsetY;

        uvs.x3 = 0 - offsetX;
        uvs.y3 = (1 * scaleY) - offsetY;

        var tempUvs = texture._uvs;
        var tempWidth = texture._frame.width;
        var tempHeight = texture._frame.height;

        texture._uvs = uvs;
        texture._frame.width = this.width;
        texture._frame.height = this.height;

        renderer.setObjectRenderer(renderer.plugins.sprite);
        renderer.plugins.sprite.render(this);

        texture._uvs = tempUvs;
        texture._frame.width = tempWidth;
        texture._frame.height = tempHeight;
    }

};

/**
 * Renders the object using the Canvas renderer
 *
 * @param renderer {CanvasRenderer}
 */
TilingSprite.prototype.renderCanvas = function (renderer)
{
    if (!this.visible || this.alpha <= 0)
    {
        return;
    }

    var context = renderer.context;

    if (this._mask)
    {
        renderer.maskManager.pushMask(this._mask, renderer);
    }

    context.globalAlpha = this.worldAlpha;

    var transform = this.worldTransform;

    var i,j;

    var resolution = renderer.resolution;

    context.setTransform(transform.a * resolution,
                         transform.b * resolution,
                         transform.c * resolution,
                         transform.d * resolution,
                         transform.tx * resolution,
                         transform.ty * resolution);

    if (!this.__tilePattern ||  this._refreshTexture)
    {
        this.generate_TilingTexture(false);

        if (this._tilingTexture)
        {
            this.__tilePattern = context.createPattern(this._tilingTexture.baseTexture.source, 'repeat');
        }
        else
        {
            return;
        }
    }

    // check blend mode
    if (this.blendMode !== renderer.currentBlendMode)
    {
        renderer.currentBlendMode = this.blendMode;
        context.globalCompositeOperation = renderer.blendModes[renderer.currentBlendMode];
    }

    var tilePosition = this.tilePosition;
    var tileScale = this.tileScale;

    tilePosition.x %= this._tilingTexture.baseTexture.width;
    tilePosition.y %= this._tilingTexture.baseTexture.height;

    // offset - make sure to account for the anchor point..
    context.scale(tileScale.x,tileScale.y);
    context.translate(tilePosition.x + (this.anchor.x * -this._width), tilePosition.y + (this.anchor.y * -this._height));

    context.fillStyle = this.__tilePattern;

    context.fillRect(-tilePosition.x,
                    -tilePosition.y,
                    this._width / tileScale.x,
                    this._height / tileScale.y);

    context.translate(-tilePosition.x + (this.anchor.x * this._width), -tilePosition.y + (this.anchor.y * this._height));
    context.scale(1 / tileScale.x, 1 / tileScale.y);

    if (this._mask)
    {
        renderer.maskManager.popMask(renderer);
    }

    for (i = 0, j = this.children.length; i < j; ++i)
    {
        this.children[i].renderCanvas(renderer);
    }
};


/**
 * Returns the framing rectangle of the sprite as a Rectangle object
*
 * @return {Rectangle} the framing rectangle
 */
TilingSprite.prototype.getBounds = function ()
{
    var width = this._width;
    var height = this._height;

    var w0 = width * (1-this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1-this.anchor.y);
    var h1 = height * -this.anchor.y;

    var worldTransform = this.worldTransform;

    var a = worldTransform.a;
    var b = worldTransform.b;
    var c = worldTransform.c;
    var d = worldTransform.d;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;

    var x1 = a * w1 + c * h1 + tx;
    var y1 = d * h1 + b * w1 + ty;

    var x2 = a * w0 + c * h1 + tx;
    var y2 = d * h1 + b * w0 + ty;

    var x3 = a * w0 + c * h0 + tx;
    var y3 = d * h0 + b * w0 + ty;

    var x4 =  a * w1 + c * h0 + tx;
    var y4 =  d * h0 + b * w1 + ty;

    var minX,
        maxX,
        minY,
        maxY;

    minX = x1;
    minX = x2 < minX ? x2 : minX;
    minX = x3 < minX ? x3 : minX;
    minX = x4 < minX ? x4 : minX;

    minY = y1;
    minY = y2 < minY ? y2 : minY;
    minY = y3 < minY ? y3 : minY;
    minY = y4 < minY ? y4 : minY;

    maxX = x1;
    maxX = x2 > maxX ? x2 : maxX;
    maxX = x3 > maxX ? x3 : maxX;
    maxX = x4 > maxX ? x4 : maxX;

    maxY = y1;
    maxY = y2 > maxY ? y2 : maxY;
    maxY = y3 > maxY ? y3 : maxY;
    maxY = y4 > maxY ? y4 : maxY;

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    this._currentBounds = bounds;

    return bounds;
};

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @param event
 * @private
 */
TilingSprite.prototype.onTextureUpdate = function ()
{
   // overriding the sprite version of this!
};

/**
 *
 * @param forcePowerOfTwo {boolean} Whether we want to force the texture to be a power of two
 */
TilingSprite.prototype.generate_TilingTexture = function (renderer, texture, forcePowerOfTwo)
{
    if (!this.texture.baseTexture.hasLoaded)
    {
        return;
    }
/*

    var cachedRenderTarget = renderer.currentRenderTarget;

    var renderTexture = new core.RenderTexture(renderer, texture.width, texture.height);

    renderTexture.render();

    renderer.setRenderTarget( cachedRenderTarget );

    return;
*/
    var texture = this.originalTexture || this.texture;
    var frame = texture.frame;
    var targetWidth, targetHeight;

    //  Check that the frame is the same size as the base texture.
    var isFrame = frame.width !== texture.baseTexture.width || frame.height !== texture.baseTexture.height;

    var newTextureRequired =  false;

    if (!forcePowerOfTwo && !texture.baseTexture.isPowerOfTwo)
    {
        if (isFrame)
        {
        //    targetWidth = frame.width;
          ///  targetHeight = frame.height;

            newTextureRequired = true;
        }

        targetWidth = core.utils.getNextPowerOfTwo(frame.width);
        targetHeight = core.utils.getNextPowerOfTwo(frame.height);
    }

    if (newTextureRequired)
    {
        var canvasBuffer;

        if (this._tilingTexture && this._tilingTexture.isTiling)
        {
            canvasBuffer = this._tilingTexture.canvasBuffer;
            canvasBuffer.resize(targetWidth, targetHeight);
            this._tilingTexture.baseTexture.width = targetWidth;
            this._tilingTexture.baseTexture.height = targetHeight;
            this._tilingTexture.update();
        }
        else
        {
            canvasBuffer = new core.CanvasBuffer(targetWidth, targetHeight);

            this._tilingTexture = core.Texture.fromCanvas(canvasBuffer.canvas);
            this._tilingTexture.canvasBuffer = canvasBuffer;
            this._tilingTexture.isTiling = true;
        }

        canvasBuffer.context.drawImage(texture.baseTexture.source,
                               texture.crop.x,
                               texture.crop.y,
                               texture.crop.width,
                               texture.crop.height,
                               0,
                               0,
                               targetWidth,
                               targetHeight);

        this._tileScaleOffset.x = frame.width / targetWidth;
        this._tileScaleOffset.y = frame.height / targetHeight;
    }
    else
    {
     //   console.log("SAS")
        //  TODO - switching?
        if (this._tilingTexture && this._tilingTexture.isTiling)
        {
            // destroy the tiling texture!
            // TODO could store this somewhere?
            this._tilingTexture.destroy(true);
        }

        this._tileScaleOffset.x = 1;
        this._tileScaleOffset.y = 1;
        this._tilingTexture = texture;
    }

    this._refreshTexture = false;

    this.originalTexture = this.texture;
    this.texture = this._tilingTexture;

};

TilingSprite.prototype.destroy = function () {
    core.Sprite.prototype.destroy.call(this);

    this.tileScale = null;
    this._tileScaleOffset = null;
    this.tilePosition = null;

    this._tilingTexture.destroy(true);
    this._tilingTexture = null;

    this._uvs = null;
};
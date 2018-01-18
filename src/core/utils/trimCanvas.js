/**
 * Trim transparent borders from a canvas
 *
 * @memberof PIXI
 * @function trimCanvas
 * @private
 * @param {HTMLCanvasElement} canvas - the canvas to trim
 * @returns {object} Trim data
 */
export default function trimCanvas(canvas)
{
    // https://gist.github.com/remy/784508

    let width = canvas.width;
    let height = canvas.height;

    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    const len = pixels.length;

    const bound = {
        top: null,
        left: null,
        right: null,
        bottom: null,
    };
    let i;
    let x;
    let y;

    // 每4个值代表一个像素，如果是1000*1000的舞台，则有4000000个像素点需要遍历
    for (i = 0; i < len; i += 4)
    {
        // 像素点不是透明像素，计算非透明像素形成的区域
        if (pixels[i + 3] !== 0)
        {
            x = (i / 4) % width;// 列
            y = ~~((i / 4) / width);// 行

            if (bound.top === null)
            {
                bound.top = y;
            }

            if (bound.left === null)
            {
                bound.left = x;
            }
            else if (x < bound.left)
            {
                bound.left = x;
            }

            if (bound.right === null)
            {
                bound.right = x + 1;
            }
            else if (bound.right < x)
            {
                bound.right = x + 1;
            }

            if (bound.bottom === null)
            {
                bound.bottom = y;
            }
            else if (bound.bottom < y)
            {
                bound.bottom = y;
            }
        }
    }

    width = bound.right - bound.left;
    height = bound.bottom - bound.top + 1;

    const data = context.getImageData(bound.left, bound.top, width, height);

    return {
        height,
        width,
        data,
    };
}

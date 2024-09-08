import {PixelArray} from "eric-pixelarrayutils/PixelArray";
import { RandomWrapper } from "eric-random-wrapper";



/**
 * Stamps a

 * @param {PixelArray} bottomArray - serves as the base or background.
 * @param {PixelArray} topArray - will be blended over the bottomArray.
 * @param {number} [xPos=0] - The x-position where the topArray starts relative to the bottomArray.
 * @param {number} [yPos=0] - The y-position where the topArray starts relative to the bottomArray.
 */
/*
export function stampMutateBad(bottomArray, topArray, xPos = 0, yPos = 0) {
    const blendedArrayData = new Uint8ClampedArray(bottomArray.array);
    //const blendedArray = new PixelArray(blendedArrayData, bottomArray.width, bottomArray.height);

    for (let x = 0; x < topArray.width; x += 1) {
        for (let y = 0; y < topArray.height; y += 1) {
            const bottomX = x + xPos;
            const bottomY = y + yPos;

            // Check bounds to ensure we're within the blendedArray
            if (bottomX >= 0 && bottomX < blendedArray.width && bottomY >= 0 && bottomY < blendedArray.height) {
                const [topR, topG, topB, topA] = topArray.getColorValue(x, y);
                const [bottomR, bottomG, bottomB, bottomA] = blendedArray.getColorValue(bottomX, bottomY);

                const alphaBlend = topA / 255;
                const inverseAlpha = 1 - alphaBlend;

                // Blend colors based on the top pixel's alpha
                const blendedR = topR * alphaBlend + bottomR * inverseAlpha;
                const blendedG = topG * alphaBlend + bottomG * inverseAlpha;
                const blendedB = topB * alphaBlend + bottomB * inverseAlpha;
                const blendedA = Math.min(255, topA + bottomA); // ensure alpha doesn't exceed 255

                blendedArray.setColorValue(bottomX, bottomY, [blendedR, blendedG, blendedB, blendedA]);
            }
        }
    }
    return blendedArray;
}
*/

/**
 * 
 * @param {number} bias 
 * @param {Array<Number>} seedNumbers
 * @param {PixelArray.PixelArray} pixelArray 
 * @param {Array<Number>} fillColor 
 * @param {*} mask 
 * @param {testFunc}
 * @returns {PixelArray}
 */
export function TotallyRandomFunc(pixelArray, bias, seedNumbers, fillColor = null, mask=null, testFunc=null){
    //TODO implement mask
    let resultArray = new PixelArray.PixelArray(null, pixelArray.width, pixelArray.width);
    const actualSeed = seedNumbers[0] + (seedNumbers[1] + seedNumbers[2])*seedNumbers[3];
    const randomObj = new RandomWrapper(actualSeed);

    if (fillColor === null){
        fillColor = [0, 0, 0, 255];
    }

    console.log(bias);
    //console.log("Totally Random!");
    //console.log(pixelArray.array);

    let curPixel = null;
    for(let i = 0; i < pixelArray.width; i += 1){
        for(let j = 0; j < pixelArray.height; j += 1){

            curPixel = pixelArray.getColorValue(i, j);
            
            if (randomObj.random(0, 1) < bias){
                if( curPixel[3] > 200  ){
                    //console.log("(i, j) = " + i)
                    resultArray.setColorValue(i, j, fillColor);
                }
            }
            /*
            if(randomObj.random(0, 1) < bias ){
                //console.log("(i, j) = " + i)
                resultArray.setColorValue(i, j, fillColor);
            }*/
            else{
                resultArray.setColorValue(i, j, [1, 1, 1, 1]);
            }
        }
    }

    return resultArray;
}

/**
 * Blends two colors using the "over" blend mode.
 * 
 * @param {Array<number>} bottom - Bottom color in the format [r, g, b, a].
 * @param {Array<number>} top - Top color in the format [r, g, b, a].
 * @returns {Array<number>} Resultant blended color.
 */
function overBlend(bottom, top) {
    const alphaTop = top[3] / 255;
    const alphaBottom = bottom[3] * (1 - alphaTop) / 255;

    const resultantAlpha = alphaTop + alphaBottom;
    if (resultantAlpha === 0) return [0, 0, 0, 0];

    return [
        (top[0] * alphaTop + bottom[0] * alphaBottom) / resultantAlpha,
        (top[1] * alphaTop + bottom[1] * alphaBottom) / resultantAlpha,
        (top[2] * alphaTop + bottom[2] * alphaBottom) / resultantAlpha,
        resultantAlpha * 255
    ];
}

/**
 * Stamps the stampTop pixel array onto pixels in the bottom pixel array 
 * with an alpha value over 200.
 * 
 * @param {PixelArray} bottom - The pixel array to be stamped onto.
 * @param {Array<PixelArray>} arrayOfStamps - Array of PixelArrays for stamping.
 * @param {string} [blendMode='over'] - The blending mode. Default is 'over'.
 * @param {Function} func - Func that tests the bottomPArray
 * @param {Number} seed - Seed for the RandomWrapper object
 */
export function stampMutate(bottom, arrayOfStamps, blendMode = 'over', func=null, seed=null) {
    if (!func){
        func = (color) => { return color[3] > 200 };
    }

    const randObj = new RandomWrapper(seed);

    for (let y = 0; y < bottom.height; y+=1) {
        for (let x = 0; x < bottom.width; x+=1) {
            const bottomColor = bottom.getColorValue(x, y);

            // Check alpha value
            if (func(bottomColor)) {
                const stampTop = randObj.choice(arrayOfStamps);
                const stampWidthHalf = Math.floor(stampTop.width / 2);
                const stampHeightHalf = Math.floor(stampTop.height / 2);

                for (let sy = 0; sy < stampTop.height; sy+=1) {
                    for (let sx = 0; sx < stampTop.width; sx+=1) {
                        const dx = x - stampWidthHalf + sx;
                        const dy = y - stampHeightHalf + sy;

                        // Check if the pixel lies within the boundaries of the bottom pixel array
                        if (dx >= 0 && dx < bottom.width && dy >= 0 && dy < bottom.height) {
                            const topColor = stampTop.getColorValue(sx, sy);

                            let resultantColor;
                            switch (blendMode) {
                                case 'over':
                                    resultantColor = overBlend(bottomColor, topColor);
                                    break;
                                default:
                                    resultantColor = topColor;
                            }

                            bottom.setColorValue(dx, dy, resultantColor);
                        }
                    }
                }
            }
        }
    }
}

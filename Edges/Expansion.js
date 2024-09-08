import { PixelArray } from "eric-pixelarrayutils/PixelArray";
import Kernel from './Kernel';

/**
 * Creates a mask from a given pixel array. If the `solid` parameter is true, any non-transparent pixel in the 
 * original pixel array is replaced with the specified color. If `solid` is false, only the alpha value 
 * of the original pixel is used, and the RGB values are replaced with the specified color.
 * 
 * @param {PixelArray} pixelArray - The source pixel array from which the mask is generated.
 * @param {Array<number>} [color=[255, 255, 255, 255]] - The color to use for the mask. Default is solid white.
 * @param {boolean} [solid=true] - Determines the behavior of the mask generation. If true, any non-transparent 
 *                                 pixel in the original array is replaced with the given color. If false, 
 *                                 the alpha value of the original pixel is preserved.
 * @returns {PixelArray} - A new pixel array that represents the generated mask.
 */
export function MaskFromPixelArray(pixelArray, color=[255, 255, 255, 255], solid=true) {
    const newPixelArray = new PixelArray(null, pixelArray.width, pixelArray.height);
    for(let i = 0; i < pixelArray.width; i += 1) {
        for(let j = 0; j < pixelArray.height; j += 1) {  // NOTE: There was a typo in "j =+ 1". It should be "j += 1".
            const curColor = pixelArray.getColorValue(i, j);
            if (solid) {
                if (curColor[3] > 0) {
                    newPixelArray.setColorValue(color);
                }
            } else {
                const newColor = [...color];
                newColor[3] = curColor[3];
                newPixelArray.setColorValue(newColor);
            }
        }
    }

    return newPixelArray;
}

/**
 * @param {PixelArray} pixelArray
 */
export function ExpandMutate(pixelArray, kernel=null){
    if (!kernel){
        kernel = new Kernel();
    }
}

/**
 * @param {PixelArray} pixelArray
 */
export function ExpandRing(pixelArray, kernel=null){
    if (!kernel){
        kernel = new Kernel();
    }
}

/**
 * @param {PixelArray} pixelArray
 * @returns {PixelArray} - a new PixelArray
 */
export function Expand(pixelArray, kernel=null, color=null){
    //
}


import * as PixelUtils from "./PixelUtils.js";
//import * as Kernel from "./Kernel.js";
//import { PixelArray } from "./PixelArray.js";



//assume white
//export function InvertAlphaWhite

//assume black
/**
 * 
 * @param {PixelArray} pixelArray 
 * @returns {PixelArray}
 */
export function InvertAlpha(pixelArray) {
    var width = pixelArray.width;
    var height = pixelArray.height;

    var array = pixelArray.array;

    var newArray = new Uint8ClampedArray(width*height*4);
    let color = null;
    for(let i = 0; i < width; i += 1){
        for(let j = 0; j < height; j += 1){
            color = PixelUtils.getColorValue(i, j, width, array);
            
            color[3] = 255-color[3];

            PixelUtils.setColorValue(i, j, width, newArray, color);
        }
    }
    return new PixelArray(newArray, width, height);
}


/**
 * Inverts pixels based on their alpha value. Pixels with alpha value above a threshold 
 * will be set to a transparent color. All other pixels will be set to a specified color.
 * 
 * @param {PixelArray} pixelArray - The source pixel array.
 * @param {number} [alphaMin=254] - Minimum alpha value to consider for inversion.
 * @param {Array<number>} [newColor=null] - Color to set for pixels below the alpha threshold.
 * @param {number} [blackOrWhite=0] - Indicates whether to use black (0) or white (1) if newColor is not specified.
 * @returns {PixelArray} - A new pixel array with pixels inverted based on alpha values.
 */
export function InvertFromAlpha(pixelArray, alphaMin = 254, newColor=null, blackOrWhite=0){
    var width = pixelArray.width;
    var height = pixelArray.height;

    var array = pixelArray.array;

    var newArray = new Uint8ClampedArray(width*height*4);

    
    let solidPixel = null;
    if (newColor !== null){
        solidPixel = newColor;
    }
    else{
        if (blackOrWhite === 1){
            solidPixel = [255, 255, 255, 255];
        }
        else {
            solidPixel = [0, 0, 0, 255];
        }
    }

    let color = null;
    let emptyColor = [0, 0, 0, 0];
    for(let i = 0; i < width; i += 1){
        for(let j = 0; j < height; j += 1){
            color = PixelUtils.getColorValue(i, j, width, array);
            if (color[3] >= alphaMin){
                PixelUtils.setColorValue(i, j, width, newArray, emptyColor);
            }
            else{
                PixelUtils.setColorValue(i, j, width, newArray, solidPixel);
            }
        }
    }
    return new PixelArray(newArray, width, height);
}


/**
 * Expands the details of a pixel array based on a given detail map.
 * 
 * @param {PixelArray} pixelArray - The source pixel array.
 * @param {PixelArray} detailArray - The detail map used for expansion.
 * @param {Kernel} [kernel=null] - Optional kernel for convolution operations.
 * @param {number} [iters=2] - Number of iterations to perform expansion.
 * @param {number} [blackOrWhite=1] - Indicates whether to use black (0) or white (1) for the expanded areas.
 * @returns {PixelArray} - A new pixel array with details expanded.
 */
 export function ExpandByDetailMap(pixelArray, detailArray, kernel=null, iters=2, blackOrWhite=1){
    var curArray = pixelArray;
    var tempArray = null;
    const width = pixelArray.width;
    for(let i = 0; i < iters; i += 1){
        tempArray = ExpandByDetailSingleIter(curArray, detailArray, null, blackOrWhite);
        curArray = new PixelArray(tempArray, width);
    }

    return curArray;
}

/**
 * Expands the details of a pixel array for a single iteration based on a detail map.
 * 
 * @param {PixelArray} pixelArray - The source pixel array.
 * @param {PixelArray} detailArray - The detail map used for expansion.
 * @param {Kernel} [kernel=null] - Optional kernel for convolution operations.
 * @param {Uint8ClampedArray} [newArray=null] - An optional new array to hold the result.
 * @param {number} [blackOrWhite=0] - Indicates whether to use black (0) or white (1) for the expanded areas.
 * @param {number} [alphaMin=254] - Minimum alpha value to consider for expansion.
 * @param {Array<number>} [newColor=null] - Color to set for expanded pixels.
 * @returns {Uint8ClampedArray} - An array with expanded details.
 */
export function ExpandByDetailSingleIter(pixelArray, detailArray, kernel=null, newArray=null, blackOrWhite = 0, alphaMin = 254, newColor=null){
    var width = pixelArray.width;
    var height = pixelArray.height;
    var array = pixelArray.array;

    if (newArray === null){
        var width = pixelArray.width;
        var height = pixelArray.height;
        newArray = new Uint8ClampedArray(width*height*4);
    }
    
    const kernelOffsets = new Kernel.Kernel(-1, 1, -1, 1);
    console.log(kernelOffsets.width);
    console.log(kernelOffsets.xLeft);

    let solidPixel = null;
    if (newColor !== null){
        solidPixel = newColor;
    }
    else{
        if (blackOrWhite === 1){
            solidPixel = [255, 255, 255, 255];
        }
        else {
            solidPixel = [0, 0, 0, 255];
        }
    }

    var curRGB = null;
    for(var i = 0; i < width; i += 1){
        console.log("i = " + i.toString());
        for(var j = 0; j < height; j += 1){
            var curX = null;
            var curY = null;

            if (PixelUtils.getColorValue(i, j, width, pixelArray.array)[3] < alphaMin){
                continue;
            }

            for(var a = kernelOffsets.xLeft; a < kernelOffsets.xRight; a += 1 ){
                curX = i + a;

                if ( curX >= width || curX < 0 ){
                    continue;
                }

                for(var b = kernelOffsets.yDown; b < kernelOffsets.yUp; b += 1){
                    curY = j + b;
                    if  (curY >= height || curY < 0 ){
                        continue;
                    }
                    
                    if (a === 0 || b === 0){
                        curRGB = PixelUtils.getColorValue(curX, curY, width, pixelArray.array);
                    }
                    else{
                        curRGB = PixelUtils.getColorValue(curX, curY, width, detailArray.array);
                    }
                    
                    if (curRGB[3] >= alphaMin){
                        //console.log("i = " + i.toString() + " j = " + j.toString());
                        PixelUtils.setColorValue(curX, curY, width, newArray, solidPixel);
                    }
                }
            }
        }
    }
    return newArray;
}
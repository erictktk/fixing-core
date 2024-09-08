import { PixelArray } from "eric-pixelarrayutils/PixelArray";
import * as PixelUtils from "eric-pixelarrayutils/PixelUtils";
import Kernel from './Kernel';
import { RandomWrapper } from "eric-random-wrapper";

/**
 * Shrinks the edge of pixels in the given pixelArray based on the alpha value of neighboring pixels.
 * If a neighboring pixel's alpha value is greater than or equal to alphaMin, 
 * the current pixel's value is set to an empty (transparent) pixel.
 * 
 * @param {PixelArray} pixelArray - The pixel array object containing width, height, and array properties.
 * @param {Kernel|null} [kernelOffsets=null] - The offsets to define which neighboring pixels to consider.
 * @param {number} [alphaMin=0] - The minimum alpha value to consider for shrinking the edge.
 * @returns {Uint8ClampedArray} - The modified pixel array.
 */
export function ShrinkEdge(pixelArray, kernelOffsets=null, alphaMin = 0){
    const [width, height, array] = [pixelArray.width, pixelArray.height, pixelArray.array];

    if (kernelOffsets === null){
        kernelOffsets = new Kernel.Kernel(-1, 1, -1, 1);
    }

    const newArray = new Uint8ClampedArray(pixelArray.array);

    let curRGB = null;
    let emptyPixel = [0, 0, 0, 0];
    for(let i = 0; i < width; i += 1){
        for(let j = 0; j < height; j += 1){
            let curX = null;
            let curY = null;
            for(let a = kernelOffsets.xLeft; a < kernelOffsets.width; a += 1 ){
                curX = i + a;

                if ( curX >= width || curX < 0 ){
                    continue;
                }

                for(let b = kernelOffsets.yDown; b < kernelOffsets.height; b += 1){
                    curY = j + b;
                    if  (curY >= height || curY < 0 ){
                        continue;
                    }
                    
                    curRGB = PixelUtils.getColorValue(curX, curY, width, array);
                    
                    if (curRGB[3] >= alphaMin){
                        PixelUtils.setColorValue(curX, curY, width, newArray, emptyPixel);
                    }
                }
            }
        }
    }
    return newArray;
}


/**
 * Highlights the edges of pixels in the given pixelArray based on the alpha value of neighboring pixels.
 * If a neighboring pixel's alpha value is greater than or equal to alphaMin, 
 * the current pixel's value is set to a solid white pixel.
 * 
 * @param {PixelArray} pixelArray - The pixel array object containing width, height, and array properties.
 * @param {Object|null} [kernelOffsets=null] - The offsets to define which neighboring pixels to consider.
 * @param {number} [alphaMin=0] - The minimum alpha value to consider for highlighting the edge.
 * @returns {Uint8ClampedArray} - The new pixel array highlighting the edges.
 */
export function GetEdgeArray(pixelArray, kernelOffsets=null, alphaMin = 0){
    const [width, height, array] = [pixelArray.width, pixelArray.height, pixelArray.array];

    const newArray = new Uint8ClampedArray(pixelArray.array.length);

    if (kernelOffsets === null){
        kernelOffsets = new Kernel.Kernel(-1, 1, -1, 1);
    }

    let curRGB = null;
    let solidPixel = [1, 1, 1, 1];
    for(let i = 0; i < width; i += 1){
        for(let j = 0; j < height; j += 1){
            let [curX, curY] = [null, null];
            for(let a = kernelOffsets.xLeft; a < kernelOffsets.width; a += 1 ){
                curX = i + a;

                if ( curX >= width || curX < 0 ){
                    continue;
                }

                for(let b = kernelOffsets.yDown; b < kernelOffsets.height; b += 1){
                    curY = j + b;  // Fixed error here
                    if  (curY >= height || curY < 0 ){
                        continue;
                    }
                    
                    curRGB = PixelUtils.getColorValue(curX, curY, width, array);
                    
                    if (curRGB[3] >= alphaMin){
                        PixelUtils.setColorValue(curX, curY, width, newArray, solidPixel);
                    }
                }
            }
        }
    }
    return newArray;
}



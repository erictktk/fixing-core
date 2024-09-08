import { PixelArray } from "eric-pixelarrayutils/PixelArray";
import * as PixelUtils from "eric-pixelarrayutils/PixelUtils";
import Kernel from "./Kernel";

//export function TestIfLowerEdge(pixelArray)

/**
 * Highlights the edges of pixels in the given pixelArray based on the alpha value of neighboring pixels.
 * If a neighboring pixel's alpha value is greater than or equal to alphaMin, 
 * the current pixel's value is set to a solid white pixel.
 * 
 * @param {PixelArray} pixelArray - The pixel array object containing width, height, and array properties.
 * @param {Kernel|null} [kernel=null] - The offsets to define which neighboring pixels to consider.
 * @param {number} [alphaMin=0] - The minimum alpha value to consider for highlighting the edge.
 * @returns {Uint8ClampedArray} - The new pixel array highlighting the edges.
 */
export function DetectColorEdges(pixelArray, kernel=null, randomOrder=false, minAlpha=200){
    const toTest = [];
    for(let i = 0; i < pixelArray.width; i += 1){
        const curRow = [];
        for(let j = 0; j < pixelArray.height; j += 1){
            curRow.push(true);

            //toTest.push(true);
        }
        toTest.push(curRow);

        //toTest.push()
    }

    if (!kernel){
        kernel = new Kernel(-1, 1, -1, 1);
    }

    const pixelsDone = [];

    for(let i = 0; i < pixelArray.width; i += 1){
        for(let j = 0; j < pixelArray.height; j += 1){
            //kernel.getColorBool
        }
    }
}

/**
 * Detects edges between different colors in a pixel array.
 * 
 * @param {PixelArray} pixelArray - The input pixel array.
 * @param {Kernel|null} kernel - The kernel used for edge detection.
 * @returns {PixelArray} - A new pixel array with edges highlighted.
 */
export function detectEdges(pixelArray, kernel, fillColor=[255, 255, 255, 255], checkSingle = true) {
    const edgeArray = new PixelArray(null, pixelArray.width, pixelArray.height);
    const [width, height] = [pixelArray.width, pixelArray.height];

    if (!kernel){
        kernel = new Kernel();
    }

    for (let i = 0; i < pixelArray.width; i += 1) {
        for (let j = 0; j < pixelArray.height; j += 1) {
            const currentPixel = PixelUtils.getColorValue(i, j, pixelArray.width, pixelArray.array);
            if (currentPixel[3] === 0) continue;

            for (const [xOffset, yOffset] of kernel.offsets) {
                // Check only right and bottom neighbors
                if (checkSingle){
                    if (xOffset < 0 || yOffset < 0) continue;
                 }

                const [curX, curY] = [i + xOffset, j + yOffset]

                if (curX < 0 || curX >= width || curY < 0 || curY >= height) continue;

                const neighborPixel = pixelArray.getColorValue(curX, curY);
                if (neighborPixel[3] > 0 && !arraysAreEqual(currentPixel, neighborPixel)) {
                    edgeArray.setColorValue(i, j, fillColor);
                    break;
                }
            }
        }
    }

    return edgeArray;
}

/**
 * Detects and returns an array of inner edges, fill color is white
 * 
 * @param {PixelArray} pixelArray - The input pixel array.
 * @param {Kernel|null} kernel - The kernel used for edge detection.
 * @param {Number} alphaMax - Inclusive alpha value to test
 * @returns {PixelArray} - A new pixel array with edges highlighted.
 */
export function detectAlphaEdges(pixelArray, kernel, fillColor=[255, 255, 255, 255], alphaMax=0) {
    const edgeArray = new PixelArray(null, pixelArray.width, pixelArray.height);
    const [width, height] = [pixelArray.width, pixelArray.height];

    if (!kernel){
        kernel = new Kernel();
    }

    for (let i = 0; i < pixelArray.width; i += 1) {
        for (let j = 0; j < pixelArray.height; j += 1) {
            const currentPixel = PixelUtils.getColorValue(i, j, pixelArray.width, pixelArray.array);
            if (currentPixel[3] === 0) continue;

            for (const [xOffset, yOffset] of kernel.offsets) {

                const [curX, curY] = [i + xOffset, j + yOffset]

                if (curX < 0 || curX >= width || curY < 0 || curY >= height) continue;

                const neighborPixel = pixelArray.getColorValue(curX, curY);
                if (neighborPixel[3] <= alphaMax) {
                    edgeArray.setColorValue(i, j, fillColor);
                    break;
                }
            }
        }
    }

    return edgeArray;
}

/**
 * Detects and returns a ring - tests only alpha = 0 and will return true if kernel has alpha 255
 * 
 * @param {PixelArray} pixelArray - The input pixel array.
 * @param {Kernel} kernel - The kernel used for edge detection.
 * @param {Number} alphaMax - Inclusive alpha value to test
 * @returns {PixelArray} - A new pixel array with edges highlighted.
 */
export function detectOuterEdges(pixelArray, kernel=null, fillColor=[255, 255, 255, 255], alphaMin=0, alphaMax=255) {
    const edgeArray = new PixelArray(null, pixelArray.width, pixelArray.height);
    const [width, height] = [pixelArray.width, pixelArray.height];

    if (!kernel){
        kernel = new Kernel();
    }

    for (let i = 0; i < pixelArray.width; i += 1) {
        for (let j = 0; j < pixelArray.height; j += 1) {
            const currentPixel = PixelUtils.getColorValue(i, j, pixelArray.width, pixelArray.array);
            if (currentPixel[3] < alphaMin) continue;

            for (const [xOffset, yOffset] of kernel.offsets) {

                const [curX, curY] = [i + xOffset, j + yOffset]

                if (curX < 0 || curX >= width || curY < 0 || curY >= height) continue;

                const neighborPixel = pixelArray.getColorValue(curX, curY);
                if (neighborPixel[3] >= alphaMax) {
                    edgeArray.setColorValue(i, j, fillColor);
                    break;
                }
            }
        }
    }

    return edgeArray;
}


/**
 * 
 * @param {PixelArray} pixelArray 
 * @param {Kernel|null} kernel 
 * @param {Function|null} predicate 
 * @returns {PixelArray}
 */
export function detectEdgesGrayscale(pixelArray, kernel, predicate=blankPredicate) {
    const resultArray = new PixelArray(null, pixelArray.width, pixelArray.height);
    const [width, height] = [pixelArray.width, pixelArray.height];

    if (!kernel) {
        kernel = new Kernel();
    }

    const maxDistance = kernel.getMaxDistance();

    for (let i = 0; i < width; i += 1) {
        for (let j = 0; j < height; j += 1) {
            let minDistance = 1000000;

            for (const [xOffset, yOffset] of kernel.offsets) {
                const [curX, curY] = [i + xOffset, j + yOffset];

                if (curX < 0 || curX >= width || curY < 0 || curY >= height) continue;

                const neighborPixel = pixelArray.getColorValue(curX, curY);
                if (predicate(neighborPixel)) {
                    const distance = Math.sqrt(xOffset * xOffset + yOffset * yOffset);
                    minDistance = Math.min(minDistance, distance);
                }
            }

            // Convert distance to a grayscale value (assuming max kernel distance won't exceed 255)
            const grayValue = Math.round(minDistance/maxDistance*255);
            resultArray.setColorValue(i, j, [grayValue, grayValue, grayValue, 255]);
        }
    }

    return resultArray;
}

// Example Predicate Function
// This function could be any condition you want to test on the pixels
function examplePredicate(pixel) {
    // Example: Check if the pixel is not transparent
    return pixel[3] > 0;
}

function blankPredicate(pixel){
    return pixel[3] < 20;
 }

 /**
 * Compares two arrays for equality.
 * 
 * @param {Array} a - The first array.
 * @param {Array} b - The second array.
 * @returns {boolean} - Returns true if arrays are equal, false otherwise.
 */
function arraysAreEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

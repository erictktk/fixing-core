import { PixelArray } from "eric-pixelarrayutils/PixelArray";

/**
 * Mutates a given pixelArray by drawing a horizontal line at a specified y-coordinate.
 * 
 * @param {PixelArray} pixelArray - The PixelArray object to be mutated.
 * @param {number} yValue - The y-coordinate at which the line will be drawn.
 * @param {number[]} fillColor - An array representing the RGBA color value. Default is black.
 */
export function LineAtYMutate(pixelArray, yValue, fillColor=[0, 0, 0, 255]){
    for(let i = 0; i < pixelArray.width; i += 1){
        pixelArray.setColorValue(i, yValue, fillColor);
    }
}

/**
 * Creates a new PixelArray and draws a horizontal line at a specified y-coordinate.
 *
 * @param {number[]} size - An array representing the width and height of the PixelArray. Default is [32, 32].
 * @param {number} yValue - The y-coordinate at which the line will be drawn.
 * @param {number[]} fillColor - An array representing the RGBA color value. Default is black.
 * @returns {PixelArray} A new PixelArray with the drawn line.
 */
export function LineAtY(size=[32, 32], yValue, fillColor=[0, 0, 0, 255]){
    const pixelArray = new PixelArray(null, size[0], size[1]);

    LineAtYMutate(pixelArray, yValue, fillColor);
    return pixelArray;
}

/**
 * Mutates a given pixelArray by drawing a vertical line at a specified x-coordinate.
 * 
 * @param {PixelArray} pixelArray - The PixelArray object to be mutated.
 * @param {number} xValue - The x-coordinate at which the line will be drawn.
 * @param {number[]} fillColor - An array representing the RGBA color value. Default is black.
 */
export function LineAtXMutate(pixelArray, xValue, fillColor=[0, 0, 0, 255]){
    for(let i = 0; i < pixelArray.height; i += 1){
        pixelArray.setColorValue(xValue, i, fillColor);
    }
}

/**
 * Creates a new PixelArray and draws a vertical line at a specified x-coordinate.
 *
 * @param {number[]} size - An array representing the width and height of the PixelArray. Default is [32, 32].
 * @param {number} xValue - The x-coordinate at which the line will be drawn.
 * @param {number[]} fillColor - An array representing the RGBA color value. Default is black.
 * @returns {PixelArray} A new PixelArray with the drawn line.
 */
export function LineAtX(size=[32, 32], xValue, fillColor=[0, 0, 0, 255]){
    const pixelArray = new PixelArray(null, size[0], size[1]);

    LineAtYMutate(pixelArray, xValue, fillColor);
    return pixelArray;
}

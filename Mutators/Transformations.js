import { PixelArray } from "./PixelArray.js";

/**
 * Flips the PixelArray along the X-axis.
 * @param {PixelArray} pixelArray - The input PixelArray.
 * @returns {PixelArray} - The flipped PixelArray.
 */
export function flipX(pixelArray) {
    const newPixelArray = new PixelArray(pixelArray.width, pixelArray.height);
    for(let y = 0; y < pixelArray.height; y++) {
        for(let x = 0; x < pixelArray.width; x++) {
            const colorValue = pixelArray.getColorValue(x, y);
            newPixelArray.setColorValue(pixelArray.width - 1 - x, y, colorValue);
        }
    }
    return newPixelArray;
}

/**
 * Flips the PixelArray along the Y-axis.
 * @param {PixelArray} pixelArray - The input PixelArray.
 * @returns {PixelArray} - The flipped PixelArray.
 */
export function flipY(pixelArray) {
    const newPixelArray = new PixelArray(pixelArray.width, pixelArray.height);
    for(let y = 0; y < pixelArray.height; y++) {
        for(let x = 0; x < pixelArray.width; x++) {
            const colorValue = pixelArray.getColorValue(x, y);
            newPixelArray.setColorValue(x, pixelArray.height - 1 - y, colorValue);
        }
    }
    return newPixelArray;
}

/**
 * Rotates the PixelArray by 90 degrees.
 * @param {PixelArray} pixelArray - The input PixelArray.
 * @returns {PixelArray} - The rotated PixelArray.
 */
export function rotate90(pixelArray) {
    const newPixelArray = new PixelArray(pixelArray.height, pixelArray.width);
    for(let y = 0; y < pixelArray.height; y++) {
        for(let x = 0; x < pixelArray.width; x++) {
            const colorValue = pixelArray.getColorValue(x, y);
            newPixelArray.setColorValue(y, pixelArray.width - 1 - x, colorValue);
        }
    }
    return newPixelArray;
}

/**
 * Rotates the PixelArray by 180 degrees.
 * @param {PixelArray} pixelArray - The input PixelArray.
 * @returns {PixelArray} - The rotated PixelArray.
 */
export function rotate180(pixelArray) {
    return flipY(flipX(pixelArray)); // Use previous methods to rotate by 180
}

/**
 * Rotates the PixelArray by 270 degrees.
 * @param {PixelArray} pixelArray - The input PixelArray.
 * @returns {PixelArray} - The rotated PixelArray.
 */
export function rotate270(pixelArray) {
    return rotate90(rotate180(pixelArray)); // Use previous methods to rotate by 270
}

/**
 * Rotates the PixelArray by an arbitrary amount of degrees.
 * Note: This is a simple implementation and may not handle edge cases or give high-quality results for all angles.
 * @param {PixelArray} pixelArray - The input PixelArray.
 * @param {number} degrees - Degrees of rotation.
 * @returns {PixelArray} - The rotated PixelArray.
 */
export function rotateArbitrary(pixelArray, degrees) {
    // This is a placeholder, actual rotation by arbitrary degrees can be complex.
    // You would ideally use algorithms like bilinear or bicubic interpolation to get smoother results.
    console.warn("rotateArbitrary is a placeholder and may not give accurate results");
    return pixelArray; 
}

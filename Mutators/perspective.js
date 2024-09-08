import { PixelArray } from "eric-pixelarrayutils/PixelArray";
import * as PixelUtils from "eric-pixelarrayutils/PixelUtils";

/**
 * Compresses the pixel array vertically by skipping rows.
 * The skip probability is interpolated between the start and end values 
 * as you move from the top to the bottom of the image.
 *
 * @param {PixelArray}} pixelArray - The original pixel array.
 * @param {number} [initialSkipProbability=0] - The starting probability to skip a row at the top.
 * @param {number} [endingSkipProbability=0.7] - The ending probability to skip a row at the bottom.
 * @returns {Object} - The compressed pixel array.
 */
function compressPixelArray(pixelArray, initialSkipProbability = 0, endingSkipProbability = 0.7) {
    const width = pixelArray.width;
    const height = pixelArray.height;

    // Create a new pixel array of the same size.
    const newPixelArray = new PixelArray(null, width, height);

    let newRow = 0;
    for (let oldRow = 0; oldRow < height; oldRow+=1) {
        // Calculate the interpolated skip probability based on the row's position.
        const lerp = (1 - oldRow / height) * initialSkipProbability + (oldRow / height) * endingSkipProbability;

        // If a random value is greater than the skip probability, copy the row.
        if (Math.random() > lerp) {
            for (let col = 0; col < width; col+=1) {
                const pixel = PixelUtils.getColorValue(col, oldRow, width, pixelArray.array);
                PixelUtils.setColorValue(col, newRow, width, newPixelArray.array, pixel);
            }
            newRow += 1;
        }
    }

    return newPixelArray;
}
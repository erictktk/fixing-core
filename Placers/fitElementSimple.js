import * as PixelUtils from "eric-pixelarrayutils/PixelUtils";

/**
 * Fit a pixel element into a window with only one extension
 *
 * @param {PixelElement} pixelElement - The pixel element to resize.
 * @param {number} [targetWidth=null] - The desired target width. If null, the current width is used.
 * @param {number} [targetHeight=null] - The desired target height. If null, the current height is used.
 * @param {*} [testingObject=null] - Object to store skipped and repeated height or width during resizing.
 * @returns {Uint8ClampedArray} - The resized pixel array.
 */
export function fitElementSimple(pixelElement, targetWidth = null, targetHeight = null, testingObject = null) {
    const array = pixelElement.pixelArray.array;
    let width = pixelElement.width;
    let height = pixelElement.height;

    if (targetWidth === null) {
        targetWidth = width;
    }

    if (targetHeight === null) {
        targetHeight = height;
    }

    let numExtensions = pixelElement.widthExtensions.length;
    let numHeightExtensions = pixelElement.heightExtensions.length;

    //#region exceptions
    if (numExtensions === 0 && targetWidth !== width) {
        throw new Error("No width extensions found! (Need at least one)");
    }
    if (numHeightExtensions === 0 && targetHeight !== height) {
        throw new Error("No height extensions found! (Need at least one)");
    }

    if (numExtensions > 1) {
        console.warn("numExtensions is greater than 1! Will be using first value!");
    }
    if (numHeightExtensions > 1) {
        console.warn("numHeightExtensions is greater than 1! Will be using first value!");
    }
    //#endregion

    let firstArray = null;
    if (width === targetWidth && height === targetHeight) {
        return new Uint8ClampedArray(array);
    }

    let color = null;

    //#region width extension
    firstArray = new Uint8ClampedArray(targetWidth * height * 4);
    if (width < targetWidth) {
        let xValue = pixelElement.widthExtensions[0];
        let amountToDo = targetWidth - width;

        let actualI = null;
        for (let i = 0; i < targetWidth; i += 1) {
            if (i >= xValue) {
                actualI = Math.max(xValue, i - amountToDo);
            } else {
                actualI = i;
            }
            for (let j = 0; j < height; j += 1) {
                color = PixelUtils.getColorValue(actualI, j, width, array);
                PixelUtils.setColorValue(i, j, targetWidth, firstArray, color);
            }
        }
    } else if (width > targetWidth) {
        let xValue = pixelElement.widthExtensions[0];
        let amountToShrink = width - targetWidth;
        let targetI = null;

        for (let i = 0; i < width; i += 1) {
            if (i >= (xValue - amountToShrink) && i < xValue) {
                if (testingObject !== null) {
                    testingObject.skippedWidth.push(i);
                }
                continue;
            }

            if (i < xValue) {
                targetI = i;
            } else {
                targetI = i - amountToShrink;
            }

            for (let j = 0; j < height; j += 1) {
                color = PixelUtils.getColorValue(i, j, width, array);
                PixelUtils.setColorValue(targetI, j, targetWidth, firstArray, color);
            }
        }
    } else {
        console.log("hi!");
        firstArray = new Uint8ClampedArray(array);
    }
    //#endregion width extension

    //#region preparing height
    let secondArray = null;

    if (height !== targetHeight) {
        secondArray = new Uint8ClampedArray(targetWidth * targetHeight * 4);
    } else {
        secondArray = firstArray;
        return secondArray;
    }
    //#endregion

    console.log("targetWidth = " + targetWidth);
    console.log("targetHeight = " + targetHeight);

    //#region height extension
    if (height < targetHeight) {
        let amountToDo = targetHeight - height;
        console.log(amountToDo);
        let value = pixelElement.heightExtensions[0];
        let actualJ = null;

        for (let j = 0; j < targetHeight; j += 1) {
            if (j >= value) {
                actualJ = Math.max(value, j - amountToDo);
                if (j - amountToDo < value && testingObject !== null) {
                    testingObject.repeatedHeight.push(j);
                }
            } else {
                actualJ = j;
            }

            for (let i = 0; i < targetWidth; i += 1) {
                color = PixelUtils.getColorValue(i, actualJ, targetWidth, firstArray);
                PixelUtils.setColorValue(i, j, targetWidth, secondArray, color);
            }
        }
    } else {
        let yValue = pixelElement.widthExtensions[0];
        let amountToShrink = height - targetHeight;
        let actualJ = null;
        let targetJ = null;

        for (let j = 0; j < height; j += 1) {
            if (j >= (yValue - amountToShrink) && j < yValue) {
                if (testingObject !== null) {
                    testingObject.skippedHeight.push(j);
                }
                continue;
            }

            if (j < yValue) {
                targetJ = j;
            } else {
                targetJ = j - amountToShrink;
            }

            for (let i = 0; i < targetWidth; i += 1) {
                color = PixelUtils.getColorValue(i, j, targetWidth, firstArray);
                PixelUtils.setColorValue(i, targetJ, targetWidth, secondArray, color);
            }
        }
    }
    //#endregion height extension

    return secondArray;
}

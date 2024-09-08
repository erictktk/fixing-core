/**
 * Module to handle fitting of PixelElements
 */

import * as PixelUtils from "eric-pixelarrayutils/PixelUtils";
import { PixelArray } from "eric-pixelarrayutils/PixelArray";
import { PixelElement } from "./FittingClasses";

/**
 * Fits a pixel element into a window with one extension and returns a PixelArray.
 * 
 * @param {PixelElement} pixelElement - The pixel element to be fit.
 * @param {number|null} [targetWidth=null] - The target width to fit the element into.
 * @param {number|null} [targetHeight=null] - The target height to fit the element into.
 * @param {*} [testingObject=null] - An optional object for tracking skipped or repeated dimensions.
 * @returns {PixelArray} - The new fitted PixelArray.
 */
export function fitElementSimplePArray(pixelElement, targetWidth = null, targetHeight = null, testingObject = null) {
    let resultArray = fitElementSimple(pixelElement, targetWidth, targetHeight, testingObject);
    return new PixelArray(resultArray, targetWidth);
}

/**
 * Fits a pixel element into a window with one extension and returns a Uint8ClampedArray.
 * 
 * @param {PixelElement} pixelElement - The pixel element to be fit.
 * @param {number|null} [targetWidth=null] - The target width to fit the element into.
 * @param {number|null} [targetHeight=null] - The target height to fit the element into.
 * @param {*} [testingObject=null] - An optional object for tracking skipped or repeated dimensions.
 * @returns {Uint8ClampedArray} - The resized pixel array as a Uint8ClampedArray.
 */
export function fitElementSimple(pixelElement, targetWidth = null, targetHeight = null, testingObject = null) {
   const array = pixelElement.pixelArray.array;
   let width = pixelElement.width;
   let height = pixelElement.height;

   // Default target width and height to the element's width/height if not specified
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
       throw new Error("No width extensions found! (need at least one)");
   }
   if (numHeightExtensions === 0 && targetHeight !== height) {
       throw new Error("No height extensions found! (need at least one)");
   }

   if (numExtensions > 1) {
       console.warn("Multiple width extensions found! Using the first one.");
   }
   if (numHeightExtensions > 1) {
       console.warn("Multiple height extensions found! Using the first one.");
   }
   //#endregion

   // Initialize the first array for width fitting
   let firstArray = null;
   if (width === targetWidth && height === targetHeight) {
       return new Uint8ClampedArray(array); // Return unchanged if already the correct size
   }

   let color = null;

   //#region width extension
   firstArray = new Uint8ClampedArray(targetWidth * height * 4); // Initialize for RGBA

   if (width < targetWidth) {
       let xValue = pixelElement.widthExtensions[0];
       let amountToDo = targetWidth - width;

       for (let i = 0; i < targetWidth; i += 1) {
           let actualI = i >= xValue ? Math.max(xValue, i - amountToDo) : i;
           for (let j = 0; j < height; j += 1) {
               color = PixelUtils.getColorValue(actualI, j, width, array);
               PixelUtils.setColorValue(i, j, targetWidth, firstArray, color);
           }
       }
   } else if (width > targetWidth) {
       let xValue = pixelElement.widthExtensions[0];
       let amountToShrink = width - targetWidth;

       for (let i = 0; i < width; i += 1) {
           if (i >= (xValue - amountToShrink) && i < xValue) {
               if (testingObject !== null) {
                   testingObject.skippedWidth.push(i);
               }
               continue;
           }

           let targetI = i < xValue ? i : i - amountToShrink;
           for (let j = 0; j < height; j += 1) {
               color = PixelUtils.getColorValue(i, j, width, array);
               PixelUtils.setColorValue(targetI, j, targetWidth, firstArray, color);
           }
       }
   } else {
       firstArray = new Uint8ClampedArray(array); // No changes needed
   }
   //#endregion width extension

   //#region preparing height
   let secondArray = null;

   if (height !== targetHeight) {
       secondArray = new Uint8ClampedArray(targetWidth * targetHeight * 4); // Initialize for RGBA
   } else {
       secondArray = firstArray;
       return secondArray; // Return if no height adjustment is needed
   }
   //#endregion

   //#region height extension
   if (height < targetHeight) {
       let amountToDo = targetHeight - height;
       let value = pixelElement.heightExtensions[0];

       for (let j = 0; j < targetHeight; j += 1) {
           let actualJ = j >= value ? Math.max(value, j - amountToDo) : j;

           for (let i = 0; i < targetWidth; i += 1) {
               color = PixelUtils.getColorValue(i, actualJ, targetWidth, firstArray);
               PixelUtils.setColorValue(i, j, targetWidth, secondArray, color);
           }
       }
   } else {
       let yValue = pixelElement.heightExtensions[0];
       let amountToShrink = height - targetHeight;

       for (let j = 0; j < height; j += 1) {
           if (j >= (yValue - amountToShrink) && j < yValue) {
               if (testingObject !== null) {
                   testingObject.skippedHeight.push(j);
               }
               continue;
           }

           let targetJ = j < yValue ? j : j - amountToShrink;
           for (let i = 0; i < targetWidth; i += 1) {
               color = PixelUtils.getColorValue(i, j, targetWidth, firstArray);
               PixelUtils.setColorValue(i, targetJ, targetWidth, secondArray, color);
           }
       }
   }
   //#endregion height extension

   return secondArray;
}

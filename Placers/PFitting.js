/**
 * Module to handle fitting of PixelElements (not sure what the difference is between this and PFixedFitting)
 */

import * as PixelUtils from "eric-pixelarrayutils/PixelUtils";
import { PixelArray } from "eric-pixelarrayutils/PixelArray";
import { PixelElement } from "./FittingClasses";


/**
* fit a pixel element into a window with only one extension
* 
* @param {PixelElement} pixelElement 
* @param {int} targetWidth 
* @param {int} targetHeight 
* @param {*} testingObject 
* @returns {PixelArray}
*/
export function fitElementSimplePArray(pixelElement, targetWidth=null, targetHeight=null, testingObject=null){
    let resultArray = fitElementSimple(pixelElement, targetWidth, targetHeight, testingObject);
    return new PixelArray(resultArray, targetWidth); 
}


/**
* fit a pixel element into a window with only one extension
* 
* @param {PixelElement} pixelElement 
* @param {int} targetWidth 
* @param {int} targetHeight 
* @param {*} testingObject 
* @returns {Uint8ClampedArray}
*/
export function fitElementSimple(pixelElement, targetWidth=null, targetHeight=null, testingObject=null){
   const array = pixelElement.pixelArray.array;
   var width = pixelElement.width;
   var height = pixelElement.height;

   if (targetWidth === null){
       targetWidth = width;
   }

   if (targetHeight === null){
       targetHeight = height;
   }

   let numExtensions = pixelElement.widthExtensions.length;
   let numHeightExtensions = pixelElement.heightExtensions.length;

   //#region exceptions
   if(numExtensions === 0 && targetWidth !== width){
       throw("no width extensions found! (need at least one)");
   }
   if(numHeightExtensions === 0 && targetHeight !== height){
       throw("no height extensions found! (need at least one)");
   }

   if (numExtensions > 1){
       console.warn("numExtensions is greater than 1! will be using first value!" );
   }
   if (numHeightExtensions > 1){
       console.warn("numHeightExtensions is greater than 1! will be using first value!" );
   }
   //#endregion
   


   let firstArray = null;
   if (width === targetWidth && height === targetHeight){
       return new Uint8ClampedArray(array);
   }

   let color = null;

   //#region width extension
   firstArray = new Uint8ClampedArray(targetWidth*height*4);
   if (width < targetWidth){
       let xValue = pixelElement.widthExtensions[0];

       var amountToDo = targetWidth-width;

       //or copy same i
       var actualI = null;
       for(let i = 0; i < targetWidth; i += 1){
           if (i >= xValue){
               actualI = Math.max(xValue, i-amountToDo);
           }
           else{
               actualI = i;
           }
           for(let j = 0; j < height; j += 1){
               color = PixelUtils.getColorValue(actualI, j, width, array);
               PixelUtils.setColorValue(i, j, targetWidth, firstArray, color);
               //for( let k = 0; l < )
           }
       }
   }    
   else if (width > targetWidth){
       var xValue = pixelElement.widthExtensions[0];

       var amountToShrink = width-targetWidth;
       var targetI = null;
       let actualI = null;
       for(let i = 0; i < width; i += 1){
           if (i >= (xValue-amountToShrink) && i < xValue){
               if (testingObject !== null){
                   testingObject.skippedWidth.push(i);
               }
               continue;
           }

           if ( i < xValue ){
               targetI = i;
           }
           else{
               targetI = i-amountToShrink;
           }

           for(let j = 0; j < height; j += 1){
               color = PixelUtils.getColorValue(i, j, width, array);
               PixelUtils.setColorValue(targetI, j, targetWidth, firstArray, color);
           }
       }
   }
   else{
       console.log("hi!");
       firstArray = new Uint8ClampedArray(array);
   }
   //#endregion width extension

   //#region preparing height
   var secondArray = null;

   if (height !== targetHeight){
       secondArray = new Uint8ClampedArray(targetWidth*targetHeight*4);
   }
   else{
       secondArray = firstArray;
       return secondArray;
   }
   //#endregion

   console.log("targetWidth = " + targetWidth);
   console.log("targetWidth = " + targetHeight);

   //#region heightextension
   if (height < targetHeight){
       let amountToDo = targetHeight-height;
       console.log(amountToDo);
       var value = pixelElement.heightExtensions[0];
       //or copy same j
       var actualJ = null;

       for(var j = 0; j < targetHeight; j += 1){
           if (j >= value){
               actualJ = Math.max(value, j-amountToDo);
               if (j-amountToDo < value && testingObject !== null){
               testingObject.repeatedHeight.push(j);
               }
           }
           else{
               actualJ = j;
           }
              
           for(var i = 0; i < targetWidth; i += 1){
               color = PixelUtils.getColorValue(i, actualJ, targetWidth, firstArray);
               PixelUtils.setColorValue(i, j, targetWidth, secondArray, color);
               //for( let k = 0; l < )
           }
       }
   }
   else{
       var yValue = pixelElement.widthExtensions[0];

       let amountToShrink = height-targetHeight;

       let actualJ = null;
       let targetJ = null;

       for(let j = 0; j < height; j += 1){
           if (j >= (yValue-amountToShrink) && i < yValue){
               if (testingObject !== null){
                   testingObject.skippedHeight.push(j);
               }
               continue;
           }

           if ( j < yValue ){
               targetJ = j;
           }
           else{
               targetJ = j-amountToShrink;
           }

           for(let i = 0; i < targetWidth; i += 1){
               color = PixelUtils.getColorValue(i, j, targetWidth, firstArray);
               PixelUtils.setColorValue(i, targetJ, targetWidth, secondArray, color);
           }
       }
   }
   //#endregion height

   return secondArray;
}
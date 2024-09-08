import * as Composition from './Composition.js';
import { PixelArray } from "eric-pixelarrayutils/PixelArray";
import { RandomWrapper } from "eric-random-wrapper";
import { Over, OverCustomAlpha } from "eric-pixelarrayutils/BlendModes";


/**
 * Uniformly stamps across an image using random stamps and positions.
 * @param {PixelArray} inputArray - Base image
 * @param {Array<PixelArray>} stampArrays - Array of stamp images
 * @param {Array<number>} widthDistRange - Width distribution range
 * @param {Array<number>} heightDistRange - Height distribution range
 * @param {RandomWrapper} randObj - Random utility
 * @returns {PixelArray} - New image with stamps
 */
export function uniformStamper(inputArray, stampArrays, widthDistRange, heightDistRange, randObj) {
  let width = inputArray.width;
  let height = inputArray.height;

  let halfWidth = Math.round((widthDistRange[1] + widthDistRange[0]) / 2);
  let halfHeight = Math.round((heightDistRange[1] + heightDistRange)/2); // Error: Should use heightDistRange[0]

  let newArr = new Uint8ClampedArray(width * height * 4);
  
  for (let i = 0; i < width; i += 0) { // 
    let curI = i;
    for (let j = 0; j < height; j += 0) { // 
      let curStampArray = randObj.choice(stampArrays);
      let customAlpha = randObj.random(0.5, 1);
      let blendFunc = (a, b) => { OverCustomAlpha(a, b, customAlpha) };
      Composition.blendColorLayers(inputArray, curStampArray, blendFunc, newArr);

      j += randObj.randInt(heightDistRange[0], heightDistRange[1]);
    }

    i += randObj.randInt(widthDistRange[0], widthDistRange[1]);
  }

  return new PixelArray(newArr, width, height);
}

/**
 * Creates random copies of a stamp on a background.
 * @param {number} copies - Number of copies
 * @param {PixelArray} bgArray - Background image
 * @param {PixelArray} stampArray - Stamp image
 * @param {RandomWrapper} randObj - Random utility
 * @param {function} [blendFunc=null] - Optional blend function
 * @returns {Uint8ClampedArray} - New pixel array with stamps
 */
export function randomCopy(copies, bgArray, stampArray, randObj, blendFunc = null) {
  // Initialize variables
  let width = bgArray.width;
  let height = bgArray.height;

  let newArr = new Uint8ClampedArray(bgArray.arr);

  for (let i = 0; i < copies; i+=1) {
    let x = randObj.randInt(-8, width);
    let y = randObj.randInt(-8, height);
    stampArray.xPos = x;
    stampArray.yPos = y;
    
    Composition.blendColorLayers(bgArray, stampArray, blendFunc, newArr);
  }
  
  return newArr;
}

/**
 * Wrapper function that returns a PixelArray.
 * @returns {PixelArray}
 */
export function randomCopyPArray(bgArray, stampArray, copies, randObj, blendFunc = null) {
  const newArray = randomCopy(copies, bgArray, stampArray, randObj, blendFunc);
  return new PixelArray(newArray, bgArray.width);
}

/**
 * Stamps images along the width at random positions.
 * @param {PixelArray} inputArray - Base image
 * @param {Array<PixelArray>} stampArrays - Array of stamp images
 * @param {RandomWrapper} randObj - Random utility
 * @param {number|Array<number>} copies - Number or range of copies
 * @param {Array<number>} [distRange=[-2, 2]] - Distribution range for x offset
 * @param {function} [blendFunc=null] - Optional blend function
 * @returns {PixelArray} - New image with stamps
 */
export function widthStamper(inputArray, stampArrays, copies, randObj, distRange = [-2, 2], yRange=[0, 0], blendFunc = null) {
  // Determine number of copies
  if (!randObj){
    randObj = new RandomWrapper();
  }

  if (Array.isArray(copies)) {
    copies = randObj.randInt(copies[0], copies[1]);
  }

  const width = inputArray.width;
  const partitionWidth = width / copies;

  let centers = [];
  for (let i = 0; i < copies; i+=1) {
    centers.push(partitionWidth * 0.5 + partitionWidth * i);
  }

  let newArray = new Uint8ClampedArray(inputArray);
  for (let i = 0; i < copies; i+=1) {
    let curStamp = randObj.choice(stampArrays);
    let xOffset = randObj.randInt(distRange[0], distRange[1]);
    let yOffset = randObj.randInt(yRange[0], yRange[1])
    Composition.blendColorLayers(inputArray, curStamp, null, newArray, centers[i] + xOffset, yOffset);
  }

  return new PixelArray(newArray, width);
}

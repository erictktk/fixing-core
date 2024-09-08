import { getCumuList, valueToColor, Palette, PaletteToYUVList, findSmallestDifference, YUVfromRGB } from "./PaletteGradingUtils.js";
import { PixelArray } from "eric-pixelarrayutils";
import * as Random from "./Random.js";
import { MasterSeedObj } from "../Chaining/Model/MasterSeedObj.js";

/**
 * Map the colors of one palette to another palette evenly.
 * @param {PixelArray} pixelArray
 * @param {*} paletteToMapTo
 */
export function PaletteToPaletteMapEvenSpace(pixelArray, paletteToMapTo){
    const colorMap = paletteToPaletteMapEvenSpace;
}

/**
 * Map the colors of one palette to another palette evenly.
 * @param {*} palette1
 * @param {*} palette2
 * @param {boolean} startWithDarkest
 * @param {boolean} guaranteeUnique
 * @returns {Array}
 */
export function paletteToPaletteMapEvenSpace(palette1, palette2, startWithDarkest=true, guaranteeUnique=false){
    if (palette2.colors.length < palette1.colors.length){
        if (guaranteeUnique){
            throw new Error('palette2 has less colors than palette1!');
        } else{
            console.warn('palette2 has less colors than palette1!');
        }
    }

    const colors1 = palette1.colors;
    const colors2 = palette2.colors;
    const luminances1 = palette1.luminances;
    const cumuList = getCumuList(colors2);
    let colorsToNotch = [];

    if (startWithDarkest){
        for(let i = 0; i < luminances1.length; i++){
            let notch = valueToColor[luminances1[i]];
            if (guaranteeUnique && colorsToNotch.includes(notch)){
                notch++;
            }
            colorsToNotch.push(notch);
        }
    } else {
        const count = luminances1.length;
        for(let i = 0; i < luminances1.length; i++){
            let notch = valueToColor[luminances1[count-1-i]];
            if (guaranteeUnique && colorsToNotch.includes(notch)){
                notch--;
            }
            colorsToNotch.push(notch);
        }
        colorsToNotch.reverse();
    }

    const colorMap = colors1.map((_, i) => colors2[colorsToNotch[i]]);
    return colorMap;
}

/**
 * Color grade a pixel array.
 * @param {PixelArray} pixelArray
 * @param {*} seedValues
 * @param {*} paletteList
 * @param {boolean} doYUV
 * @returns {PixelArray}
 */
export function PaletteGradingFunc(pixelArray, seedValues, paletteList, doYUV=true){
    const palette1 = Palette.PaletteFromPixelArray(pixelArray);
    const seedValue = seedValues[0] + (seedValues[1] + seedValues[2]) * seedValues[3];
    const randomWrapper = new Random.RandomWrapper(seedValue);
    const number = randomWrapper.randInt(0, paletteList.length - 1);
    const selectedPalette = paletteList[number];

    let newPixelArray;
    if (doYUV){
        const newArray = entireColorMapFunction(pixelArray, pixelArray.width, selectedPalette);
        newPixelArray = new PixelArray(newArray);
    }

    return newPixelArray;
}

/**
 * Color map the entire pixel array.
 * @param {PixelArray} pixelArray
 * @param {number} width
 * @param {*} palette
 * @param {boolean} keepTransparency
 * @returns {Uint8ClampedArray}
 */
function entireColorMapFunction(pixelArray, width, palette, keepTransparency=true){
    const imageData = pixelArray.array;
    const newArray = new Uint8ClampedArray(imageData);
    let yuvList = PaletteToYUVList(palette);

    for(let i = 0; i < imageData.data.length/4; i++){
        const index = i * 4;
        const r = imageData.data[index];
        const g = imageData.data[index+1];
        const b = imageData.data[index+2];
        const a = imageData.data[index+3];

        const newColor = findSmallestDifference([r, g, b], yuvList, palette.colors, false);

        newArray[index] = newColor.r;
        newArray[index+1] = newColor.g;
        newArray[index+2] = newColor.b;
        newArray[index+3] = keepTransparency ? a : 255;
    }

    return newArray;
}

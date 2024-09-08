import {PixelArray} from "eric-pixelarrayutils/PixelArray";
import * as KS from "./KernelSpecial";
import * as EdgeDetection from "./EdgeDetection";
//import * as Compositing from "eric-pixelarrayutils/SimpleComposition";
//import * as PAU from "eric-pixelarrayutils";
import BlendLayers from "../BlendLayers";
//import * as HSVUtils from "eric-hsvutils/HSVUtils";
import { RandomWrapper } from "eric-random-wrapper";
import * as HSVUtils from "eric-pixelarrayutils/HSVUtils";

/**
 * 
 * @param {PixelArray} pixelArray 
 */
export function EdgeExample(pixelArray){
    const kernel = KS.HorizontalKernel(2);
    const ringArray = EdgeDetection.detectAlphaEdges(pixelArray, kernel, [255, 255, 255, 55]);

    //Compositing.SimpleBlendColorLayers(pixelArray, ringArray)

    const newPArray = BlendLayers(pixelArray, ringArray);
    return newPArray;
}

/**
 * 
 * @param {PixelArray} pixelArray 
 */
export function EdgeExample2(pixelArray){
    const kernel1 = KS.HorizontalKernel(1);
    const kernel2 = KS.HorizontalKernel(2);

    const ringArray1 = EdgeDetection.detectAlphaEdges(pixelArray, kernel1, [255, 255, 255, 100]);
    const ringArray2 = EdgeDetection.detectAlphaEdges(pixelArray, kernel2, [255, 255, 255, 55]);

    let randObj = new RandomWrapper();

    let valueMod = randObj.randInt(20, 40);
    let hue = 30;
    let saturateMod = randObj.randInt(60, 80);

    const saturatedPArr = HSVUtils.HSVSaturate(pixelArray, 30, hue, saturateMod, valueMod);

    //Compositing.SimpleBlendColorLayers(pixelArray, ringArray)

    /*
    let newPArray = BlendLayers(pixelArray, ringArray2);
    newPArray = BlendLayers(newPArray, ringArray1);
    return newPArray;*/

    let newPArray = BlendLayers(saturatedPArr, ringArray2);
    newPArray = BlendLayers(newPArray, ringArray1);
    return newPArray;
}
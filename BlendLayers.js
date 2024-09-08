import * as SimpleComposition from "eric-pixelarrayutils/SimpleComposition";
import * as OldComposition from "eric-pixelarrayutils/OldComposition";
import { PixelArray } from "eric-pixelarrayutils/PixelArray";

export default function BlendLayers(bottomPArray, topPArray, blendOp=null){
    //Compositing.SimpleBlendColorLayers(pixelArray, ringArray)

    const arr = OldComposition.blendColorLayers(bottomPArray, topPArray, 0, 0, null);

    return new PixelArray(arr, bottomPArray.width);
}
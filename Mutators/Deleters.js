import { RandomWrapper } from "eric-random-wrapper";
import { PixelArray } from "eric-pixelarrayutils/PixelArray";


/**
 * Uses a RandomWrapper object to erase pixels from a PixelArray based on a bias factor
 * 
 * @param {PixelArray} pixelArray - The target PixelArray object
 * @param {Number} bias - The likelihood factor for erasing a pixel (1 means every pixel will be erased, 0 means none)
 * @param {Number|null} seed - Optional seed for the random generation
 */
export function RandomDelete(pixelArray, bias, seed=null) {
    const newPixelArray = PixelArray.CopyPixelFactory(pixelArray);
    const randObj = new RandomWrapper(seed);
    const emptyPixel = [0, 0, 0, 0];

    //let curColor 

    for (let i = 0; i < newPixelArray.width; i += 1) {
        for(let j = 0; j < newPixelArray.height; j += 1){
            if (randObj.random(0, 1) < bias) {
                // Assuming RGBA values are stored sequentially in the data array
                newPixelArray.setColorValue(i, j, emptyPixel);
            }
        }
    }

    return newPixelArray;
}

/**
 * Uses a RandomWrapper object to erase pixels from a PixelArray based on a bias factor
 * 
 * @param {PixelArray} pixelArray - The target PixelArray object
 * @param {Number} bias - The likelihood factor for erasing a pixel (1 means every pixel will be erased, 0 means none)
 * @param {Number|null} seed - Optional seed for the random generation
 */
export function RandomDeleteMutate(pixelArray, bias, seed=null) {
    const randObj = new RandomWrapper(seed);
    const emptyPixel = [0, 0, 0, 0];

    //let curColor 

    for (let i = 0; i < pixelArray.width; i += 1) {
        for(let j = 0; j < pixelArray.height; j += 1){
            if (randObj.random(0, 1) < bias) {
                // Assuming RGBA values are stored sequentially in the data array
                pixelArray.setColorValue(i, j, emptyPixel);
            }
        }
    }
}

/**
 * Uses a RandomWrapper object to only keep a certain amount of pixels within a fixed range
 * 
 * @param {PixelArray} pixelArray - The target PixelArray object
 * @param {Array<Number>|Number} range - The likelihood factor for erasing a pixel (1 means every pixel will be erased, 0 means none)
 * @param {Number|null} seed - Optional seed for the random generation
 */
export function RandomKeep(pixelArray, range=[3, 5], seed=null, fillColor=null, minAlpha=1){
    if (typeof range === 'number'){
        range = [range, range];
    }

    const newPixelArray = PixelArray.copyFrom(null, pixelArray.width, pixelArray.height);

    const [width, height] = [pixelArray.width, pixelArray.height];

    const randObj = new RandomWrapper(seed);
    const numToDo = randObj.randInt(range[0], range[1]);

    const choices = [];

    const indexToXY = (index) => { return [index%width, Math.floor(index/width)]};

    for(let i = 0; i < width*height; i += 1){
        const [x, y] = indexToXY(i);

        const curPixel = pixelArray.getColorValue(x, y);
        if (curPixel[3] >= minAlpha){
            choices.push(i);    
        }
    }

    for(let i = 0; i < numToDo; i += 1){
        const curIndex = randObj.choice(choices);
        const [x, y] = indexToXY(curIndex);
        
        if (!fillColor){
            newPixelArray.setColorValue(x, y, pixelArray.getColorValue(x, y));
        }
        else{
            newPixelArray.setColorValue(x, y, fillColor)
        }
    }

    return newPixelArray;
}
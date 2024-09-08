import {PixelArray} from "eric-pixelarrayutils/PixelArray";

export default class Kernel{
    constructor(xLeft=-1, xRight=1, yDown=-1, yUp=1){
        this.xLeft = xLeft;
        this.xRight = xRight;
        this.yUp = yUp;
        this.yDown = yDown;
        this.width = xRight-xLeft+1;
        this.height = yUp-yDown+1;
    }

    get offsets(){
        const offsets = [];
        for(let i = this.xLeft; i < this.xRight+1; i += 1){
            for(let j = this.yDown; j < this.yUp+1; j += 1){
                offsets.push([i, j]);
            }
        }
        return offsets;
    }

    getMaxDistance(){
        const maxHorizontalDistance = Math.max(Math.abs(this.xLeft), Math.abs(this.xRight));
        const maxVerticalDistance = Math.max(Math.abs(this.yUp), Math.abs(this.yDown));

        return Math.sqrt(maxHorizontalDistance * maxHorizontalDistance + maxVerticalDistance * maxVerticalDistance);
    }


    //
    //const arr1 = [0, 1, 2, [3, 4]];

    //console.log(arr1.flat());
    // expected output: Array [0, 1, 2, 3, 4]

    /**
     * Tests a pixel with arbitrary func and this object's kernel
     * 
     * @param {PixelArray} pixelArray - The width of the 2D plane.
     * @param {Number} x - an integer 
     * @param {Number} y - an integer
     * @param {Function} func - predicate function.
     * @returns {Array<Array<Boolean>>}
     */
    getBool(pixelArray, x, y, func=null){
        if (!func){
            func = (color) => {return color[3] > 0;}
        }

        const result = [];

        for(let i = 0; i < this.offsets[0].length; i += 1){
            const currentRow = [];
            for(let j = 0; j < this.offsets[1].length; j += 1){
                const xOffset = this.offsets[0][i];
                const yOffset = this.offsets[1][j];
                const checkX = x + xOffset;
                const checkY = y + yOffset;
                
                currentRow.push(func(checkX, checkY, pixelArray));
            }
            result.push(currentRow);
        }
        return result;
    }

    grabNeighborColor(pixelArray){
        
    }

    flattenResult(result){
        return result.flatten();
    }

    /**
     * Generates a gradient on a 2D plane given two colors, dimensions, position offsets, and gradient distance.
     * 
     * @param {number} width - The width of the 2D plane.
     * @param {Function} func - predicate function.
     * @returns {Array<Array<Boolean>>}
     */
    getColorBool(){

    }
    
}

//export function Pixe

export function Thing(pArray, x, y){
    if (x >= pArray.width){
        return null;
    }
    else if (x < 0){
        return null;
    }
    else if (y >= pArray.height){
        return null;
    }
    else if (y < 0){
        return null;
    }
}


//#region Kernel Functions
/**
 * 
 * @param {*} x int
 * @param {*} y int
 * @param {*} kernel 
 * @param {*} pixelArrays Array<PixelArray>
 * @param {*} func 
 */

export function KernelBoundFunc(x, y, kernel, pixelArrays, func){
    let width = pixelArrays[0].width;
    let height =  pixelArrays[0].height;


    let offsets = kernel.offsets;
    let curX = null;
    let curY = null;

    let newPixelArray = new PixelArray(null, width, height);


    for(let i = 0; i < width; i += 1){
        for(let j = 0; j < height; j += 1){
            for(let k = 0; k < offsets.length; k += 1){

                curX = i + offsets[k][0];
                curY = j + offsets[k][1];

                if (curX < 0 || curX >= width){
                    continue;
                }

                if (curY < 0 || curY >= height){
                    continue;
                }

                func(curX, curY, pixelArrays, newPixelArray);

            }
        }
    }
    return newPixelArray;
}


//#endregion


//#region Special Kernels


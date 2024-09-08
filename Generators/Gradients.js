import { PixelArray } from "eric-pixelarrayutils/PixelArray";

const black = [0, 0, 0, 255];
const white = [255, 255, 255, 255];

/**
 * Generates a gradient on a 2D plane given two colors, dimensions, position offsets, and gradient distance.
 * 
 * @param {number} width - The width of the 2D plane.
 * @param {number} height - The height of the 2D plane.
 * @param {number} xOffsetTop - Horizontal offset for the top of the gradient line.
 * @param {number} xOffsetBottom - Horizontal offset for the bottom of the gradient line.
 * @param {number} gradientDistanceInPixels - Distance over which the gradient spans.
 * @param {number[]} color1 - The starting RGBA color of the gradient.
 * @param {number[]} color2 - The ending RGBA color of the gradient.
 * 
 * @returns {PixelArray} The pixel array containing gradient data.
 */
function GenerateGradient(width, height, xOffsetTop, xOffsetBottom, gradientDistanceInPixels, black, white){
    const pos1 = new Vector(xOffsetTop, height);
    const pos2 = new Vector(xOffsetBottom, 0);

    const newPArray = new PixelArray(null, width, height);

    let curPoint = null;
    let u, curDist, d;
    let curColor = null;
    let [r, g, b, a] = [0, 0, 0, 0];
    for(let i = 0; i < width; i += 1){
        for(let j = 0; j < height; j +=1 ){
            curPoint = new Vector(i, j);
            curDist = DistFromLine(pos1, pos2, curPoint);
            d = Vector.pseudoCrossProduct(curPoint, pos1);

            if (d < 0){
                newPArray.setColorValue(i, j, color1);
            }
            else if (d >= gradientDistanceInPixels){
                newPArray.setColorValue(i, j, color2);
            }
            else{
                u = d/gradientDistanceInPixels;

                r = Math.round(color1[0]*(1-u) + color2[0]*u);
                g = Math.round(color1[1]*(1-u) + color2[1]*u);
                b = Math.round(color1[2]*(1-u) + color2[2]*u);
                a = Math.round(color1[3]*(1-u) + color2[3]*u);
                curColor = [r, g, b, a];
                newPArray.setColorValue(i, j, curColor);
            }
        }
    }

    return newPArray;
}

/**
 * Generates a horizontal gradient from left to right.
 *
 * @param {number} width - Width of the output gradient.
 * @param {number} height - Height of the output gradient.
 * @param {Array<number>} color1 - Starting color as [r, g, b, a].
 * @param {Array<number>} color2 - Ending color as [r, g, b, a].
 * @returns {PixelArray} Resulting gradient in PixelArray format.
 */
function GenerateHorizontalGradient(width, height, color1, color2) {
    const newPArray = new PixelArray(null, width, height);
    let u, r, g, b, a, curColor;

    for (let i = 0; i < width; i += 1) {
        u = i / width;
        r = Math.round(color1[0] * (1 - u) + color2[0] * u);
        g = Math.round(color1[1] * (1 - u) + color2[1] * u);
        b = Math.round(color1[2] * (1 - u) + color2[2] * u);
        a = Math.round(color1[3] * (1 - u) + color2[3] * u);
        curColor = [r, g, b, a];
        
        for (let j = 0; j < height; j += 1) {
            newPArray.setColorValue(i, j, curColor);
        }
    }

    return newPArray;
}

/**
 * Generates a vertical gradient from top to bottom.
 *
 * @param {number} width - Width of the output gradient.
 * @param {number} height - Height of the output gradient.
 * @param {Array<number>} color1 - Starting color as [r, g, b, a].
 * @param {Array<number>} color2 - Ending color as [r, g, b, a].
 * @returns {PixelArray} Resulting gradient in PixelArray format.
 */
function GenerateVerticalGradient(width, height, color1, color2) {
    const newPArray = new PixelArray(null, width, height);
    let u, r, g, b, a, curColor;

    for (let j = 0; j < height; j += 1) {
        u = j / height;
        r = Math.round(color1[0] * (1 - u) + color2[0] * u);
        g = Math.round(color1[1] * (1 - u) + color2[1] * u);
        b = Math.round(color1[2] * (1 - u) + color2[2] * u);
        a = Math.round(color1[3] * (1 - u) + color2[3] * u);
        curColor = [r, g, b, a];

        for (let i = 0; i < width; i += 1) {
            newPArray.setColorValue(i, j, curColor);
        }
    }

    return newPArray;
}
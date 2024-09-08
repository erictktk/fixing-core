import { PixelArray } from 'eric-pixelarrayutils/PixelArray';


export function stampCenter(bottomPixelArray, topPixelArray, x, y){
    return stamp(bottomPixelArray, topPixelArray, x, y);
}

export function stampNormal(bottomPixelArray, topPixelArray, x, y){
    return stamp(bottomPixelArray, topPixelArray, x, y, 'left', 'bottom');
}

export function stampOrigin(bottomPixelArray, topPixelArray, x, y){
    return stamp(bottomPixelArray, topPixelArray, x, y, 'left', 'top');
}


export function stamp(bottomPixelArray, topPixelArray, x, y, alignX = 'center', alignY = 'center') {
    // Create a deep copy of bottomPixelArray to avoid mutating the input
    const resultPixelArray = PixelArray.CopyPixelFactory(bottomPixelArray);

    // Calculate the X and Y offsets based on alignment
    let xOffset = 0;
    let yOffset = 0;

    if (alignX === 'left') {
        xOffset = x;
    } else if (alignX === 'center') {
        xOffset = x - Math.floor(topPixelArray.width / 2);
    } else if (alignX === 'right') {
        xOffset = x - topPixelArray.width;
    }

    if (alignY === 'over') {
        yOffset = y - topPixelArray.height; // over alignment means placing the topPixelArray above the y position
    } else if (alignY === 'center') {
        yOffset = y - Math.floor(topPixelArray.height / 2);
    } else if (alignY === 'under') {
        yOffset = y; // under alignment means placing the topPixelArray starting from the y position
    }

    // Stamp the top pixel array onto the bottom pixel array
    for (let topX = 0; topX < topPixelArray.width; topX += 1) {
        for (let topY = 0; topY < topPixelArray.height; topY += 1) {
            // Calculate the corresponding position on the bottom pixel array
            const bottomX = xOffset + topX;
            const bottomY = yOffset + topY;

            // Check if the position is within bounds of the bottom pixel array
            if (bottomX >= 0 && bottomX < bottomPixelArray.width && bottomY >= 0 && bottomY < bottomPixelArray.height) {
                const topColor = topPixelArray.getColorValue(topX, topY);
                // Apply the top pixel array color if it's not transparent
                if (topColor[3] > 0) {
                    resultPixelArray.setColorValue(bottomX, bottomY, topColor);
                }
            }
        }
    }

    return resultPixelArray;
}
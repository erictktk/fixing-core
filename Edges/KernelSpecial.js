import IrregularKernel from "./KernelIrregular";
import Kernel from "./Kernel";

/**
 * Creates an upward-facing kernel.
 * Note: In canvas, higher y-values are downward.
 *
 * @param {number} [length=3] - Kernel height.
 * @returns {Kernel} - Upwards kernel.
 */
export function UpKernel(length=3){
    return new Kernel(0, 0, length, 0);
}

/**
 * Creates an downard-facing kernel.
 * Note: In canvas, higher y-values are downward.
 *
 * @param {number} [length=3] - Kernel height.
 * @returns {Kernel} - Upwards kernel.
 */
export function DownKernel(length=3){
    return new Kernel(0, 0, 0, length);
}

/**
 * Creates an downard-facing kernel.
 *
 * @param {number} [length=3] - Kernel left bounds.
 * @returns {Kernel} - Left kernel
 */
export function LeftKernel(length=3){
    return new Kernel(-length, 0, 0, 0);
}


/**
 * Creates a horizontal kernel.
 *
 * @param {number} [length=2] - Kernel left bounds.
 * @returns {Kernel} - Left kernel
 */
export function HorizontalKernel(length=2){
    return new Kernel(-length, length, 0, 0);
}

//reverse kernels because Y starts at top
export function ConstDownKernel(length=4){
    const offsets = [];
    for(let i = 0; i < length; i += 1){
        offsets.push([0, i*1]);
    }

    return new IrregularKernel(offsets);
}

export function ConstUpKernel(length=4){
    const offsets = [];
    for(let i = 0; i < length; i += 1){
        offsets.push([0, -i*1]);
    }

    return new IrregularKernel(offsets);
}


export function DottedDownKernel(length=4, oddOrEven=0){
    const doOdd = oddOrEven === 0 ? true : false;
    const offsets = [];
    for(let i = 0; i < length; i += 1){
        let addToKernel = null
        if (doOdd){
            if (i % 2 !== 0){
                offsets.push([0, i*1]);
            }
        }
        if (!doOdd){
            if (i % 2 === 0){
                offsets.push([0, i*1])
            }
        }
        
    }
    return new IrregularKernel(offsets);
}

export function DottedUpKernelConst(length=4, oddOrEven=0){
    const doOdd = oddOrEven === 0 ? true : false;
    const offsets = [];
    for(let i = 0; i < length; i += 1){
        let addToKernel = null
        if (doOdd){
            if (i % 2 !== 0){
                offsets.push([0, -i*1]);
            }
        }
        if (!doOdd){
            if (i % 2 === 0){
                offsets.push([0, -i*1])
            }
        }
        
    }
    return new IrregularKernel(offsets);
}
//#endregion


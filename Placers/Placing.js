//decide between relative positioning and absolute positioning
import { PixelArray } from "eric-pixelarrayutils/PixelArray";
import * as Random from "./Random.js";

export default class PlacementHandler{
    /*
    START = 0;
    CENTER = 1;
    END = 2;
    RANDOM = 3;*/

    START = 0;
    CENTER = 1;
    END = 2;
    RANDOM = 3;
    RANDOMRANGE = 4;

    constructor(backgroundPArr, pArrToPlace, xPlace=null, yPlace=null, xPrePlace=null, yPrePlace=null, randObj=null, distanceParam=null){
        this.backgroundPArr = backgroundPArr;
        this.pArrToPlace = pArrToPlace;

        this.xPlace = xPlace;
        this.yPlace = yPlace;

        this.xPrePlace = (!xPrePlace) ? 1 : xPrePlace;
        this.yPrePlace = yPrePlace;

        this.randObj = randObj;

        this.distanceParam = (!distanceParam) ? 0 : distanceParam;
    }

    getTotalX(){

    }

    getTotalY(){

    }

    getTotal(){
        if (!this.randObj){
            this.randObj = new Random.RandomWrapper();
        }

        if (this.xPlace === 0){
            this.xPrePlace = 0;
        }
        else if(this.xPlace === 2){
            this.xPrePlace = 2;
        }
    }


    _getHMove(){
        if (this.distanceParam){
            throw "Distance param not yet implemented!";
        }

        const backgroundPArr = this.backgroundPArr;
        const pArrToPlace =this.pArrToPlace;
        this.backgroundPArr = backgroundPArr;
        this.pArrToPlace = pArrToPlace;

        const width1 = backgroundPArr.width;
        const width2 = pArrToPlace.width;

        if (this.xPlace === 0){
            return 0;
        }
        else if (this.xPlace === 1){
            return Math.round((width1-width2)/2);
        }
        else if (this.xPlace === 2){
            return width1;
        }
        else{
            throw 'Not yet implemented!';
        }
    }

    _getVMove(){
        if (this.distanceParam){
            throw "Distance param not yet implemented!";
        }

        const backgroundPArr = this.backgroundPArr;
        const pArrToPlace =this.pArrToPlace;
        this.backgroundPArr = backgroundPArr;
        this.pArrToPlace = pArrToPlace;

        const height1 = backgroundPArr.height;
        const height2 = pArrToPlace.height;

        if (this.yPlace === 0){
            return height1;
        }
        else if (this.yPlace === 1){
            return Math.round((height1-height2)/2);
        }
        else if (this.yPlace === 2){
            return 0;
        }
        else{
            throw 'Not yet implemented!';
        }
    }


    _getVPreMove(prePlacement=1){
        const uSize = this.pArr.width;

        if (prePlacement === 0){
            return 0;
        }
        else if (prePlacement === 2){
            return uSize;
        }
        else{
            return Math.round(uSize/2);
        }
    }

    _getHPreMove(prePlacement=1){
        const uSize = this.pArr.width;

        if (prePlacement === 0){
            return 0;
        }
        else if (prePlacement === 2){
            return uSize;
        }
        else{
            return Math.round(uSize/2);
        }
    }
}

/**
 * 
 * @param {PixelArray} pArr 
 * @param {*} prePlacement 
 */
export function GetHPreMove(pArr, prePlacement=1){
    const uSize = pArr.width;

    if (prePlacement === 0){
        return 0;
    }
    else if (prePlacement === 2){
        return pArr.uSize;
    }
    else{
        return Math.round(uSize/2);
    }
}

/**
 * 
 * @param {PixelArray} pArr 
 * @param {*} prePlacement 
 */
export function GetVPreMove(pArr, prePlacement=1){
    const uSize = pArr.height;

    if (prePlacement === 0){
        return 0;
    }
    else if (prePlacement === 2){
        return pArr.uSize;
    }
    else{
        return Math.round(uSize/2);
    }
}

/**
 * 
 * @param {PixelArray} pArray 
 * @param {PixelArray} pArrToPlace 
 * @param {*} randObj 
 * @param {*} preMoveChoice 
 */
export function MiddlePlacement(pArray, pArrToPlace, randObj=null, preMoveChoice=null){
    //
    const width1 = pArray.width;
    const width2 = pArrToPlace.width;

    const height1 = pArray.height;
    const height2=  pArrToPlace.height;

    let xPreMove = 0;
    let yPreMove = 0;
    if (!preMoveChoice){
        yPreMove = pArrToPlace+Math.round(height2/2);
    }
    else{
        yPreMove = GetVPreMove(preMoveChoice);
    }   

    let xMove = 0;
    let yMove = Math.round((height1-height2)/2);
    
    pArrToPlace.xPos = pArray.xPos+xMove+xPreMove;
    pArrToPlace.yPos = pArray.yPos+yMove+yPreMove;

}
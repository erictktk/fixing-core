import { RandomWrapper } from "eric-random-wrapper";
import { PanelObject } from "./FittingClasses";

// #region Partitioners 

// /**
//  * 
//  * @param {*} parentObject 
//  * @param {*} sizes 
//  * @param {*} elements 
//  * @param {*} history 
//  * @param {*} gaps 
//  * @returns {Array<PanelObject>}
//  */
// function WidthPartitioner(parentObject, sizes, elements, history, gaps){
//     var extents = parentObject.extents;

//     var curValue = extents.xMin;

//     if (gaps === null){
//         gaps = [];
//         for(var i = 0; i < sizes.length; i += 1){
//             gaps.push(0);
//         }
//     }
//     //constructor(extents, array=null, parent=null, element=null, elementHistory=[]){
//     let panelObjects = [];
//     console.log(sizes);
//     for(let i = 0; i < sizes.length; i += 1){
//         //console.log("curValue = " + curValue);
//         //console.log("size " + i + " = " + sizes[i]);
//         let curExtents = new Utils.Extents(curValue, curValue+sizes[i], extents.yMin, extents.yMax);
//         //console.log(curExtents.xMin);
//         panelObjects.push( new PanelObject(curExtents, null, parentObject, elements[i], history))
//         //panelSlots.push(new PanelSlot(panelObject, curExtents));
//         if (i !== (sizes.length-1)){
//             curValue += sizes[i] + gaps[i];
//         }
//     }

//     return panelObjects;
// }


// function HeightPartitioner(parentObject, sizes, elements, history, gaps){
//     var extents = parentObject.extents;

//     var curValue = extents.yMin;

//     if (gaps === null){
//         gaps = [];
//         for(var i = 0; i < sizes.length; i += 1){
//             gaps.push(0);
//         }
//     }
//     //constructor(extents, array=null, parent=null, element=null, elementHistory=[]){
//     var panelObjects = [];
//     for(let i = 0; i < sizes.length; i += 1){
//         var curExtents = new Utils.Extents(extents.xMin, extents.xMax, curValue,  curValue+sizes[i]);

//         panelObjects.push( new PanelObject(curExtents, null, parentObject, elements[i], history))
//         //panelSlots.push(new PanelSlot(panelObject, curExtents));
//         if (i !== sizes.length-1){
//             curValue += sizes[i] + gaps[i];
//         }
//     }

//     return panelObjects;
// }
// //#endregion

// //#region Patterns
// function ABPatternOld(panelObject, randObj, aRange=[.3, .6], shelfOrStack=0){
//     var extents = panelObject.extents;

//     var uSize = null;
//     if (shelfOrStack === 0){
//         uSize = extents.width;
//     }
//     else {
//         uSize = extents.height;
//     }

//     var u1 = Math.round(aRange[0]*uSize);
//     var u2 = Math.round(aRange[1]*uSize);
//     var aSize = randObj.randInt(u1, u2);
//     var bSize = uSize-aSize;

//     if (shelfOrStack === 0){
//         var xMinA = extents.xMin;
//         var xMaxA = extents.xMin+aSize;
//         var yMinA = extents.yMin;
//         var yMaxA = extents.yMax;

//         var extentsA = new Utils.Extents(xMinA, xMaxA, yMinA, yMaxA);

//         var panelSlotA = new PanelSlot(panelObject, extentsA);

//         var xMinB = xMaxA+1;
//         var xMaxB = extents.xMax;
//         var yMinB = extents.yMin;
//         var yMaxB = extents.yMax;

//         var extentsB = new Utils.Extents(xMinB, xMaxB, yMinB, yMaxB);

//         var panelSlotB = new PanelSlot(panelObject, extentsB);
//     }
//     else{
//         var xMinA = extents.xMin;
//         var xMaxA = extents.xMax;
//         var yMinA = extents.yMin;
//         var yMaxA = extents.yMin+aSize;

//         var extentsA = new Utils.Extents(xMinA, xMaxA, yMinA, yMaxA);

//         var panelSlotA = new PanelSlot(panelObject, extentsA);

//         var xMinB = extents.xMin;
//         var xMaxB = extents.xMax;
//         var yMinB = yMaxA+1;
//         var yMaxB = extents.yMax;

//         var extentsB = new Utils.Extents(xMinB, xMaxB, yMinB, yMaxB);

//         var panelSlotB = new PanelSlot(panelObject, extentsB);    
//     }

//     return [panelSlotA, panelSlotB];
// }

// /**
//  * 
//  * @param {*} panelObject 
//  * @param {*} randObj 
//  * @param {*} ranges 
//  * @param {*} shelfOrStack 
//  * @param {*} gap 
//  * @returns 
//  */
// function ABPattern(panelObject, randObj=null, ranges=null, shelfOrStack=0, gap=null){
//     let aRange = [.3, .6];
//     if (ranges){
//         aRange = ranges.aRange;
//     }

//     if(!randObj){
//         randObj = new RandomWrapper();
//     }

//     let extents = panelObject.extents;

//     var uSize = null;
//     if (shelfOrStack === 0){
//         uSize = extents.width;
//     }
//     else {
//         uSize = extents.height;
//     }

//     var u1 = Math.round(aRange[0]*uSize);
//     var u2 = Math.round(aRange[1]*uSize);
//     var aSize = randObj.randInt(u1, u2);
//     var bSize = null;
//     var gaps = null;
//     if ( typeof(gap) === "number"){
//         bSize = uSize-aSize - gap;
//         gaps = [gap];
//     }
//     else{
//         bSize = uSize-aSize;
//         gaps = null;
//     }

//     var sizes = [aSize, bSize];
//     var elements = ['a', 'b'];
//     var history = panelObject.elementHistory;
//     if (shelfOrStack === 0){
//         return WidthPartitioner(panelObject, sizes, elements, history, gaps);
//     }
//     else{
//         return HeightPartitioner(panelObject, sizes, elements, history, gaps);
//     }
// }

// function ABAPattern(panelObject, randObj, ranges=null, shelfOrStack=0, gap=null){
//     let aRange = [.1, .4];
//     if(ranges){
//         aRange= ranges.aRange;
//     }

//     if(!randObj){
//         randObj = new RandomWrapper();
//     }


//     let extents = panelObject.extents;
    
//     let uSize = null;
//     if (shelfOrStack === 0){
//         uSize = extents.width;
//     }
//     else {
//         uSize = extents.height;
//     }

//     let u1 = Math.round(aRange[0]*uSize);
//     let u2 = Math.round(aRange[1]*uSize);
//     let aSize = randObj.randInt(u1, u2);
//     let bSize = null;
//     let gaps = null;
//     if ( typeof(gap) === "number"){
//         bSize = uSize-aSize*2 - gap*2;
//         gaps = [gap, gap];
//     }
//     else{
//         bSize = uSize-aSize*2;
//         gaps = null;
//     }

//     var sizes = [aSize, bSize, aSize];
//     var elements = ['a', 'b', 'a2'];
//     var history = panelObject.elementHistory;
//     if (shelfOrStack === 0){
//         return WidthPartitioner(panelObject, sizes, elements, history, gaps);
//     }
//     else{
//         return HeightPartitioner(panelObject, sizes, elements, history, gaps);
//     }
// }


// export function ABCPattern(panelObject, randObj, ranges=null, shelfOrStack=0, gap=null, necessaryPixels=3){
//     if (!ranges){
//         ranges={aRange: [.1, .4], bRange: [.1, .4]}
//     }

//     if(!randObj){
//         randObj = new RandomWrapper();
//     }
    
//     let extents = panelObject.extents;

//     let aRange = ranges.aRange;
//     let bRange = ranges.bRange;
    
//     let uSize = null;
//     if (shelfOrStack === 0){
//         uSize = extents.width;
//     }
//     else {
//         uSize = extents.height;
//     }

//     if(gap){
//         throw "Gap not yet implemented";
//     }

//     let aSize = 0;
//     let bSize = 0;
//     let cSize = 0;

//     let gaps = null;
//     let gapsTotal = 0;
//     let aU1 = Math.round(aRange[0]*uSize);
//     let aU2 = Math.round(aRange[1]*uSize);
//     let bU1 = Math.round(bRange[0]*uSize);
//     let bU2 = Math.round(bRange[1]*uSize);

//     for(let i = 0; i < 100; i += 1){
//         aSize = randObj.randInt(aU1, aU2);
//         bSize = randObj.randInt(bU1, bU2);

//         if ( (uSize - aSize - bSize - gapsTotal) >= necessaryPixels){
//             break;
//         }
//     }

//     cSize = uSize-aSize-bSize-gapsTotal;

//     var sizes = [aSize, bSize, cSize];
//     var elements = ['a', 'b', 'c'];
//     var history = panelObject.elementHistory;
//     if (shelfOrStack === 0){
//         return WidthPartitioner(panelObject, sizes, elements, history, gaps);
//     }
//     else{
//         return HeightPartitioner(panelObject, sizes, elements, history, gaps);
//     }
// }

// export function AAPattern(panelObject, randObj, ranges=null, shelfOrStack=0, gap=null){
//     let extents = panelObject.extents;

//     if(!randObj){
//         randObj = new RandomWrapper();
//     }
    
//     let uSize = null;
//     if (shelfOrStack === 0){
//         uSize = extents.width;
//     }
//     else {
//         uSize = extents.height;
//     }

//     if(gap){
//         throw "Gap not yet implemented";
//     }

//     let aSize1 = 0;
//     let aSize2 = 0;

//     if (uSize%2 === 0){
//         let size = Math.round(uSize/2);
//         aSize1 = size;
//         aSize2 = size;
//     }
//     else{
//         let size = Math.trunc(uSize/2);
//         aSize1 = size+1;
//         aSize2 = size;
//     }
    
//     let gaps = null;

//     var sizes = [aSize1, aSize2];
//     var elements = ['a', 'a2'];
//     var history = panelObject.elementHistory;
//     if (shelfOrStack === 0){
//         return WidthPartitioner(panelObject, sizes, elements, history, gaps);
//     }
//     else{
//         return HeightPartitioner(panelObject, sizes, elements, history, gaps);
//     }
// }

// //#endregion
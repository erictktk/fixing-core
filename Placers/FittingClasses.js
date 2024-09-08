//import * as Random from "../Random.js";
/*eslint no-undef: 1*/
import * as Utils from "./Utils.js";
import { PixelArray } from "eric-pixelarrayutils/PixelArray";
import { RandomWrapper } from "./Random.js";
import * as PFitting from "./PFitting.js";

/**
 * Represents an object that holds pixel data and fits elements into the defined extents.
 * PanelObject manages PixelElement by fitting and transforming it within its extents.
 */
export class PanelObject {
    /**
     * Constructs a PanelObject.
     * 
     * @param {Utils.Extents} extents - The extents defining the size of the panel.
     * @param {PixelArray} [pArray=null] - Optional PixelArray to associate with the panel.
     * @param {*} [parent=null] - Optional parent object for the panel.
     * @param {*} [element=null] - Optional element to associate with the panel.
     * @param {Array} [elementHistory=[]] - Optional history of elements associated with the panel.
     */
    constructor(extents, pArray = null, parent = null, element = null, elementHistory = []) {

        // Image data
        /** @type{PixelElement} */
        this.pixelElement = null;
        /** @type{PixelArray} */
        this.fittedPixelArray = null;

        /** @type {Utils.Extents} */
        this.extents = extents;

        this.pArray = pArray;
        this.width = this.extents.width;
        this.height = this.extents.height;

        this.xOffset = extents.xMin;
        this.yOffset = extents.yMin;

        // Tree structure
        this.parent = parent;
        this.element = element;
        this.elementHistory = elementHistory;


    }

    /**
     * Returns a new PixelArray based on panel size and offsets.
     * 
     * @returns {PixelArray}
     */
    returnPixelArray() {
        return new PixelArray(null, this.width, this.height, this.xOffset, this.yOffset);
    }

    /**
     * Returns a shrunk PixelArray with optional shrink values for x and y.
     * 
     * @param {number} [xShrink=1] - Amount to shrink from both sides on the x-axis.
     * @param {number} [yShrink=1] - Amount to shrink from both sides on the y-axis.
     * @returns {PixelArray}
     */
    returnShrunk(xShrink = 1, yShrink = 1) {
        return new PixelArray(null, this.width - xShrink * 2, this.height - yShrink * 2, this.xOffset + xShrink, this.yOffset + yShrink);
    }

    /**
     * Returns a more flexible shrink with custom start/end shrink values for x and y.
     * 
     * @param {number} [xStart=1] - Amount to shrink from the start of the x-axis.
     * @param {number} [xEnd=1] - Amount to shrink from the end of the x-axis.
     * @param {number} [yStart=1] - Amount to shrink from the start of the y-axis.
     * @param {number} [yEnd=1] - Amount to shrink from the end of the y-axis.
     * @returns {PixelArray}
     */
    returnShrunkBetter(xStart = 1, xEnd = 1, yStart = 1, yEnd = 1) {
        return new PixelArray(null, this.width - xStart - xEnd, this.height - yStart - yEnd, this.xOffset + xStart, this.yOffset + yStart);
    }

    /**
     * Fits a pixel element into the panel using simple fitting logic.
     * 
     * @param {PixelElement} pixelElement - The pixel element to fit.
     * @returns {PixelArray}
     */
    fitElementSimple(pixelElement) {
        let data = PFitting.fitElementSimple(pixelElement, this.width, this.height);
        return new PixelArray(data, this.width, this.height, this.extents.xMin, this.extents.yMin);
    }

    /**
     * Fits a PixelArray into the panel using simple fitting logic.
     * 
     * @param {PixelArray} pArray - The PixelArray to fit.
     * @returns {PixelArray}
     */
    fitElementSimplePArray(pArray) {
        let pixelElement = PixelElement.SimplePixelElement(pArray);
        let data = PFitting.fitElementSimple(pixelElement, this.width, this.height);
        return new PixelArray(data, this.width, this.height, this.extents.xMin, this.extents.yMin);
    }
}

/**
 * Represents a partitioned sheet with one or more extents.
 */
export class PartitionSheet {
    /**
     * Constructs a PartitionSheet.
     * 
     * @param {Array<Utils.Extents>} extentsArray - An array of extents.
     */
    constructor(extentsArray) {
        this.extentsArray = extentsArray;
        this.isSimple = extentsArray.length === 1;
    }
}

/**
 * Represents an element containing pixel data and optional extensions for resizing.
 * Can be used by panelobject
 */
export class PixelElement {
    /**
     * Constructs a PixelElement.
     * 
     * @param {PixelArray} pixelArray - The PixelArray associated with the element.
     * @param {(Array<number>|number)} [widthExtensions=[]] - Optional width extensions or a single extension value.
     * @param {(Array<number>|number)} [heightExtensions=[]] - Optional height extensions or a single extension value.
     * @param {*} [partitionSheets=null] - Optional partition sheets for complex structures.
     */
    constructor(pixelArray, widthExtensions = [], heightExtensions = [], partitionSheets = null) {
        /** @type {PixelArray} */
        this.pixelArray = pixelArray;
        this.width = pixelArray.width;
        this.height = pixelArray.height;
        this.widthExtensions = typeof widthExtensions === 'number' ? [widthExtensions] : widthExtensions;
        this.heightExtensions = typeof heightExtensions === 'number' ? [heightExtensions] : heightExtensions;
        this.widthLimit = null;
        this.heightLimit = null;
        this.partitionSheets = partitionSheets;
    }

    /**
     * Creates a simple PixelElement with default extensions set to half of the width and height.
     * 
     * @param {PixelArray} pixelArray - The PixelArray to base the PixelElement on.
     * @returns {PixelElement}
     */
    static SimplePixelElement(pixelArray) {
        const widthExtensions = [Math.round(pixelArray.width * 0.4999)];
        const heightExtensions = [Math.round(pixelArray.height * 0.4999)];
        return new PixelElement(pixelArray, widthExtensions, heightExtensions);
    }
}
import { GetPalette } from "./PaletteRGBaster.js";

export class Color {
  /**
   * Represents a color with RGBA values.
   * @param {number} r - Red value (0-255).
   * @param {number} g - Green value (0-255).
   * @param {number} b - Blue value (0-255).
   * @param {number} [a=255] - Alpha value (0-255, defaults to 255).
   */
  constructor(r, g, b, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * Converts the color to an RGBA string.
   * @returns {string} - RGBA string representation of the color.
   */
  toRGBString() {
    const a = this.a / 255;
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${a})`;
  }
}

/**
 * Converts an RGBA array to an RGB string.
 * @param {number[]} arr - RGBA array.
 * @returns {string} - RGB string representation.
 */
export function RGBArrToString(arr) {
  if (arr.length === 4) {
    const a = arr[3] / 255;
    return `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${a})`;
  }
}

export class PaletteFromHEX {
  /**
   * Represents a palette created from an array of HEX values.
   * @param {string[]} hexValues - Array of HEX color values.
   * @param {string} [name=null] - Name of the palette.
   */
  constructor(hexValues, name = null) {
    this.colors = [];
    this.luminances = [];
    this.name = name;

    for (let i = 0; i < hexValues.length; i += 1) {
      var result = hexToRgb(hexValues[i]);
      this.colors.push(new Color(result.r, result.g, result.b));
    }

    this.colors.sort(rgbCompareFunction);

    for (let i = 0; i < hexValues.length; i += 1) {
      var curColor = this.colors[i];
      this.luminances.push(getLuminance(curColor.r, curColor.g, curColor.b));
    }
  }
}

export class Palette {
    /**
     * Represents a palette with colors and optional luminance values.
     * @param {Array<Color>} colors - Array of Color objects.
     * @param {Array<number>} [luminances=null] - Array of luminance values corresponding to colors.
     * @param {string} [name=null] - Name of the palette.
     */
    constructor(colors, luminances = null, name = null) {
      if (luminances === null) {
        this.colors = colors;
        this.colors.sort(rgbCompareFunction);
        this.luminances = [];
        for (let i = 0; i < this.colors.length; i += 1) {
          var curColor = this.colors[i];
          this.luminances.push(getLuminance(curColor.r, curColor.g, curColor.b));
        }
      } else {
        this.colors = colors;
        this.luminances = luminances;
      }
  
      this.name = name;
    }
  
    static PaletteFromPixelArray(pixelArray) {
      const colors = GetColorsFromPixelArray(pixelArray);
      return new Palette(colors);
    }
  
    static PaletteFromArrColors(arrColors, name = null) {
      const actualColors = [];
      for (let i = 0; i < arrColors.length; i += 1) {
        actualColors.push(new Color(arrColors[i][0], arrColors[i][1], arrColors[i][2]));
      }
  
      return new Palette(actualColors, null, name);
    }
  
    static PaletteFromHEX(hexValues) {
      const colors = [];
      for (let i = 0; i < hexValues.length; i += 1) {
        let result = hexToRgb(hexValues[i]);
        colors.push(new Color(result.r, result.g, result.b));
      }
    }
  }
  
  export class UrlPalette {
    /**
     * Represents a palette obtained from a URL.
     * @param {string} url - URL to fetch the palette information.
     */
    constructor(url) {
      this.url = url;
      this.colors = null;
      this.luminances = null;
      this.counts = null;
      this.getPaletteInformation();
    }
  
    getPaletteInformation() {
      let result = GetPalette(this.url);
      this.colors = result[0];
      this.counts = result[1];
      this.luminances = result[2];
      console.log(this.colors);
    }
  }


/**
 * Converts an RGB color string to an array of RGB values.
 * @param {string} colorStr - RGB color string in the format 'rgb(r, g, b)'.
 * @returns {number[]} - Array containing RGB values.
 */
export function stringToRGB(colorStr) {
    var strArr = colorStr.split("(");
    var rgbPart = strArr[1];
    rgbPart = rgbPart.slice(0, -1);
    var rgbArr = rgbPart.split(",");
  
    var r = parseInt(rgbArr[0]);
    var g = parseInt(rgbArr[1]);
    var b = parseInt(rgbArr[2]);
    return [r, g, b];
  }
  
  /**
   * Calculate luminance from an RGB color string.
   * @param {string} colorStr - RGB color string in the format 'rgb(r, g, b)'.
   * @returns {number} - Luminance value.
   */
  function getLuminanceFromString(colorStr) {
    var rgbArr = stringToRGB(colorStr);
    return getLuminance(rgbArr[0], rgbArr[1], rgbArr[2]);
  }
  
  /**
   * Find the color in a list that has the smallest difference from the given RGB color.
   * @param {number[]} rgbArr - Array containing RGB values.
   * @param {number[][]} YUVList - List of YUV values for colors.
   * @param {string[]} colorList - List of color strings.
   * @param {boolean} [euclidean=false] - Whether to use Euclidean distance.
   * @returns {string} - Closest color string from colorList.
   */
  export function findSmallestDifference(rgbArr, YUVList, colorList, euclidean = false) {
    var yuv = YUVfromRGB(rgbArr[0], rgbArr[1], rgbArr[2]);
    var y = yuv[0];
    var u = yuv[1];
    var v = yuv[2];
  
    var minDist = 1000;
    var curDist = 1000;
    var minIndex = -1;
    for (var i = 0; i < YUVList.length; i += 1) {
      var curY = YUVList[i][0];
      var curU = YUVList[i][1];
      var curV = YUVList[i][2];
  
      if (!euclidean) {
        curDist = Math.abs(y - curY) + Math.abs(u - curU) + Math.abs(v - curV);
      } else {
        curDist = Math.sqrt(Math.pow(y - curY, 2) + Math.pow(u - curU, 2) + Math.pow(v - curV, 2));
      }
  
      if (curDist < minDist) {
        minDist = curDist;
        minIndex = i;
      }
    }
    return colorList[minIndex];
  }
  
  /**
   * Convert a palette to a list of YUV values.
   * @param {Palette} palette - The palette to convert.
   * @returns {number[][]} - List of YUV values.
   */
  export function PaletteToYUVList(palette) {
    let yuvList = [];
    for (let i = 0; i < palette.colors.length; i += 1) {
      let color = palette.colors[i];
      yuvList.push(YUVfromRGB(color.r, color.g, color.b));
    }
  
    return yuvList;
  }
  
  /**
   * Convert RGB values to YUV values.
   * @param {number} r - Red value (0-255).
   * @param {number} g - Green value (0-255).
   * @param {number} b - Blue value (0-255).
   * @returns {number[]} - Array containing YUV values.
   */
  export function YUVfromRGB(r, g, b) {
    let Y = 0.257 * r + 0.504 * g + 0.098 * b + 16;
    let U = -0.148 * r - 0.291 * g + 0.439 * b + 128;
    let V = 0.439 * r - 0.368 * g - 0.071 * b + 128;
  
    return [Y, U, V];
  }

  /**
 * Convert a value to a color based on a palette.
 * @param {Palette} palette - The palette to use.
 * @param {number} value - The value to map to a color.
 * @param {number[]} cumuList - List of cumulative values.
 * @param {string[]} colorList - List of color strings.
 * @returns {string | null} - The color string or null if not found.
 */
export function valueToColor(palette, value, cumuList, colorList) {
    if (value === 0) {
      return colorList[0];
    }
    if (value === 255) {
      return colorList[colorList.length - 1];
    }
  
    for (var i = 0; i < cumuList.length; i += 1) {
      if (value > cumuList[i] && value <= cumuList[i + 1]) {
        return colorList[i];
      }
    }
  
    return null;
  }
  
  /**
   * Calculate cumulative list based on the count of colors.
   * @param {string[]} colorList - List of color strings.
   * @returns {number[]} - List of cumulative values.
   */
  export function getCumuList(colorList) {
    var count = colorList.length;
    var arr = [0];
    var frac = 255.0 / count;
  
    for (var i = 0; i < count; i += 1) {
      arr.push(Math.floor(frac * i));
    }
  
    arr[arr.length - 1] = 255;
    return arr;
  }
  
  /**
   * Get unique colors from a pixel array.
   * @param {PixelArray} pixelArray - The pixel array to extract colors from.
   * @returns {number[][]} - List of unique colors as RGB arrays.
   */
  export function GetColorsFromPixelArray(pixelArray) {
    const width = pixelArray.width;
    const height = pixelArray.height;
  
    const colors = [];
    let r = -1;
    let g = -1;
    let b = -1;
    let a = -1;
    for (let i = 0; i < width * height * 4; i += 4) {
      r = pixelArray.arr[i];
      g = pixelArray.arr[i + 1];
      b = pixelArray.arr[i + 2];
      a = pixelArray.arr[i + 3];
      const curColor = [r, g, b, a];
  
      if (!colors.some((c) => c.join(',') === curColor.join(','))) {
        colors.push(curColor);
      }
    }
  
    return colors;
  }
  
  /**
   * Calculate luminance from RGB values.
   * @param {number} r - Red value (0-255).
   * @param {number} g - Green value (0-255).
   * @param {number} b - Blue value (0-255).
   * @returns {number} - Luminance value.
   */
  export function getLuminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
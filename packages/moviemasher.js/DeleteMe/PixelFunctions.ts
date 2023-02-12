import { Value } from "../src/declarations";
import { Rgba, Rgb, RgbObject } from "../src/Helpers/Color/Color";
import { Point } from "../src/Utility/Point";
import { Size } from "../src/Utility/Size";
import { isPositive } from "../src/Utility/Is";
import { colorMixRbga } from "../src/Helpers/Color/ColorFunctions";
import { colorToRgba, colorRgbToHex } from "../src";
export interface Pixels extends Uint8ClampedArray {}

interface AlphaColor {
  color: string
  alpha: number
}


enum Color {
  Transparent = '#00000000',
  Black = '#000000',
  White = '#FFFFFF',
  WhiteTransparent = '#FFFFFF00',
  BlackTransparent = '#00000000',
  WhiteOpaque = '#FFFFFFFF',
  BlackOpaque = '#000000FF',
  Green = '#00FF00',
  Yellow = '#FFFF00',
  Red = '#FF0000',
  Blue = '#0000FF',
}


export interface Yuv {
  y: number
  u: number
  v: number
}


interface YuvObject {
  y: Value
  u: Value
  v: Value
}
const colorFromRgba = (object: Rgba): string => {
  const { r, g, b, a} = object
  return `rgb(${r},${g},${b},${a})`
}

const rgbValue = (value : string | number) : number => (
  Math.min(255, Math.max(0, Math.floor(Number(value))))
)

// const Colors = Object.values(Color)
const rgbNumeric = (rgb : RgbObject) : Rgb => ({
  r: rgbValue(rgb.r), g: rgbValue(rgb.g), b: rgbValue(rgb.b)
})



const colorName = (color: string): string => {
  for (const entry of Object.entries(Color)) {
    const [key, value] = entry
    if (value === color) return key
  }
  return ''
}


 const yuvNumeric = (rgb : YuvObject) : Yuv => ({
  y: rgbValue(rgb.y), u: rgbValue(rgb.u), v: rgbValue(rgb.v)
})


const colorAlphaColor = (value: string): AlphaColor => {
  const toRgba = colorToRgba(value)
  return { alpha: toRgba.a, color: colorRgbToHex(toRgba) }
}

const colorYuvToRgb = (yuv : YuvObject) : Rgb => {
  const floats = yuvNumeric(yuv)
  return rgbNumeric({
    r: floats.y + 1.4075 * (floats.v - 128),
    g: floats.y - 0.3455 * (floats.u - 128) - (0.7169 * (floats.v - 128)),
    b: floats.y + 1.7790 * (floats.u - 128)
  })
}


 const colorYuvBlend = (yuvs : YuvObject[], yuv : YuvObject, similarity : number, blend : number) : number => {
  let diff = 0.0
  const blendYuv = yuvNumeric(yuv)
  yuvs.forEach(yuvObject => {
    const numericYuv = yuvNumeric(yuvObject)
    const du = numericYuv.u - blendYuv.u
    const dv = numericYuv.v - blendYuv.v
    diff += Math.sqrt((du * du + dv * dv) / (255.0 * 255.0))
  })
  diff /= yuvs.length

  if (blend > 0.0001) {
    return Math.min(1.0, Math.max(0.0, (diff - similarity) / blend)) * 255.0
  }
  return (diff > similarity) ? 255 : 0
}

 const colorYuvDifference = (fromYuv: Yuv, toYuv: Yuv, similarity: number, blend: number) => {
  const du = fromYuv.u - toYuv.u
  const dv = fromYuv.v - toYuv.v
  const diff = Math.sqrt((du * du + dv * dv) / (255.0 * 255.0))

  if (blend > 0.0001) {
    return Math.min(1.0, Math.max(0.0, (diff - similarity) / blend)) * 255.0
  }
  return (diff > similarity) ? 255 : 0
}




const colorRgbToYuv = (rgb : RgbObject) : Yuv => {
  const ints = rgbNumeric(rgb)
  return {
    y: ints.r * 0.299000 + ints.g * 0.587000 + ints.b * 0.114000,
    u: ints.r * -0.168736 + ints.g * -0.331264 + ints.b * 0.500000 + 128,
    v: ints.r * 0.500000 + ints.g * -0.418688 + ints.b * -0.081312 + 128
  }
}
 const colorRgbaTransparent: Rgba = { ...colorRgb, a: 0.0 }

const pixelFromPoint = (pt: Point, width: number) => pt.y * width + pt.x;
const pixelToPoint = (index: number, width: number): Point => (
  { x: index % width, y: Math.floor(index / width) }
);
const pixelToIndex = (pixel: number) => pixel * 4;
const pixelRgbaAtIndex = (index: number, pixels: Pixels): Rgba => (
  {
    r: pixels[index],
    g: pixels[index + 1],
    b: pixels[index + 2],
    a: pixels[index + 3],
  }
);
const pixelRgba = (pixel: number, data: Pixels) => pixelRgbaAtIndex(pixelToIndex(pixel), data);
const pixelSafe = (pixel: number, offsetPoint: Point, size: Size) => {
  const { x, y } = offsetPoint;
  const { width, height } = size;
  const pt = pixelToPoint(pixel, width);
  pt.x = Math.max(0, Math.min(width - 1, pt.x + x));
  pt.y = Math.max(0, Math.min(height - 1, pt.y + y));
  return pixelFromPoint(pt, width);
};
const pixelNeighboringPixels = (pixel: number, size: Size): number[] => {
  const depth = 3;
  const pixels: number[] = [];
  const halfSize = Math.floor(depth / 2);
  for (let y = 0; y < depth; y += 1) {
    for (let x = 0; x < depth; x += 1) {
      const offsetPoint = { x: x - halfSize, y: y - halfSize };
      pixels.push(pixelSafe(pixel, offsetPoint, size));
    }
  }
  return pixels;
};
const pixelNeighboringRgbas = (pixel: number, data: Pixels, size: Size): Rgba[] => (
  pixelNeighboringPixels(pixel, size).map(p => pixelRgba(p, data))
);
const pixelsRemoveRgba = (pixels: Uint8ClampedArray, size: Size, rgb: Rgb, similarity = 0, blend = 0, accurate = false) => {
  pixelsReplaceRgba(pixels, size, rgb, colorRgbaTransparent, similarity, blend);
};
const pixelsReplaceRgba = (pixels: Uint8ClampedArray, size: Size, find: Rgb, replace: Rgba, similarity = 0, blend = 0, accurate = false) => {
  const yuv = colorRgbToYuv(find);
  let index = pixels.length / 4;
  while (index--) {
    const pixels_offset = index * 4;
    const rgbaAtIndex = pixelRgbaAtIndex(pixels_offset, pixels);
    if (isPositive(rgbaAtIndex.a)) {

      const rgbaAsYuv = colorRgbToYuv(rgbaAtIndex);
      const difference = accurate ? colorYuvBlend(yuvsFromPixelsAccurate(pixels, index, size), yuv, similarity, blend) : colorYuvDifference(rgbaAsYuv, yuv, similarity, blend);
      const mixed = colorMixRbga(rgbaAtIndex, replace, difference);
      pixels[pixels_offset + 3] = mixed.a;
      if (mixed.a) {
        pixels[pixels_offset] = mixed.r;
        pixels[pixels_offset + 1] = mixed.g;
        pixels[pixels_offset + 2] = mixed.b;
      }
    }
  }
};
const yuvsFromPixelsAccurate = (pixels: Pixels, index: number, size: Size): Yuv[] => {
  // console.log(this.constructor.name, "yuvsFromPixelsAccurate")
  return pixelNeighboringRgbas(index * 4, pixels, size).map(rgb => colorRgbToYuv(rgb));

};

import { Rgb, RgbObject, Yuv, YuvObject } from "../declarations"

const rgbValue = (value : string | number) : number => (
  Math.min(255, Math.max(0, Math.floor(Number(value))))
)

const rgbNumeric = (rgb : RgbObject) : Rgb => ({
  r: rgbValue(rgb.r), g: rgbValue(rgb.g), b: rgbValue(rgb.b)
})

const yuvNumeric = (rgb : YuvObject) : Yuv => ({
  y: rgbValue(rgb.y), u: rgbValue(rgb.u), v: rgbValue(rgb.v)
})

const yuv2rgb = (yuv : YuvObject) : Rgb => {
  const floats = yuvNumeric(yuv)
  return rgbNumeric({
    r: floats.y + 1.4075 * (floats.v - 128),
    g: floats.y - 0.3455 * (floats.u - 128) - (0.7169 * (floats.v - 128)),
    b: floats.y + 1.7790 * (floats.u - 128)
  })
}

const rgb2hex = (rgb : RgbObject) : string => {
  let r = rgb.r.toString(16);
  let g = rgb.g.toString(16);
  let b = rgb.b.toString(16);
  if (r.length < 2) r = `0${r}`;
  if (g.length < 2) g = `0${g}`;
  if (b.length < 2) b = `0${b}`;
  return `#${r}${g}${b}`;
}

const yuvBlend = (yuvs : YuvObject[], yuv : YuvObject, match : number, blend : number) : number => {
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
    return Math.min(1.0, Math.max(0.0, (diff - match) / blend)) * 255.0
  }
  return (diff > match) ? 255 : 0
}

const rgb2yuv = (rgb : RgbObject) : Yuv => {
  const ints = rgbNumeric(rgb)
  return {
    y: ints.r * 0.299000 + ints.g * 0.587000 + ints.b * 0.114000,
    u: ints.r * -0.168736 + ints.g * -0.331264 + ints.b * 0.500000 + 128,
    v: ints.r * 0.500000 + ints.g * -0.418688 + ints.b * -0.081312 + 128
  }
}

const Color = {
  yuvBlend,
  rgb2yuv,
  yuv2rgb,
  rgb2hex, // unused after 4.1 refactor, but perhaps needed?
}

export { Color }

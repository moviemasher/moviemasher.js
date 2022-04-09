import { ModularGraphFilter, ValueObject, VisibleContextData } from "../../../declarations"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, GraphType } from "../../../Setup/Enums"
import { Parameter } from "../../../Setup/Parameter"

export type Numbers = number[]
export type NumbersOrUndefined = Numbers | undefined
export type NumberOrUndefined = number | undefined

export type ConvolutionRgba = 'r' | 'b' | 'g' | 'a'
export type ConvolutionChannel = 'combined' | ConvolutionRgba

export type ConvolutionRgbaObject = {
  [index in ConvolutionRgba]: number
}

export type ConvolutionRgbasObject = {
  [index in ConvolutionRgba]: Numbers
}

export interface ConvolutionNumberObject extends ConvolutionRgbaObject {
  combined?: number
}

export interface ConvolutionNumbersObject extends ConvolutionRgbasObject {
  combined?: Numbers
}

export type StringOrUndefined = string | undefined

export type ConvolutionStringObject = {
  [index in ConvolutionChannel]?: StringOrUndefined
}

export type ConvolutionKey = 'bias' | 'multiplier'
export type ConvolutionNumbersKey = 'matrix'

export interface ConvolutionObject {
  matrix: ConvolutionNumbersObject
  bias: ConvolutionNumberObject
  multiplier: ConvolutionNumberObject
}

const RGBA = 'rgba'
const RGBAS = RGBA.split('').map(c => c as ConvolutionRgba)

const matrixFromString = (string?: string): Numbers => {
  const definedString = string || "0 0 0 0 1 0 0 0 0"
  return definedString.split(',').map(component => parseInt(component.trim()))
}

const biasFromString = (string?: string): number => {
  if (!string?.length) return 0.0

  return parseFloat(string.trim())
}

const multiplierFromString = (string?: string): number => {
  if (!string?.length) return 1.0

  if (string.includes('/')) {
    const components = string.split('/').map(component => parseFloat(component.trim()))
    const [a, b] = components
    return a / b
  }
  return parseFloat(string.trim())
}

const fromCombined = (combined: string): ConvolutionStringObject => {
  return { combined, r: combined, g: combined, b: combined, a: combined }
}

const numbersFromCombined = (combined: Numbers): ConvolutionNumbersObject => {
  return { combined, r: combined, g: combined, b: combined, a: combined }
}

const numberFromCombined = (combined: number): ConvolutionNumberObject => {
  return { combined, r: combined, g: combined, b: combined, a: combined }
}

const convolutionStringObject = (evaluator: Evaluator, key: ConvolutionKey | ConvolutionNumbersKey): ConvolutionStringObject => {
  const combined = String(evaluator.parameterValue(key))
  if (combined.length) return fromCombined(combined)

  const rgbaValues: ConvolutionStringObject = Object.fromEntries(RGBAS.map(rgba => {
    return [rgba, String(evaluator.parameterValue(`${key}${rgba}`))]
  }))
  const [rKey, ...gbaKeys] = RGBAS
  const first = rgbaValues[rKey]!
  const identical = gbaKeys.every(gbaKey => first === rgbaValues[gbaKey])
  if (identical) {
    return fromCombined(first)
  }
  return rgbaValues
}

const convolutionMatrixObject = (stringObject: ConvolutionStringObject): ConvolutionNumbersObject => {
  if (stringObject.combined?.length) {
    return numbersFromCombined(matrixFromString(stringObject.combined))
  }
  return {
    r: matrixFromString(stringObject.r),
    g: matrixFromString(stringObject.g),
    b: matrixFromString(stringObject.b),
    a: matrixFromString(stringObject.a),
  }
}

const convolutionBiasObject = (stringObject: ConvolutionStringObject): ConvolutionNumberObject => {
  if (stringObject.combined?.length) {
    return numberFromCombined(biasFromString(stringObject.combined))
  }
  return {
    r: biasFromString(stringObject.r),
    g: biasFromString(stringObject.g),
    b: biasFromString(stringObject.b),
    a: biasFromString(stringObject.a),
  }
}

const convolutionMultiplierObject = (stringObject: ConvolutionStringObject): ConvolutionNumberObject => {
  if (stringObject.combined?.length) {
    return numberFromCombined(multiplierFromString(stringObject.combined))
  }
  return {
    r: multiplierFromString(stringObject.r),
    g: multiplierFromString(stringObject.g),
    b: multiplierFromString(stringObject.b),
    a: multiplierFromString(stringObject.a),
  }
}

const parse = (evaluator: Evaluator) => {
  const matrixObject = convolutionStringObject(evaluator, 'matrix')
  const multiplierObject = convolutionStringObject(evaluator, 'multiplier')
  const matrix: ConvolutionNumbersObject = convolutionMatrixObject(matrixObject)
  const multiplier: ConvolutionNumberObject = convolutionMultiplierObject(multiplierObject)
  const bias = matrixObject.combined ? numberFromCombined(0.0) : convolutionBiasObject(convolutionStringObject(evaluator, 'bias'))
  const result: ConvolutionObject = { multiplier, matrix, bias }
  return result
}

const optionsFromObject =(convolutionObject: ConvolutionObject): ValueObject => {
  const valueObject: ValueObject = {}
  RGBAS.forEach((channel, index) => {
    const multiplier = convolutionObject.multiplier[channel]
    const matrix = convolutionObject.matrix[channel]
    valueObject[`${index}m`] = matrix.join(' ')
    valueObject[`${index}rdiv`] = multiplier
    valueObject[`${index}bias`] = convolutionObject.bias[channel]
  })
  return valueObject
}

/**
 * @category Filter
 */
export class ConvolutionOpenclFilter extends FilterDefinitionClass {
  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const { graphType, preloading } = evaluator
    const graphFilter: ModularGraphFilter = {
      inputs: [], filter: this.ffmpegFilter, options: {}
    }
    if (!preloading) {
      const object = parse(evaluator)
      if (graphType === GraphType.Canvas) {
        const { visibleContext, createVisibleContext } = evaluator
        const { imageData: inputImageData} = visibleContext
        const { imageData: outputImageData } = createVisibleContext

        this.convolve(object, inputImageData, outputImageData)
        createVisibleContext.drawImageData(outputImageData)
        evaluator.visibleContext = createVisibleContext
      } else graphFilter.options = optionsFromObject(object)
    }
    return graphFilter
  }

  convolve(object: ConvolutionObject, pixels: VisibleContextData, output: VisibleContextData) {
    const { multiplier, bias, matrix } = object
    const side = Math.round(Math.sqrt(matrix.a.length))
    const halfSide = Math.floor(side / 2)
    const src = pixels.data
    const dst = output.data
    const sw = pixels.width
    const sh = pixels.height
    // pad output by the convolution matrix
    const w = sw
    const h = sh

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        // const sy = y
        // const sx = x
        const dstOff = (y * w + x) * 4
        // calculate weighed sum of source image pixels under convolution matrix
        let r = 0, g = 0, b = 0, a = 0
        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            const scy = y + cy - halfSide
            const scx = x + cx - halfSide
            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              const srcOff = (scy * sw + scx) * 4
              const weightsIndex = cy * side + cx
              r += src[srcOff] * matrix.r[weightsIndex]
              g += src[srcOff + 1] * matrix.g[weightsIndex]
              b += src[srcOff + 2] * matrix.b[weightsIndex]
              a += src[srcOff + 3] * matrix.a[weightsIndex]
            }
          }
        }
        dst[dstOff] = Math.floor(r * multiplier.r + bias.r + 0.5)
        dst[dstOff + 1] = Math.floor(g * multiplier.g + bias.g + 0.5)
        dst[dstOff + 2] = Math.floor(b * multiplier.b + bias.b + 0.5)
        dst[dstOff + 3] = Math.floor(a * multiplier.a + bias.a + 0.5)
      }
    }
  }

  parameters: Parameter[] = [
    new Parameter({ "name": "matrix", "value": "", dataType: DataType.String }),
    new Parameter({ "name": "matrixr", "value": "0 0 0 0 1 0 0 0 0", dataType: DataType.String }),
    new Parameter({ "name": "matrixg", "value": "0 0 0 0 1 0 0 0 0", dataType: DataType.String }),
    new Parameter({ "name": "matrixb", "value": "0 0 0 0 1 0 0 0 0", dataType: DataType.String }),
    new Parameter({ "name": "matrixa", "value": "0 0 0 0 1 0 0 0 0", dataType: DataType.String }),

    new Parameter({ "name": "bias", "value": "", dataType: DataType.String }),
    new Parameter({ "name": "biasr", "value": "0", dataType: DataType.String }),
    new Parameter({ "name": "biasg", "value": "0", dataType: DataType.String }),
    new Parameter({ "name": "biasb", "value": "0", dataType: DataType.String }),
    new Parameter({ "name": "biasa", "value": "0", dataType: DataType.String }),

    new Parameter({ "name": "multiplier", "value": "", dataType: DataType.String }),
    new Parameter({ "name": "multiplierr", "value": "1", dataType: DataType.String }),
    new Parameter({ "name": "multiplierg", "value": "1", dataType: DataType.String }),
    new Parameter({ "name": "multiplierb", "value": "1", dataType: DataType.String }),
    new Parameter({ "name": "multipliera", "value": "1", dataType: DataType.String }),
  ]
}

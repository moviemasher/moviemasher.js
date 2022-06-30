import { ScalarObject, SvgFilters, ValueObject } from "../../declarations"
import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { NamespaceSvg } from "../../Setup/Constants"
import { propertyInstance } from "../../Setup/Property"
import { assertPopulatedString, isAboveZero, isObject } from "../../Utility/Is"
import { idGenerate } from "../../Utility/Id"


/**
 * @category Filter
 */
 export class ConvolutionFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, tweenable: true, name: "bias",
      defaultValue: 0.0, min: 0.0, max: 100.0, step: 0.01
    }))
    this.properties.push(propertyInstance({
      custom: true, name: "matrix", defaultValue: "0 0 0 0 1 0 0 0 0",
    }))
    this.properties.push(propertyInstance({
      custom: true, tweenable: true, name: "multiplier",
      defaultValue: 1.0, min: 0.0, max: 100.0, step: 0.01
    }))
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const { chainInput, filterInput, filter, duration } = args
    assertPopulatedString(chainInput, 'chainInput')
    assertPopulatedString(filterInput, 'filterInput')  
    const commandFilters:CommandFilters = []
    const values = filter.scalarObject(!!duration) 
    assertConvolutionServerFilter(values)
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter,
      options: optionsFromObject(parse(values)), 
      outputs: [idGenerate(ffmpegFilter)]
    }
    commandFilters.push(commandFilter)
    return commandFilters
  }

  filterDefinitionSvgFilters(valueObject: ScalarObject): SvgFilters {
    assertConvolutionServerFilter(valueObject)
    const {matrix, bias, multiplier } = valueObject
    
    const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'feConvolveMatrix')
    filterElement.setAttribute('kernelMatrix', String(matrix))
    filterElement.setAttribute('bias', String(bias))
    if (isAboveZero(multiplier)) filterElement.setAttribute('divisor', String(multiplier))
    return [filterElement]
  }
}

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

export interface ConvolutionServerFilter extends ValueObject {
  matrix: string
  bias: string
  multiplier: string
}

export const isConvolutionServerFilter = (value: any): value is ConvolutionServerFilter => {
  return isObject(value) && "matrix" in value && "bias" in value && "multiplier" in value
}
export function assertConvolutionServerFilter(value: any): asserts value is ConvolutionServerFilter {
  if (!isConvolutionServerFilter(value)) throw new Error("expected ConvolutionServerFilter")
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

const convolutionStringObject = (combined: string): ConvolutionStringObject => {
  assertPopulatedString(combined)

  return fromCombined(combined)
}

const convolutionMatrixObject = (stringObject: ConvolutionStringObject): ConvolutionNumbersObject => {
  const { combined } = stringObject
  assertPopulatedString(combined)

  return numbersFromCombined(matrixFromString(stringObject.combined))
}

const convolutionBiasObject = (stringObject: ConvolutionStringObject): ConvolutionNumberObject => {
  const { combined } = stringObject
  assertPopulatedString(combined)

  return numberFromCombined(biasFromString(stringObject.combined))
}

const convolutionMultiplierObject = (stringObject: ConvolutionStringObject): ConvolutionNumberObject => {
  const { combined } = stringObject
  assertPopulatedString(combined)

  return numberFromCombined(multiplierFromString(stringObject.combined))
}

const parse = (convolutionObject: ConvolutionServerFilter) => {
  const matrixObject = convolutionStringObject(convolutionObject.matrix)
  const multiplierObject = convolutionStringObject(convolutionObject.multiplier)
  const matrix: ConvolutionNumbersObject = convolutionMatrixObject(matrixObject)
  const multiplier: ConvolutionNumberObject = convolutionMultiplierObject(multiplierObject)
  const bias = matrixObject.combined ? numberFromCombined(0.0) : convolutionBiasObject(convolutionStringObject(convolutionObject.bias))
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


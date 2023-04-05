import { Numbers, ScalarRecord, StringRecord, ValueRecord } from '../../../Types/Core.js'
import { SvgFilters } from '../../../Helpers/Svg/Svg.js'
import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from '../../../Base/Code.js'
import { FilterDefinitionClass } from '../FilterDefinitionClass.js'
import { propertyInstance } from '../../../Setup/Property.js'
import { assertPopulatedString, isAboveZero, isObject } from '../../../Utility/Is.js'
import { idGenerate } from '../../../Utility/Id.js'
import { colorRgbaKeys } from '../../../Helpers/Color/ColorConstants.js'
import { svgFilter } from '../../../Helpers/Svg/SvgFunctions.js'
import { FilterDefinitionObject } from '../Filter.js'
import { CommaChar } from '../../../Setup/Constants.js'


/**
 * @category Filter
 */
 export class ConvolutionFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      custom: true, name: 'bias',
      defaultValue: 0.0, min: 0.0, max: 100.0, step: 0.01
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'matrix', defaultValue: '0 0 0 0 1 0 0 0 0',
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'multiplier',
      defaultValue: 1.0, min: 0.0, max: 100.0, step: 0.01
    }))
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const { filterInput, filter, duration } = args
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

  filterDefinitionSvgFilter(valueObject: ScalarRecord): SvgFilters {
    assertConvolutionServerFilter(valueObject)
    const { matrix, bias, multiplier } = valueObject
    const object: StringRecord = { 
      filter: 'feConvolveMatrix',
      kernelMatrix: String(matrix),
      bias: String(bias)
    }
    if (isAboveZero(multiplier)) object.divisor = String(multiplier)
    // console.log(this.constructor.name, 'filterDefinitionSvgFilter', object)
    return [svgFilter(object)]
  }
}


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

export interface ConvolutionServerFilter extends ValueRecord {
  matrix: string
  bias: string
  multiplier: string
}

export const isConvolutionServerFilter = (value: any): value is ConvolutionServerFilter => {
  return isObject(value) && 'matrix' in value && 'bias' in value && 'multiplier' in value
}
export function assertConvolutionServerFilter(value: any): asserts value is ConvolutionServerFilter {
  if (!isConvolutionServerFilter(value)) throw new Error('expected ConvolutionServerFilter')
}


const matrixFromString = (string?: string): Numbers => {
  const definedString = string || '0 0 0 0 1 0 0 0 0'
  return definedString.split(CommaChar).map(component => parseInt(component.trim()))
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

const convolutionStringObject = (combined: any): ConvolutionStringObject => {
  return fromCombined(String(combined))
}

const convolutionMatrixObject = (stringObject: ConvolutionStringObject): ConvolutionNumbersObject => {
  const { combined } = stringObject
  return numbersFromCombined(matrixFromString(String(combined)))
}

const convolutionBiasObject = (stringObject: ConvolutionStringObject): ConvolutionNumberObject => {
  const { combined } = stringObject
  return numberFromCombined(biasFromString(String(combined)))
}

const convolutionMultiplierObject = (stringObject: ConvolutionStringObject): ConvolutionNumberObject => {
  const { combined } = stringObject
  return numberFromCombined(multiplierFromString(String(combined)))
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

const optionsFromObject =(convolutionObject: ConvolutionObject): ValueRecord => {
  const valueObject: ValueRecord = {}
  colorRgbaKeys.map(c => c as ConvolutionRgba).forEach((channel, index) => {
    const multiplier = convolutionObject.multiplier[channel]
    const matrix = convolutionObject.matrix[channel]
    valueObject[`${index}m`] = matrix.join(' ')
    valueObject[`${index}rdiv`] = multiplier
    valueObject[`${index}bias`] = convolutionObject.bias[channel]
  })
  return valueObject
}


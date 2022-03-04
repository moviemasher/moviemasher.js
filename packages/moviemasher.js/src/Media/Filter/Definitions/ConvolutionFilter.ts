import { VisibleContext } from "../../../Context"
import { UnknownObject, ValueObject } from "../../../declarations"
import { Evaluator } from "../../../Helpers/Evaluator"
import { pixelNeighboringRgbas } from "../../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinition"
import { Errors } from "../../../Setup/Errors"
import { Parameter } from "../../../Setup"

const RBGA = 'rgba'

const parse = (evaluated : ValueObject) => {
  const result : Record<string, UnknownObject> = { bias: {}, rdiv: {}, matrix: {} }
  RBGA.split('').forEach((channel, index) => {
    const matrixString = <string> evaluated[`${index}m`]
    const matrix = matrixString.split(' ').map((i : string) => parseInt(i))
    result.matrix[channel] = matrix
    result.rdiv[channel] = evaluated[`${index}rdiv`] || 1
    if (String(result.rdiv[channel]).includes('/')) {
      const array = String(result.rdiv[channel]).split('/')
      result.rdiv[channel] = parseFloat(array[0]) / parseFloat(array[1])
    } else result.rdiv[channel] = parseFloat(String(result.rdiv[channel]))
    result.bias[channel] = evaluated[`${index}bias`] || 0
  })
  // console.log(ConvolutionFilter.name, "parse", evaluated, result)
  return result
}

/**
 * @category Filter
 */
class ConvolutionFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator) : VisibleContext {
    const options = parse(evaluator.valueObject)
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const { size } = context
    const { width, height } = size
    const input = context.imageData
    // TODO: figure out if we actually need fresh data??
    const output = context.imageDataFresh
    const inputData = input.data
    const outputData = output.data
    const area = width * height
    for (let pixel = 0; pixel < area; pixel += 1) {
      const rgbas = pixelNeighboringRgbas(pixel, inputData, size)
      RBGA.split('').forEach((channel, index) => {
        const rdiv = <number> options.rdiv[channel]
        const matrix = <number[]> options.matrix[channel]
        const bias = <number> options.bias[channel]
        let sum = 0
        for (let y = 0; y < 9; y += 1) sum += rgbas[y][channel] * matrix[y]

        sum = Math.floor(sum * rdiv + bias + 0.5)
        outputData[pixel * 4 + index] = sum
      })
    }
    context.drawImageData(output)
    return context
  }

  parameters: Parameter[] = [
    new Parameter({ "name": "0m", "value": "1 1 1 1 1 1 1 1 1" }),
    new Parameter({ "name": "1m", "value": "1 1 1 1 1 1 1 1 1" }),
    new Parameter({ "name": "2m", "value": "1 1 1 1 1 1 1 1 1" }),
    new Parameter({ "name": "3m", "value": "1 1 1 1 1 1 1 1 1" }),
    new Parameter({ "name": "0rdiv", "value": "1/9" }),
    new Parameter({ "name": "1rdiv", "value": "1/9" }),
    new Parameter({ "name": "2rdiv", "value": "1/9" }),
    new Parameter({ "name": "3rdiv", "value": "1/9" }),
  ]
}

export { ConvolutionFilter }

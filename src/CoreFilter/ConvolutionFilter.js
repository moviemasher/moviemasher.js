import { Pixel } from "../Utilities"
import { CoreFilter } from "./CoreFilter"

const RBGA = 'rgba'

const parse = (evaluated) => {
  const result = { bias: {}, rdiv: {}, matrix: {} }
  RBGA.split('').forEach((channel, index) => {
    const matrix = evaluated[`${index}m`].split(' ').map(i => parseInt(i))
    result.matrix[channel] = matrix
    result.rdiv[channel] = evaluated[`${index}rdiv`] || 1
    if (String(result.rdiv[channel]).includes('/')) {
      const array = result.rdiv[channel].split('/')
      result.rdiv[channel] = parseFloat(array[0]) / parseFloat(array[1])
    } else result.rdiv[channel] = parseFloat(result.rdiv[channel])
    result.bias[channel] = evaluated[`${index}bias`] || 0
  })
  // console.log(ConvolutionFilter.name, "parse", evaluated, result)
  return result
  
}

const matrix3 = (options, inputData, outputDdata, width, height) => {
  const area = width * height;
  for (let pixel = 0; pixel < area; pixel++) {
    const rgbs = Pixel.rgbs(pixel, inputData, width, height)
    RBGA.split('').forEach((channel, index) => {
      const rdiv = options.rdiv[channel]
      const matrix = options.matrix[channel]
      const bias = options.bias[channel]
      let sum = 0
      for (let y = 0; y < 9; y++) sum += rgbs[y][channel] * matrix[y]
      
      sum = Math.floor(sum * rdiv + bias + 0.5)
      outputDdata[pixel * 4 + index] = sum
    })
  }
}

class ConvolutionFilter extends CoreFilter {
 draw(evaluator, evaluated) {
    const options = parse(evaluated)
    const context = evaluator.context
    const canvas = context.canvas
    const { width, height } = canvas
    const input = context.getImageData(0, 0, width, height)
    const output = context.createImageData(width, height)
    matrix3(options, input.data, output.data, width, height)
    context.putImageData(output, 0, 0)
    return context
  }
}

const ConvolutionFilterInstance = new ConvolutionFilter
export { ConvolutionFilterInstance as ConvolutionFilter }
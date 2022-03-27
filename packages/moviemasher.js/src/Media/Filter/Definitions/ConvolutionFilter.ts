import { ModularGraphFilter, UnknownObject } from "../../../declarations"
import { Evaluator } from "../../../Helpers/Evaluator"
import { pixelNeighboringRgbas } from "../../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinition"
import { DataType, GraphType, Parameter } from "../../../Setup"

const RBGA = 'rgba'

const parse = (evaluator: Evaluator) => {
  const result : Record<string, UnknownObject> = { bias: {}, rdiv: {}, matrix: {} }
  RBGA.split('').forEach((channel, index) => {
    const matrixString = String(evaluator.parameterValue(`${index}m`)) //String(evaluated[])
    const matrix = matrixString.split(' ').map((i : string) => parseInt(i))//
    result.matrix[channel] = matrix
    result.rdiv[channel] = evaluator.parameterValue(`${index}rdiv`) || 1
    if (String(result.rdiv[channel]).includes('/')) {
      const array = String(result.rdiv[channel]).split('/')
      const rdiv = parseFloat(array[0]) / parseFloat(array[1])
      result.rdiv[channel] = rdiv
    } else result.rdiv[channel] = parseFloat(String(result.rdiv[channel]))
    result.bias[channel] = evaluator.parameterNumber(`${index}bias`)
  })
  // console.log(ConvolutionFilter.name, "parse", result)
  return result
}

/**
 * @category Filter
 */
class ConvolutionFilter extends FilterDefinitionClass {
  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const { graphType, preloading } = evaluator
    const graphFilter: ModularGraphFilter = {
      inputs: [], filter: this.ffmpegFilter, options: {}
    }
    if (!preloading) {
      if (graphType === GraphType.Canvas) {
        const options = parse(evaluator)
        const { visibleContext, createVisibleContext } = evaluator
        const { size } = visibleContext
        const { width, height } = size
        const { imageData: inputImageData} = visibleContext
        const { imageData: outputImageData } = createVisibleContext
        const { data: inputData } = inputImageData
        const { data: outputData } = outputImageData

        const area = width * height
        for (let pixel = 0; pixel < area; pixel += 1) {
          const rgbas = pixelNeighboringRgbas(pixel, inputData, size)
          RBGA.split('').forEach((channel, index) => {
            const rdiv = options.rdiv[channel] as number
            const matrix = options.matrix[channel] as number[]
            const bias = options.bias[channel] as number
            let sum = 0
            for (let y = 0; y < 9; y += 1) sum += rgbas[y][channel] * matrix[y]
            sum = Math.floor(sum * rdiv + bias + 0.5)
            outputData[pixel * 4 + index] = sum
          })
        }
        createVisibleContext.drawImageData(outputImageData)
        evaluator.visibleContext = createVisibleContext
      } else graphFilter.options = evaluator.parameterValues
    }
    return graphFilter
  }

  parameters: Parameter[] = [
    new Parameter({ "name": "0m", "value": "1 1 1 1 1 1 1 1 1", dataType: DataType.String }),
    new Parameter({ "name": "1m", "value": "1 1 1 1 1 1 1 1 1", dataType: DataType.String }),
    new Parameter({ "name": "2m", "value": "1 1 1 1 1 1 1 1 1", dataType: DataType.String }),
    new Parameter({ "name": "3m", "value": "1 1 1 1 1 1 1 1 1", dataType: DataType.String }),

    new Parameter({ "name": "0bias", "value": 0, dataType: DataType.Number }),
    new Parameter({ "name": "1bias", "value": 0, dataType: DataType.Number }),
    new Parameter({ "name": "2bias", "value": 0, dataType: DataType.Number }),
    new Parameter({ "name": "3bias", "value": 0, dataType: DataType.Number }),

    new Parameter({ "name": "0rdiv", "value": "1", dataType: DataType.String }),
    new Parameter({ "name": "1rdiv", "value": "1", dataType: DataType.String }),
    new Parameter({ "name": "2rdiv", "value": "1", dataType: DataType.String }),
    new Parameter({ "name": "3rdiv", "value": "1", dataType: DataType.String }),
  ]
}

export { ConvolutionFilter }

import { VisibleContext } from "../../../Context/VisibleContext"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, Parameter } from "../../../Setup"

/**
 * @category Filter
 */
const ColorChannelMixerFilterKeys = 'rgba'.split('').flatMap(c => 'rgba'.split('').map(d => `${c}${d}`))

class ColorChannelMixerFilter extends FilterDefinitionClass {
  protected override drawFilterDefinition(evaluator: Evaluator): VisibleContext {

    const map = Object.fromEntries(ColorChannelMixerFilterKeys.map(key =>
      [key, evaluator.parameterNumber(key)]
    ))

    // console.log("ColorChannelMixerFilter", map)
    const { visibleContext, createVisibleContext } = evaluator
    const { size } = visibleContext
    const { width, height } = size

    const { imageData: inputImageData} = visibleContext

    // TODO: figure out if we actually need fresh data??
    const { imageData: outputImageData } = createVisibleContext
    const { data: inputData } = inputImageData
    const { data: outputData } = outputImageData

    const area = width * height * 4
    for (let i = 0; i < area; i += 4) {
      const r = inputData[i]
      const g = inputData[i + 1]
      const b = inputData[i + 2]
      const a = inputData[i + 3]
      outputData[i] = r * map.rr + g * map.rg + b * map.rb + a * map.ra
      outputData[i + 1] = r * map.gr + g * map.gg + b * map.gb + a * map.ga
      outputData[i + 2] = r * map.br + g * map.bg + b * map.bb + a * map.ba
      outputData[i + 3] = r * map.ar + g * map.ag + b * map.ab + a * map.aa
    }
    createVisibleContext.drawImageData(outputImageData)
    return createVisibleContext
  }

  parameters: Parameter[] = [
    new Parameter({ "name": "rr", "value": 1.0, dataType: DataType.Number }),
    new Parameter({ "name": "rg", "value": 0.0, dataType: DataType.Number }),
    new Parameter({ "name": "rb", "value": 0.0, dataType: DataType.Number }),
    new Parameter({ "name": "ra", "value": 0.0, dataType: DataType.Number }),
    new Parameter({ "name": "gr", "value": 0.0, dataType: DataType.Number }),
    new Parameter({ "name": "gg", "value": 1.0, dataType: DataType.Number }),
    new Parameter({ "name": "gb", "value": 0.0, dataType: DataType.Number }),
    new Parameter({ "name": "ga", "value": 0.0, dataType: DataType.Number }),
    new Parameter({ "name": "br", "value": 0.0, dataType: DataType.Number }),
    new Parameter({ "name": "bg", "value": 0.0, dataType: DataType.Number }),
    new Parameter({ "name": "bb", "value": 1.0, dataType: DataType.Number }),
    new Parameter({ "name": "ba", "value": 0.0, dataType: DataType.Number }),
    new Parameter({ "name": "ar", "value": 0.0, dataType: DataType.Number }),
    new Parameter({ "name": "ag", "value": 0.0, dataType: DataType.Number }),
    new Parameter({ "name": "ab", "value": 0.0, dataType: DataType.Number }),
    new Parameter({ "name": "aa", "value": 1.0, dataType: DataType.Number }),
  ]
}

export { ColorChannelMixerFilter }

import { ValueObject } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { Transform, Transforms, ChainBuilder, Chain, CommandFilter } from "../../MoveMe"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, Phase, TransformType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertPoint, assertPositive } from "../../Utility/Is"
import { Filter } from "../Filter"
import { Propertied } from "../../Base/Propertied"

/**
 * @category Filter
 */
export class OverlayFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'x', type: DataType.Number,
      defaultValue: 0.0, step: 0.01 // , min: 0.0, max: 1.0
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'y', type: DataType.Number,
      defaultValue: 0.0, step: 0.01 // , min: 0.0, max: 1.0
    }))
    this.populateParametersFromProperties()
  }

  chain(outputDimensions: Dimensions, filter: Filter, propertied?: Propertied): Chain {
    const chain = super.chain(outputDimensions, filter, propertied)
    const { commandFilters } = chain
    const values = this.chainValues(filter, propertied)
    const { x, y } = values
    assertPositive(x)
    assertPositive(y)
    const { ffmpegFilter } = this
    const serverFilter: CommandFilter = {
      ffmpegFilter, options: { x, y }, inputs: []
    }
    commandFilters.push(serverFilter)
    return chain
  }
  

  transforms(dimensions: Dimensions, valueObject: ValueObject): Transforms {
    assertPoint(valueObject)
    const { x, y } = valueObject
    const transform: Transform = { transformType: TransformType.Translate, x, y }
    return [transform]
  }
  phase = Phase.Finalize

  valueObject(filterChain: ChainBuilder): ValueObject {
    const { evaluator, size } = filterChain
    const x = evaluator.parameterNumber('x') * size.width
    const y = evaluator.parameterNumber('y') * size.height
    return { x, y }
  }
}

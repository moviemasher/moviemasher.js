import { ValueObject } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { ChainBuilder, Transform, Transforms } from "../../MoveMe"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, Phase, TransformType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertDimensions, assertNumber } from "../../Utility/Is"

/**
 * @category Filter
 */
export class ScaleFilter extends FilterDefinitionClass {

  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, tweenable: true, name: 'width', type: DataType.Number,
      defaultValue: 1.0, step: 0.01 // , min: 0.0, max: 10.0
    }))
    this.properties.push(propertyInstance({
      custom: true, tweenable: true, name: 'height', type: DataType.Number,
      defaultValue: 1.0, step: 0.01 // , min: 0.0, max: 10.0
    }))
    this.populateParametersFromProperties()
  }

  phase = Phase.Populate

  transforms(dimensions: Dimensions, valueObject: ValueObject): Transforms {
    assertDimensions(valueObject)
    const { width: outWidth, height: outHeight } = valueObject
    const { width: inWidth, height: inHeight } = dimensions
    assertNumber(inWidth)
    assertNumber(inHeight)
    const x = outWidth / inWidth
    const y = outHeight / inHeight
    const transform: Transform = { transformType: TransformType.Scale, x, y }
    return [transform]
  }

  valueObject(filterChain: ChainBuilder): ValueObject {
    const { evaluator, size } = filterChain
    const { width: outWidth, height: outHeight } = size

    const width = evaluator.parameterNumber('width') * outWidth
    const height = evaluator.parameterNumber('height') * outHeight

    return { width, height }
  }
}

import { SvgFilters, ValueObject } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { NamespaceSvg } from "../../Setup/Constants"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertNumber, isPositive } from "../../Utility/Is"
import { ServerFilters } from "../Filter"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { ChainBuilder } from "../../MoveMe"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"

export class OpacityFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, tweenable: true, name: 'opacity', type: DataType.Number,
      defaultValue: 1.0, min: 0.0, max: 1.0, step: 0.01
    }))
    this.populateParametersFromProperties()
  }

  _ffmpegFilter = 'geq'

  serverFilters(_: FilterChain, values: ValueObject): ServerFilters {
    const { opacity, endValue } = values
    assertNumber(opacity)
    const options: ValueObject = { r: 'r(X,Y)' }
    if (isPositive(endValue)) options.a = `${opacity}+((${endValue}-${opacity})*T)`
    else options.a = opacity

    return [this.commandFilter(options)]
  }

  svgFilters(dimensions: Dimensions, valueObject: ValueObject): SvgFilters {
    const { opacity } = valueObject
    assertNumber(opacity)

    const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'feColorMatrix')
    filterElement.setAttribute('type', 'matrix')
    filterElement.setAttribute('values', `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${opacity} 0`)
    return [filterElement]
  }

  valueObject(filterChain: ChainBuilder): ValueObject {
    const { evaluator } = filterChain

    const opacity = evaluator.parameterNumber('opacity')

    // const frames = Number(evaluator.propertyValue('frames'))
    // const { position, filter } = evaluator

    const endValue = evaluator.tweenTime ? evaluator.propertyValue(`opacity${PropertyTweenSuffix}`) : undefined

    return { opacity, endValue: endValue || -1 }
  }
}

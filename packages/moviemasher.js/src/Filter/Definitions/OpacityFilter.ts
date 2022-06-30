import { ScalarObject, SvgFilters, ValueObject } from "../../declarations"
import { NamespaceSvg } from "../../Setup/Constants"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertNumber, assertPopulatedString, isNumber } from "../../Utility/Is"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { idGenerate } from "../../Utility/Id"

export class OpacityFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      tweenable: true, name: 'opacity', 
      type: DataType.Percent, defaultValue: 1.0
    }))
    
    this.properties.push(propertyInstance({
      custom: true, name: `opacity${PropertyTweenSuffix}`, type: DataType.Number,
      defaultValue: 1.0, min: 0.0, max: 1.0, step: 0.01
    }))
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const { filterInput, filter, duration } = args
    
    const opacity = filter.value('opacity')
    const opacityEnd = filter.value(`opacity${PropertyTweenSuffix}`)

    assertNumber(opacity)
    assertPopulatedString(filterInput)
    const options: ValueObject = { r: 'r(X,Y)' }
    if (isNumber(opacityEnd)) {
      const toValue = opacityEnd - opacity
      options.a = `(alpha(X,Y)*(${opacity}+(${toValue}*(T/${duration}))))`
    } else options.a = opacity

    const formatFilter = 'format'
    const formatId = idGenerate(formatFilter)
    const formatCommandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter: formatFilter, 
      options: { pix_fmts: 'rgba' }, outputs: [formatId]
    }
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = {
      inputs: [formatId], ffmpegFilter, 
      options, outputs: [idGenerate(ffmpegFilter)]
    }
    return [formatCommandFilter, commandFilter]
  }
  
  _ffmpegFilter = 'geq'
  
  filterDefinitionSvgFilters(valueObject: ScalarObject): SvgFilters {
    const { opacity } = valueObject
    assertNumber(opacity)

    const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'feColorMatrix')
    filterElement.setAttribute('type', 'matrix')
    filterElement.setAttribute('values', `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${opacity} 0`)
    return [filterElement]
  }

}

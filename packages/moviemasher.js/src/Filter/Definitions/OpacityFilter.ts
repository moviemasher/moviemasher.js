import { ScalarObject, SvgFilters, ValueObject } from "../../declarations"
import { NamespaceSvg } from "../../Setup/Constants"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertNumber, assertPopulatedString, isNumber } from "../../Utility/Is"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { idGenerate } from "../../Utility/Id"
import { tweenPosition } from "../../Utility/Tween"
import { svgFilterElement, svgSet } from "../../Utility/Svg"

export class OpacityFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, name: 'opacity', 
      type: DataType.Number, defaultValue: 1.0, 
    }))
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { filterInput: input, filter, duration, videoRate } = args
    const opacity = filter.value('opacity')
    let filterInput = input
    assertNumber(opacity)
    assertPopulatedString(filterInput, 'filterInput')

    const options: ValueObject = { 
      lum: 'lum(X,Y)', cb: 'cb(X,Y)', cr: 'cr(X,Y)', a: `alpha(X,Y)*${opacity}` 
    }
    if (duration) {
      const opacityEnd = filter.value(`opacity${PropertyTweenSuffix}`)
      if (isNumber(opacityEnd) && opacity != opacityEnd) {
        const position = tweenPosition(videoRate, duration, 'N')
        const toValue = opacityEnd - opacity
        options.a = `alpha(X,Y)*(${opacity}+(${toValue}*${position}))`
      }
    }
    // const formatFilter = 'format'
    // const formatId = idGenerate(formatFilter)
    // const formatCommandFilter: CommandFilter = {
    //   inputs: [filterInput], ffmpegFilter: formatFilter, 
    //   options: { pix_fmts: 'rgba' }, outputs: [formatId]
    // }
    // commandFilters.push(formatCommandFilter)
    // filterInput = formatId
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter, 
      options, outputs: [idGenerate(ffmpegFilter)]
    }
    commandFilters.push(commandFilter)
    return commandFilters
  }
  
  protected _ffmpegFilter = 'geq'
  
  filterDefinitionSvgFilter(valueObject: ScalarObject): SvgFilters {
    const { opacity } = valueObject
    assertNumber(opacity)

    const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'feColorMatrix')
    filterElement.setAttribute('type', 'matrix')
    const values = `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${opacity} 0`
    // console.log(this.constructor.name, "filterDefinitionSvgFilters", values)
    svgSet(filterElement, values, 'values')


    return [filterElement]
  }
}

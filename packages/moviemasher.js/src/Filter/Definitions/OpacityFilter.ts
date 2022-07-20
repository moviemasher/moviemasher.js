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
    const commandFilters: CommandFilters = []
    // return commandFilters
    const { filterInput: input, filter, duration, videoRate } = args
    
    const opacity = filter.value('opacity')
    assertNumber(opacity)
    let filterInput = input
    assertPopulatedString(filterInput, 'filterInput')
    assertPopulatedString(filterInput)

    // const setptsFilter = 'setpts'
    // const setptsId = idGenerate(setptsFilter)
    // const setptsCommandFilter: CommandFilter = {
    //   inputs: [filterInput], ffmpegFilter: setptsFilter, 
    //   options: { expr: 'PTS-STARTPTS' }, outputs: [setptsId]
    // }
    // commandFilters.push(setptsCommandFilter)
    // filterInput = setptsId
 

    const options: ValueObject = { r: 'r(X,Y)', a: `alpha(X,Y)*${opacity}` }
    if (duration) {
      const opacityEnd = filter.value(`opacity${PropertyTweenSuffix}`)
      if (isNumber(opacityEnd) && opacity != opacityEnd) {
        const position = tweenPosition(videoRate, duration, 'N')
        const toValue = opacityEnd - opacity
        options.a = `alpha(X,Y)*(${opacity}+(${toValue}*${position}))`
      }
    }

    const formatFilter = 'format'
    const formatId = idGenerate(formatFilter)
    const formatCommandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter: formatFilter, 
      options: { pix_fmts: 'rgba' }, outputs: [formatId]
    }
    commandFilters.push(formatCommandFilter)
    filterInput = formatId


    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter, 
      options, outputs: [idGenerate(ffmpegFilter)]
    }
    commandFilters.push(commandFilter)
    return commandFilters
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

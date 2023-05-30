import { ScalarRecord, ValueRecord } from '@moviemasher/runtime-shared'
import { SvgFilters } from '../../../Helpers/Svg/Svg.js'
import { NamespaceSvg } from '../../../Setup/Constants.js'
import { DataTypeNumber } from "../../../Setup/DataTypeConstants.js"
import { propertyInstance } from "../../../Setup/PropertyFunctions.js"
import { assertNumber, assertPopulatedString, isNumber } from '../../../Shared/SharedGuards.js'
import { FilterDefinitionClass } from '../FilterDefinitionClass.js'
import { PropertyTweenSuffix } from "../../../Base/PropertiedConstants.js"
import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from '../../../Base/Code.js'
import { idGenerate } from '../../../Utility/Id.js'
import { tweenPosition } from '../../../Helpers/TweenFunctions.js'
import { svgSet } from '../../../Helpers/Svg/SvgFunctions.js'
import { FilterDefinitionObject } from '../Filter.js'

export class OpacityFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, name: 'opacity', 
      type: DataTypeNumber, defaultValue: 1.0, 
    }))
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { filterInput: input, filter, duration, videoRate } = args
    const opacity = filter.value('opacity')
    const filterInput = input
    assertNumber(opacity)
    assertPopulatedString(filterInput, 'filterInput')

    const options: ValueRecord = { 
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
  
  filterDefinitionSvgFilter(valueObject: ScalarRecord): SvgFilters {
    const { opacity } = valueObject
    assertNumber(opacity)

    const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'feColorMatrix')
    filterElement.setAttribute('type', 'matrix')
    const values = `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${opacity} 0`
    // console.log(this.constructor.name, 'filterDefinitionSvgFilters', values)
    svgSet(filterElement, values, 'values')


    return [filterElement]
  }
}

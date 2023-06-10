import { FilterDefinitionClass } from '../FilterDefinitionClass.js'
import { colorRgbaKeys } from '../../../Helpers/Color/ColorConstants.js'
import { DataType } from "@moviemasher/runtime-shared"
import { DataTypeNumber } from "../../../Setup/DataTypeConstants.js"
import { propertyInstance } from "../../../Setup/PropertyFunctions.js"
import { ScalarRecord, StringRecord } from '@moviemasher/runtime-shared'
import { SvgFilters } from '../../../Helpers/Svg/Svg.js'
import { svgFilter, svgFilterElement } from '../../../Helpers/Svg/SvgFunctions.js'
import { FilterDefinitionObject } from '../Filter.js'

const ColorChannelMixerFilterKeys = colorRgbaKeys.flatMap(c =>
  colorRgbaKeys.map(d => `${c}${d}`)
)

/**
 * @category Filter
 */
export class ColorChannelMixerFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    ColorChannelMixerFilterKeys.forEach(name => {
      this.properties.push(propertyInstance({
        custom: true, name, type: DataTypeNumber,
        defaultValue: name[0] === name[1] ? 1.0 : 0.0,
        min: 0.0, max: 1.0
      }))
    })
    this.populateParametersFromProperties()
  }

  filterDefinitionSvgFilter(object: ScalarRecord): SvgFilters {
    const bits = colorRgbaKeys.flatMap(c =>
      [...colorRgbaKeys.map(d => Number(object[`${c}${d}`])), 0]
    )
    const options: StringRecord = { 
      filter: 'feColorMatrix',
      type: 'matrix',
      values: bits.join(' '),
    }
    return [svgFilter(options)]
  }
}

// covert to grayscale -> colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3
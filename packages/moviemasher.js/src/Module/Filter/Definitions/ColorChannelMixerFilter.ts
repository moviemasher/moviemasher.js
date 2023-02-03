import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { colorRgbaKeys } from "../../../Utility/Color"
import { DataType } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { ScalarObject, StringObject, SvgFilters } from "../../../declarations"
import { svgFilter, svgFilterElement } from "../../../Utility/Svg"

const ColorChannelMixerFilterKeys = colorRgbaKeys.flatMap(c =>
  colorRgbaKeys.map(d => `${c}${d}`)
)

/**
 * @category Filter
 */
export class ColorChannelMixerFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    ColorChannelMixerFilterKeys.forEach(name => {
      this.properties.push(propertyInstance({
        custom: true, name, type: DataType.Number,
        defaultValue: name[0] === name[1] ? 1.0 : 0.0,
        min: 0.0, max: 1.0
      }))
    })
    this.populateParametersFromProperties()
  }

  filterDefinitionSvgFilter(object: ScalarObject): SvgFilters {
    const bits = colorRgbaKeys.flatMap(c =>
      [...colorRgbaKeys.map(d => Number(object[`${c}${d}`])), 0]
    )
    const options: StringObject = { 
      filter: 'feColorMatrix',
      type: 'matrix',
      values: bits.join(' '),
    }
    return [svgFilter(options)]
  }
}

// covert to grayscale -> colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3
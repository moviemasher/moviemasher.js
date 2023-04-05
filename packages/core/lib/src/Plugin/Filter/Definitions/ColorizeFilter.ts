import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from '../../../Base/Code.js'
import { FilterDefinitionClass } from '../FilterDefinitionClass.js'
import { DataType } from '../../../Setup/Enums.js'
import { propertyInstance } from '../../../Setup/Property.js'
import { idGenerate } from '../../../Utility/Id.js'
import { colorToRgb, colorToRgba } from '../../../Helpers/Color/ColorFunctions.js'
import { colorRgbaKeys, colorRgbKeys } from '../../../Helpers/Color/ColorConstants.js'
import { assertNumber, assertPopulatedString } from '../../../Utility/Is.js'
import { PropertyTweenSuffix } from '../../../Base/Propertied.js'
import { ValueRecord } from '../../../Types/Core.js'
import { tweenPosition } from '../../../Mixin/Tweenable/Tween.js'
import { FilterDefinitionObject } from '../Filter.js'

/**
 * @category Filter
 */
export class ColorizeFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, name: 'color', type: DataType.String, 
    }))
    this.populateParametersFromProperties()
  }

  protected _ffmpegFilter = 'geq'

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { filter, videoRate, duration, filterInput: input } = args
    assertNumber(duration, 'duration')
    assertNumber(videoRate, 'videoRate')
    const color = filter.value('color')
    assertPopulatedString(color, 'color')
    let filterInput = input
    assertPopulatedString(filterInput, 'filterInput')


    const formatFilter = 'format'
    const formatId = idGenerate(formatFilter)
    const formatCommandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter: formatFilter, 
      options: { pix_fmts: 'rgba' }, outputs: [formatId]
    }
    commandFilters.push(formatCommandFilter)
    filterInput = formatId

    const colorEnd = filter.value(`color${PropertyTweenSuffix}`) || color
    assertPopulatedString(colorEnd)

    const alpha = color.length > 7
    const fromColor = alpha ? colorToRgba(color) : colorToRgb(color)
    const toColor = alpha ? colorToRgba(colorEnd) : colorToRgb(colorEnd)

    const keys = alpha ? colorRgbaKeys : colorRgbKeys
    const options: ValueRecord = {}

    const position = duration ? tweenPosition(videoRate, duration, 'N') : 0

    keys.forEach(key => {
      const from = fromColor[key]
      const to = toColor[key]
      if (from === to) options[key] = from
      else options[key] = `${from}+(${to - from}*${position})`
    })
    if (!alpha) options.a = 'alpha(X,Y)'

    const geqFilter = 'geq'
    const geqFilterId = idGenerate(geqFilter)
    const geqCommandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter: geqFilter, 
      options, outputs: [geqFilterId]
    }
    commandFilters.push(geqCommandFilter)
    return commandFilters
  }
}

import { DataType } from "../../Setup/Enums"
import { Modes } from "../../Setup/Modes"
import { NamespaceSvg } from "../../Setup/Constants"
import { propertyInstance } from "../../Setup/Property"
import { assertNumber, assertPopulatedString, assertPositive, isNumeric } from "../../Utility/Is"
import { Scalar, ScalarObject, SvgFilters } from "../../declarations"
import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { ModesFfmpeg } from "../../Setup/Modes"
import { OverlayFilter } from "./OverlayFilter"
import { idGenerate } from "../../Utility/Id"
import { arrayLast } from "../../Utility/Array"
import { assertSize } from "../../Utility/Size"
import { colorBlackOpaque, colorBlackTransparent, colorWhiteTransparent } from "../../Utility/Color"


const BlendWhiteModes = [3]
/**
 * @category Filter
 */
export class BlendFilter extends OverlayFilter {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({ type: DataType.Mode }))
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const { chainInput, filterInput: input, filter, duration, dimensions, videoRate } = args
    let filterInput = input
    assertPopulatedString(chainInput, 'chainInput')
    assertPopulatedString(filterInput, 'filterInput')
    assertSize(dimensions)

    const commandFilters:CommandFilters = []
    const mode = filter.value('mode')
    assertPositive(mode)
    const modeString = this.modeString(mode, false)
    const color = BlendWhiteModes.includes(mode) ? colorWhiteTransparent : colorBlackTransparent
    const colorFilter = this.colorCommandFilter(dimensions, videoRate, duration, color)
    commandFilters.push(colorFilter)

    filterInput = arrayLast(colorFilter.outputs)
        
    const overlayId = idGenerate('overlay')
    const superArgs = { ...args, chainInput: filterInput }
    commandFilters.push(...super.commandFilters(superArgs))

    arrayLast(commandFilters).outputs = [overlayId]
    filterInput = overlayId

    const formatFilter = 'format'
    const formatFilterId = idGenerate(formatFilter)
    const formatCommandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter: formatFilter, 
      options: { pix_fmts: 'rgba' },
      outputs: [formatFilterId]
    }
    commandFilters.push(formatCommandFilter)
    filterInput = formatFilterId
    
    const ffmpegFilter = this.ffmpegFilter
    const commandFilter: CommandFilter = {
      inputs: [filterInput, chainInput, ], ffmpegFilter, 
      options: { 
        // c0_mode: modeString, 
        // c1_mode: modeString, 
        // c2_mode: modeString, 
        all_mode: modeString,
        c3_opacity: '0.5',
        // c0_expr: 'A', 
        // c1_expr: 'A', 
        // c2_expr: 'A',  
        c3_expr: `if(gte(X,240),if(gte(Y,135),B,A))`,
      },
      outputs: []
    }
    commandFilters.push(commandFilter)
    return commandFilters 
  }

  private modeString(value: Scalar, editing: Boolean): string {
    if (!value) return 'normal'

    if (!isNumeric(value)) return String(value)

    const array = editing ? Modes : ModesFfmpeg
    return array[Number(value)]
  }

  filterDefinitionSvgFilters(valueObject: ScalarObject): SvgFilters {
    const { mode } = valueObject
    const modeString = this.modeString(mode, true)
    assertPopulatedString(modeString)

    const blendElement = globalThis.document.createElementNS(NamespaceSvg, 'feBlend')
    blendElement.setAttribute('mode', modeString)
    return [blendElement]
  }
}



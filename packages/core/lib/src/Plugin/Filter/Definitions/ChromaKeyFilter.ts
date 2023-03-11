import { ScalarRecord, StringRecord } from "../../../Types/Core"
import { SvgFilters } from "../../../Helpers/Svg/Svg"
import { DataType } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { colorToRgb } from "../../../Helpers/Color/ColorFunctions"
import { colorGreen } from "../../../Helpers/Color/ColorConstants"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { assertNumber, assertPopulatedString } from "../../../Utility/Is"
import { svgFilter } from "../../../Helpers/Svg/SvgFunctions"
import { FilterDefinitionObject } from "../Filter"

/**
 * @category Filter
 */
export class ChromaKeyFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      custom: true, name: 'color', type: DataType.String,
      defaultValue: colorGreen
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'similarity', type: DataType.Percent,
      defaultValue: 0.9, min: 0.1, step: 0.01, max: 1.0, 
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'blend', type: DataType.Percent,
      defaultValue: 0.0, step: 0.01, max: 1.0,
    }))
    this.populateParametersFromProperties()
  }

  filterDefinitionSvgFilter(object: ScalarRecord): SvgFilters {
    const { similarity, color, blend } = object
    assertNumber(similarity)
    assertNumber(blend)
    assertPopulatedString(color)

    const max = 255.0
    const range = max * max * (1.0 - blend)
    const rgb = colorToRgb(color)
    // console.log("filterDefinitionSvgFilters", rgb)
    const r = 1.0 - (similarity * ((rgb.r) / max)) 
    const g = 1.0 - (similarity * ((rgb.g) / max))
    const b = 1.0 - (similarity * ((rgb.b) / max))
    const values = `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 ${r} ${g} ${b} -${range} ${range}`
    
    const colorMatrix: StringRecord = {
      filter: 'feColorMatrix',
      type: 'matrix',
      values,
    }
    return [svgFilter(colorMatrix)]
  }
}

// <filter id='greenScreen' color-interpolation-filters="sRGB">
// <feComponentTransfer result='colorToBlack'>
//   <feFuncR id='funcR' type='discrete' tableValues='0 1 1  1 1 1'/>
//   <feFuncG id='funcG' type='discrete' tableValues='0 1 '/>
//   <feFuncB id='funcB' type='discrete' tableValues='0 1'/>
// </feComponentTransfer> 
// <feColorMatrix in='colorToBlack' result='blackAndWhite' type='matrix' 
//          values='10 11 10 0 0
//                  10 10 10 0 0
//                  10 10 10 0 0
//                  0 0 0 1 0'/> 
// <feColorMatrix in='blackAndWhite' result='whiteToTransparent' type='matrix' 
//          values='1 0 0 0 0
//                  0 1 0 0 0
//                  0 0 1 0 0
//                 -1 0 0 1 0'/>  
// <feComposite  ='' in='SourceGraphic' in='blackAndWhite' />  
// </filter>
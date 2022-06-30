import { ValueObject, SvgContent, UnknownObject } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { DataType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { fontDefault } from "../../Media/Font/FontFactory"
import { assertDimensions, assertPopulatedString, isObject } from "../../Utility/Is"
import { OverlayFilter } from "./OverlayFilter"
import { FilterDefinitionCommandFilterArgs, CommandFilters, CommandFilter } from "../../MoveMe"
import { arrayLast } from "../../Utility/Array"
import { idGenerate } from "../../Utility/Id"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { tweenOption } from "../../Utility/Tween"

/**
 * @category Filter
 */
export interface TextServerFilter extends ValueObject {
  fontfile: string
  fontsize: number
  textfile: string
}
export const isTextServerFilter = (value: any): value is TextServerFilter => {
  return isObject(value) && "fontfile" in value && "fontsize" in value && "textfile" in value
}
export function assertTextServerFilter(value: any): asserts value is TextServerFilter {
  if (!isTextServerFilter(value)) throw new Error("expected TextServerFilter")
}

export interface TextClientFilter extends ValueObject {
  family: string
  fontsize: number
  string: string
}
export const isTextClientFilter = (value: any): value is TextClientFilter => {
  return isObject(value) && "family" in value && "fontsize" in value && "string" in value
}
export function assertTextClientFilter(value: any): asserts value is TextClientFilter {
  if (!isTextClientFilter(value)) throw new Error("expected TextClientFilter")
}

export class TextFilter extends OverlayFilter {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, type: DataType.String, name: 'fontfile'
    }))
    
    this.properties.push(propertyInstance({
      custom: true, type: DataType.Number, name: 'fontsize'
    }))
    this.properties.push(propertyInstance({
      custom: true, type: DataType.String, name: 'textfile'
    }))
    
    this.properties.push(propertyInstance({
      custom: true, type: DataType.String, name: 'fontcolor'
    }))
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const { filter, duration, dimensions, videoRate } = args
    assertDimensions(dimensions)

    const commandFilters:CommandFilters = []
    const transparentCommandFilter = this.transparentCommandFilter(dimensions, videoRate, duration)
    commandFilters.push(transparentCommandFilter)
    const transparentId = arrayLast(transparentCommandFilter.outputs)
        
    const scalars = filter.scalarObject(!!duration)
    const { 
      x, y, 
      [`x${PropertyTweenSuffix}`]: xEnd, 
      [`y${PropertyTweenSuffix}`]: yEnd, 
      ...options
    } = scalars
    options.x = tweenOption(x, xEnd)
    options.y = tweenOption(y, yEnd)
   
    const { ffmpegFilter } = this
    const textId = idGenerate(ffmpegFilter)
    const commandFilter: CommandFilter = {
      inputs: [transparentId], ffmpegFilter,
      options: options as ValueObject, outputs: [textId]
    }
    commandFilters.push(commandFilter)
    return commandFilters
  }

  _ffmpegFilter = 'drawtext'


  // zfilterChain(filterChain: FilterChain): ChainPhase | undefined {
  //   const { evaluator, filterGraph } = filterChain
  //   const { streaming, preloader, size, editing } = filterGraph
  //   const fontId = String(evaluator.parameter('fontId'))
  //   const fontsize = evaluator.parameterNumber('height') * size.height
  //   const string = String(evaluator.parameter('string'))

  //   const values: ValueObject = { fontsize }
  //   const graphFiles: GraphFiles = []

  //   const definition = Defined.fromId(fontId)
  //   assertPreloadableDefinition(definition)
  //   const file = definition.preloadableSource(editing)
  //   const fontGraphFile: GraphFile = {
  //      type: LoadType.Font, file, definition, options: { loop: 1 }
  //   }
  //   if (streaming) fontGraphFile.options!.re = ''
  //   graphFiles.push(fontGraphFile)

  //     const textGraphFile: GraphFile = {
  //       definition: evaluator.instance.definition, type: GraphFileType.Txt, file: string
  //     }
  //     graphFiles.push(textGraphFile)
  //     values.textfile = preloader.key(textGraphFile)
  //     values.fontfile = preloader.key(fontGraphFile)

  //   const chainPhase: ChainPhase = { graphFiles, values }
  //   return chainPhase
  // }

  // serverFilters(_: FilterChain, values: ValueObject): ServerFilters {
  //   assertTextServerFilter(values)
  //   const commandFilter: CommandFilter = {
  //     inputs: [], ffmpegFilter: this.ffmpegFilter,
  //     options: { ...values, fontcolor: colorWhite }
  //   }
  //   return [commandFilter]
  // }

  // filterDefinitionSvg(dimensions: Dimensions, valueObject: ValueObject): SvgContent {
  //   throw "TextFilter svgContent"
  // //   assertTextClientFilter(valueObject)
  // //   const { string, fontsize, family } = valueObject

  // //   // const rectElement = globalThis.document.createElementNS(NamespaceSvg, 'rect')
  // //   // rectElement.setAttribute('width', '120%')
  // //   // rectElement.setAttribute('height', '100%')
  // //   // rectElement.setAttribute('x', '-10%')
  // //   // rectElement.setAttribute('fill', 'none')

  // //   const textElement = globalThis.document.createElementNS(NamespaceSvg, 'text')
  // //   textElement.setAttribute('font-family', family)
  // //   textElement.setAttribute('fill', colorWhite)
  // //   textElement.setAttribute('font-size', String(fontsize))
  // //   textElement.setAttribute('dominant-baseline', 'hanging')
  // //   textElement.classList.add('shape')
  // //   textElement.append(string)

  // //   // const groupElement = globalThis.document.createElementNS(NamespaceSvg, 'g')
  // //   // groupElement.append(textElement)
  // //   // groupElement.append(rectElement)
  // //   return textElement
  // // }

  // // valueObject(filterChain: ChainBuilder): ValueObject {
  // //   const { evaluator, filterGraph } = filterChain
  // //   const { instance } = evaluator
  // //   const { editing, preloader, size } = filterGraph
  // //   const fontId = String(evaluator.parameter('fontId'))
  // //   const fontsize = evaluator.parameterNumber('height') * size.height
  // //   const string = String(evaluator.propertyValue('string'))

  // //   const values: ValueObject = { fontsize }

  // //   const definition = Defined.fromId(fontId)
  // //   assertFontDefinition(definition)
  // //   assertTextContainer(instance)
  // //   const graphFiles = instance.graphFiles(filterGraph)
  // //   const fontGraphFile = graphFiles.find(graphFile => graphFile.type === LoadType.Font)
  // //   assertTrue(fontGraphFile, 'fontGraphFile')


  // //   if (editing) {
  // //     const font: LoadedFont = preloader.getFile(fontGraphFile)
  // //     values.family = font.family
  // //     values.string = string
  // //     // console.log(this.constructor.name, "valueObject family", values.family, font)

  // //   } else {
  // //     const textGraphFile = graphFiles.find(graphFile => graphFile.type === GraphFileType.Txt)
  // //     assertTrue(textGraphFile, 'textGraphFile')
  // //     values.textfile = preloader.key(textGraphFile)
  // //     values.fontfile = preloader.key(fontGraphFile)
  // //   }
  // //   return values
  // }

  phase = Phase.Populate

}

import { ValueObject, SvgContent } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { GraphFile, CommandFilter, GraphFiles } from "../../MoveMe"
import { DataType, GraphFileType, LoadType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { colorWhite } from "../../Utility/Color"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { fontDefault } from "../../Media/Font/FontFactory"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { ChainPhase, ServerFilters } from "../Filter"
import { isObject } from "../../Utility/Is"
import { assertPreloadableDefinition } from "../../Mixin/Preloadable/Preloadable"
import { Defined } from "../../Base/Defined"

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

export class TextFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)

    this.properties.push(propertyInstance({
      custom: true, type: DataType.String, defaultValue: 'Text'
    }))
    this.properties.push(propertyInstance({
      custom: true, type: DataType.FontId, name: 'fontId', defaultValue: fontDefault.id
    }))
    this.properties.push(propertyInstance({
      custom: true, type: DataType.Number, name: 'height', defaultValue: 0.3, step: 0.01
    }))
    this.populateParametersFromProperties()
  }

  _ffmpegFilter = 'drawtext'

  filterChain(filterChain: FilterChain): ChainPhase | undefined {
    const { evaluator, filterGraph } = filterChain
    const { streaming, preloader, size, editing } = filterGraph
    const fontId = String(evaluator.parameter('fontId'))
    const fontsize = evaluator.parameterNumber('height') * size.height
    const string = String(evaluator.parameter('string'))

    const values: ValueObject = { fontsize }
    const graphFiles: GraphFiles = []

    const definition = Defined.fromId(fontId)
    assertPreloadableDefinition(definition)
    const file = definition.preloadableSource(editing)
    const fontGraphFile: GraphFile = {
      localId: 'font', type: LoadType.Font, file, definition, options: { loop: 1 }
    }
    if (streaming) fontGraphFile.options!.re = ''
    graphFiles.push(fontGraphFile)

      const textGraphFile: GraphFile = {
        localId: `${this.id}-text`,
        definition: evaluator.instance.definition, type: GraphFileType.Txt, file: string
      }
      graphFiles.push(textGraphFile)
      values.textfile = preloader.key(textGraphFile)
      values.fontfile = preloader.key(fontGraphFile)

    const chainPhase: ChainPhase = { graphFiles, values }
    return chainPhase
  }

  serverFilters(_: FilterChain, values: ValueObject): ServerFilters {
    assertTextServerFilter(values)
    const commandFilter: CommandFilter = {
      inputs: [], ffmpegFilter: this.ffmpegFilter,
      options: { ...values, fontcolor: colorWhite }
    }
    return [commandFilter]
  }

  svgContent(dimensions: Dimensions, valueObject: ValueObject): SvgContent {
    throw "TextFilter svgContent"
  //   assertTextClientFilter(valueObject)
  //   const { string, fontsize, family } = valueObject

  //   // const rectElement = globalThis.document.createElementNS(NamespaceSvg, 'rect')
  //   // rectElement.setAttribute('width', '120%')
  //   // rectElement.setAttribute('height', '100%')
  //   // rectElement.setAttribute('x', '-10%')
  //   // rectElement.setAttribute('fill', 'none')

  //   const textElement = globalThis.document.createElementNS(NamespaceSvg, 'text')
  //   textElement.setAttribute('font-family', family)
  //   textElement.setAttribute('fill', colorWhite)
  //   textElement.setAttribute('font-size', String(fontsize))
  //   textElement.setAttribute('dominant-baseline', 'hanging')
  //   textElement.classList.add('shape')
  //   textElement.append(string)

  //   // const groupElement = globalThis.document.createElementNS(NamespaceSvg, 'g')
  //   // groupElement.append(textElement)
  //   // groupElement.append(rectElement)
  //   return textElement
  // }

  // valueObject(filterChain: ChainBuilder): ValueObject {
  //   const { evaluator, filterGraph } = filterChain
  //   const { instance } = evaluator
  //   const { editing, preloader, size } = filterGraph
  //   const fontId = String(evaluator.parameter('fontId'))
  //   const fontsize = evaluator.parameterNumber('height') * size.height
  //   const string = String(evaluator.propertyValue('string'))

  //   const values: ValueObject = { fontsize }

  //   const definition = Defined.fromId(fontId)
  //   assertFontDefinition(definition)
  //   assertTextContainer(instance)
  //   const graphFiles = instance.graphFiles(filterGraph)
  //   const fontGraphFile = graphFiles.find(graphFile => graphFile.type === LoadType.Font)
  //   assertTrue(fontGraphFile, 'fontGraphFile')


  //   if (editing) {
  //     const font: LoadedFont = preloader.getFile(fontGraphFile)
  //     values.family = font.family
  //     values.string = string
  //     // console.log(this.constructor.name, "valueObject family", values.family, font)

  //   } else {
  //     const textGraphFile = graphFiles.find(graphFile => graphFile.type === GraphFileType.Txt)
  //     assertTrue(textGraphFile, 'textGraphFile')
  //     values.textfile = preloader.key(textGraphFile)
  //     values.fontfile = preloader.key(fontGraphFile)
  //   }
  //   return values
  }

  phase = Phase.Initialize

}

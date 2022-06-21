import { TextContainer, TextContainerDefinition } from "./TextContainer"
import { InstanceBase } from "../../Instance/InstanceBase"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { ClassHovering, ClassSelected, NamespaceSvg, ClassMarker } from "../../Setup/Constants"
import { ChainLinks, Filter, FilterChainPhase } from "../../Filter/Filter"
import { LoadedFont, Scalar, SvgContent } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { GraphFile, GraphFileArgs, GraphFiles, Transforms } from "../../MoveMe"
import { TrackPreview } from "../../Editor/Preview/TrackPreview/TrackPreview"
import { GraphFileType, Phase, TransformType } from "../../Setup/Enums"
import { assertTrue } from "../../Utility/Is"
import { ContainerMixin } from "../ContainerMixin"
import { FontDefinition } from "../../Media/Font/Font"
import { Defined } from "../../Base/Defined"
import { svgBoundsElement } from "../../Utility/Svg"
import { stringWidthForFamilyAtHeight } from "../../Utility/String"
import { Property } from "../../Setup"


const TextContainerMixin = ContainerMixin(InstanceBase)
export class TextContainerClass extends TextContainerMixin implements TextContainer {
  constructor(...args: any[]) {
    super(...args)
    this.textFilter = this.definition.textFilterDefinition.instanceFromObject()
    this.setptsFilter = this.definition.setptsFilterDefinition.instanceFromObject()
    this.alphaColorFilter = this.definition.alphaColorFilterDefinition.instanceFromObject()


  }

  private alphaColorFilter: Filter

  chainLinks(): ChainLinks {
    const links: ChainLinks = [this.alphaColorFilter, this.textFilter, this.setptsFilter]
    links.push(...super.chainLinks())
    return links
  }
  declare definition: TextContainerDefinition

  definitionIds(): string[] {
    return [...super.definitionIds(), this.fontId]
  }

  declare fontId: string

  declare string: string

  filterChainPhase(filterChain: FilterChain, phase: Phase): FilterChainPhase | undefined {
    if (phase !== Phase.Initialize) return

    const { size } = filterChain.filterGraph
    const { width, height } = size
    const graphFiles: GraphFiles = []

    // filterChain.size = this.pathDimensions

    return { link: this, values: { width, height }, graphFiles }
  }


  _font?: FontDefinition
  get font() { return this._font ||= Defined.fromId(this.fontId) as FontDefinition }

  graphFiles(args: GraphFileArgs): GraphFiles {
    const { visible, editing } = args
    if (!visible) return []

    const graphFiles = this.font.graphFiles(args)
    if (!editing) {
      const textGraphFile: GraphFile = {
        localId: 'text',
        definition: this.font, type: GraphFileType.Txt, file: this.string
      }
      graphFiles.push(textGraphFile)
    }
    // console.log(this.constructor.name, "graphFiles", graphFiles.map(file => file.file))
    return graphFiles
  }

  private _intrinsicDimensions?: Dimensions

  intrinsicDimensions(): Dimensions { return this._intrinsicDimensions! }

  private intrinsicDimensionsInitialize(filterChain: TrackPreview) {
    const { filterGraph, evaluator } = filterChain
    const { size } = filterGraph
    const font = this.loadedFont(filterChain)
    assertTrue(font, "font")
    const { family } = font
    evaluator.filter = this.textFilter
    const clipHeight = evaluator.parameterNumber('height')
    const clipString = String(evaluator.parameter('string'))
    const height = clipHeight * size.height
    const width = stringWidthForFamilyAtHeight(clipString, family, height)
    const dimensions = { width, height }
    this._intrinsicDimensions = dimensions
    // console.log(this.constructor.name, "intrinsicDimensionsInitialize", family)
    return dimensions
  }

  private loadedFont(filterChain: TrackPreview) {
    const { filterGraph } = filterChain
    const { preloader, time, quantize, editing } = filterGraph
    const graphFileArgs: GraphFileArgs = {
      quantize, time, visible: true, editing
    }
    const graphFiles = this.font.graphFiles(graphFileArgs)
    const [graphFile] = graphFiles
    // console.log(this.constructor.name, "loadedFont", graphFile)

    const font: LoadedFont = preloader.getFile(graphFile)
    return font
  }


  private pathElement(filterChain: TrackPreview): SvgContent {
    return this.textFilter.svgContent({ width: 0, height: 0 }, filterChain)
  }

  svgContent(filterChain: TrackPreview): SvgContent {
    this.intrinsicDimensionsInitialize(filterChain)
    return this.pathElement(filterChain)
  }

  private textFilter: Filter

  private setptsFilter: Filter

  setValue(value: Scalar, name: string, property?: Property): void {
    super.setValue(value, name, property)
    switch (name) {
      case 'fontId':
        // console.log(this.constructor.name, "setValue deleting font because", name, "changed")
        delete this._font
      case 'string':
        // console.log(this.constructor.name, "setValue deleting intrinsicDimensions because", name, "changed")
        delete this._intrinsicDimensions
    }
  }

  transformSvgContent(filterChain: TrackPreview): SvgContent {
    const dimensions = this.intrinsicDimensionsInitialize(filterChain)
    const { width, height } = dimensions
    const { filterGraph, clip, selected } = filterChain

    const { editor } = filterGraph

    const transformElement = globalThis.document.createElementNS(NamespaceSvg, 'g')
    transformElement.setAttribute('width', String(width))
    transformElement.setAttribute('height', String(height))

    const pathElement = this.pathElement(filterChain)
    pathElement.setAttribute('fill', 'transparent')

    if (selected) {
      pathElement.classList.add(ClassMarker)
      const outlineElement = svgBoundsElement(dimensions)
      outlineElement.classList.add(ClassSelected)
      outlineElement.setAttribute('vector-effect', 'non-scaling-stroke')
      transformElement.append(outlineElement)

      const markersElement = svgBoundsElement(dimensions)
      markersElement.classList.add(ClassMarker)
      transformElement.append(markersElement)
    } else {
      pathElement.setAttribute('vector-effect', 'non-scaling-stroke')
      pathElement.addEventListener('pointerenter', () => {
        pathElement.classList.add(ClassHovering)
      })
      pathElement.addEventListener('pointerdown', () => {
        editor!.select(clip)
      })
      pathElement.addEventListener('pointerleave', () => {
        pathElement.classList.remove(ClassHovering)
      })
    }
    transformElement.append(pathElement)
    return transformElement
  }

  transforms(filterChain: TrackPreview): Transforms {
    const y = 1.0
    const x = 1.0
    return [
      { transformType: TransformType.Scale, x, y },
      ...this.overlayFilter.transforms({ width: 0, height: 0 }, filterChain),
    ]
  }
}

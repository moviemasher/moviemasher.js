import { ShapeContainer, ShapeContainerDefinition } from "./ShapeContainer"
import { InstanceBase } from "../../Instance/InstanceBase"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { ClassHovering, ClassSelected, NamespaceSvg, ClassMarker } from "../../Setup/Constants"
import { colorWhite } from "../../Utility/Color"
import { ChainLinks, Filter, FilterChainPhase } from "../../Filter/Filter"
import { SvgContent } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { Chain, ContainerChainArgs, GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { TrackPreview } from "../../Editor/Preview/TrackPreview/TrackPreview"
import { GraphFileType, Phase } from "../../Setup"
import { ContainerMixin } from "../ContainerMixin"
import { svgBoundsElement } from "../../Utility/Svg"
import { shapeContainerDefault } from "./ShapeContainerFactory"
import { filterDefinitionFromId, filterFromId } from "../../Filter"
import { chainAppend, chainPrepend } from "../../Utility/Chain"


const ShapeContainerMixin = ContainerMixin(InstanceBase)
export class ShapeContainerClass extends ShapeContainerMixin implements ShapeContainer {

  declare definition: ShapeContainerDefinition

  containerChain(args: ContainerChainArgs): Chain {
    const chain: Chain = super.containerChain(args) // { commandFiles: [], commandFilters: []}
    const { commandFiles, commandFilters } = chain
    const { color, outputDimensions, videoRate} = args

    if (color) {
      // easy, just fill my path with color
      if (this.definitionId === shapeContainerDefault.id) {
        // even easier, just use color filter
        const { colorFilter } = this
        colorFilter.setValue(videoRate, 'rate')
        chainPrepend(chain, colorFilter.chain(outputDimensions, this))
      } else {

      }
    } else {
      
      // chainPrepend(chain, )
    }
    return chain
  }
  chainLinks(): ChainLinks {
    const links: ChainLinks = [this]
    links.push(...super.chainLinks())
    return links
  }

  _colorFilter?: Filter
  get colorFilter() { return this._colorFilter ||= filterFromId('color') }

  filterChainPhase(filterChain: FilterChain, phase: Phase): FilterChainPhase | undefined {
    if (phase !== Phase.Initialize) return

    const { size } = filterChain.filterGraph
    const { width, height } = size
    const graphFiles: GraphFiles = []

    // filterChain.size = this.intrinsicDimensions()

    // TODO: add svg file if not editing
    return { link: this, values: { width, height }, graphFiles }
  }

  graphFiles(args: GraphFileArgs): GraphFiles {
    const graphFiles: GraphFiles = []
    const { editing } = args
    if (editing) return graphFiles

    const { svgGroupElement, definition } = this
    const svgElement = globalThis.document.createElementNS(NamespaceSvg, 'svg')
    svgElement.appendChild(svgGroupElement)

    const graphFile: GraphFile = {
      type: GraphFileType.Svg, file: svgElement.outerHTML, definition
    }
    graphFiles.push(graphFile)
    return graphFiles
  }
  intrinsicDimensions(): Dimensions {
    return { width: this.pathWidth, height: this.pathHeight }
  }

  declare path: string

  pathElement(): SVGPathElement {
    const pathElement = globalThis.document.createElementNS(NamespaceSvg, 'path')
    pathElement.setAttribute('d', this.path)
    pathElement.setAttribute('fill', colorWhite)
    pathElement.classList.add('shape')
    return pathElement
  }

  declare pathWidth: number
  declare pathHeight: number

  svgContent(_: TrackPreview): SvgContent { return this.svgGroupElement }
  
  private get svgGroupElement(): SVGGElement {
    const dimensions = this.intrinsicDimensions()
    const { width, height } = dimensions
    const gElement = globalThis.document.createElementNS(NamespaceSvg, 'g')
    gElement.setAttribute('width', String(width))
    gElement.setAttribute('height', String(height))
    gElement.appendChild(svgBoundsElement(dimensions))
    gElement.appendChild(this.pathElement())
    return gElement
  }

  transformSvgContent(filterChain: TrackPreview): SvgContent {
    const dimensions = this.intrinsicDimensions()
    const { width, height } = dimensions
    const { filterGraph, clip, selected } = filterChain

    const { editor } = filterGraph

    const transformElement = globalThis.document.createElementNS(NamespaceSvg, 'g')
    transformElement.setAttribute('width', String(width))
    transformElement.setAttribute('height', String(height))

    const pathElement = this.pathElement()
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

}

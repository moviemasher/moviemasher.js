import { isShapeContainer } from "../../Container/ShapeContainer/ShapeContainer"
import { Point, SvgContents } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { Transforms } from "../../MoveMe"
import { Editor } from "../Editor"
import { Time } from "../../Helpers/Time/Time"
import { isVisibleClip } from "../../Media/VisibleClip/VisibleClip"
import { Visible } from "../../Mixin/Visible/Visible"
import { Loader } from "../../Loader/Loader"
import { NamespaceSvg } from "../../Setup/Constants"
import { AVType, TransformType } from "../../Setup/Enums"
import { sortByTrack } from "../../Utility/Sort"
import { TrackPreviewArgs, TrackPreviews } from "./TrackPreview/TrackPreview"
import { TrackPreviewClass } from "./TrackPreview/TrackPreviewClass"
import { Mash } from "../../Edited/Mash/Mash"
import { PreviewArgs, Preview } from "./Preview"

export class PreviewClass implements Preview {
  constructor(args: PreviewArgs) {
    const { selectedClip, editor, time, mash } = args
    this.mash = mash
    this.size = mash.imageSize
    this.time = time
    if (editor) this.editor = editor
    this.selectedClip = selectedClip
  }

  audible = false

  backcolor?: string

  editing = true
  
  get duration(): number { return this.time.lengthSeconds }

  editor?: Editor

  private _filterChains?: TrackPreviews
  get filterChains() { return this._filterChains ||= this.filterChainsInitialize }
  private get filterChainsInitialize(): TrackPreviews {
    const filterChains: TrackPreviews = []
    const { time, quantize } = this

    const tweenTime = time.isRange ? undefined : time.scale(quantize)
    const clips = this.mash.clipsInTimeOfType(time, AVType.Video).sort(sortByTrack)

    clips.forEach(clip => {
      const clipTimeRange = clip!.timeRange(quantize)
      const range = clipTimeRange.scale(time.fps)
      const frame = Math.max(0, time.frame - range.frame)
      const timeRange = range.withFrame(frame)
      const filterChainArgs: TrackPreviewArgs = {
        clip, filterGraph: this, tweenTime, timeRange
      }

      filterChains.push(new TrackPreviewClass(filterChainArgs))
    })
    return filterChains
  }

  selectedClip?: Visible

  selectedScale: Point = { x: 0, y: 0 }

  get svgElement(): SVGSVGElement {
    const { filterChains, editor, size, selectedClip, backcolor } = this
    const contents: SvgContents = []
    if (backcolor) {
      const rectElement = globalThis.document.createElementNS(NamespaceSvg, 'rect')
      rectElement.setAttribute('width', String(size.width))
      rectElement.setAttribute('height', String(size.height))
      rectElement.setAttribute('fill', backcolor)
      contents.push(rectElement)
    }
    // console.log(this.constructor.name, "svgElement", filterChains.length)
    contents.push(...filterChains.map(chain => chain.svg))
    const width = String(size.width)
    const height = String(size.height)

    const svgElement = globalThis.document.createElementNS(NamespaceSvg, 'svg')
    svgElement.setAttribute('width', width)
    svgElement.setAttribute('height', height)
    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`)

    if (editor && isVisibleClip(selectedClip)) {
      const { container } = selectedClip
      const shape = isShapeContainer(container)
        const selectedChain = filterChains.find(chain => chain.clip === selectedClip)
        if (selectedChain) {
        const { transforms } = selectedChain
        const defsElement = globalThis.document.createElementNS(NamespaceSvg, 'defs')
        defsElement.append(this.markerElement(transforms))
        if (shape) defsElement.append(this.markerElement(transforms, true))
        contents.unshift(defsElement)

        }
    }
    svgElement.append(...contents)
    return svgElement
  }

  private markerElement(transforms: Transforms, shape?: boolean): SVGMarkerElement {
    const scales = transforms.filter(transform => transform.transformType === TransformType.Scale)
    const inverse = scales.map(scale => ({ x: 1.0 / scale.x, y: 1.0 / scale.y }))
    const elementType = shape ? 'ellipse' : 'rect'
    const idPrefix = shape ? 'shape' : 'bounds'
    const markerElement = globalThis.document.createElementNS(NamespaceSvg, 'marker')
    const element = globalThis.document.createElementNS(NamespaceSvg, elementType)

    const size = 5.0
    const twice = 2 * size
    markerElement.setAttribute('id', `${idPrefix}-marker`)
    markerElement.setAttribute('markerUnits', 'userSpaceOnUse')
    markerElement.setAttribute('refX', String(size))
    markerElement.setAttribute('refY', String(size))
    markerElement.setAttribute('markerWidth', String(twice))
    markerElement.setAttribute('markerHeight', String(twice))
    markerElement.setAttribute('viewBox', `0 0 ${twice} ${twice}`)

    if (shape) {
      element.setAttribute('cx', String(size))
      element.setAttribute('cy', String(size))
      element.setAttribute('rx', String(size))
      element.setAttribute('ry', String(size))
    } else {
      element.setAttribute('width', String(twice))
      element.setAttribute('height', String(twice))
    }
    element.setAttribute('fill', 'currentColor')

    const transform = [`translate(${size},${size})`]
    transform.push(...inverse.map(point => `scale(${point.x},${point.y})`))
    transform.push(`translate(-${size},-${size})`)

    element.setAttribute('transform', transform.join(' '))
    markerElement.append(element)
    return markerElement
  }
  mash: Mash

  get preloader(): Loader { return this.mash.preloader }

  get quantize(): number { return this.mash.quantize }
  size: Dimensions

  streaming = false

  time: Time

  visible = true

}

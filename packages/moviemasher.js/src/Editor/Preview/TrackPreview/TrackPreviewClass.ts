import { assertContainer } from "../../../Container/Container"
import { SvgContent } from "../../../declarations"
import { Point } from "../../../Utility/Point"
import { Rect } from "../../../Utility/Rect"
import { Size } from "../../../Utility/Size"
import { Evaluator, EvaluatorArgs } from "../../../Helpers/Evaluator"
import { assertVisibleClip, VisibleClip } from "../../../Media/VisibleClip/VisibleClip"
import { ClassHovering, NamespaceSvg } from "../../../Setup/Constants"
import { idGenerate } from "../../../Utility/Id"
import { svgGroupElement, svgOfDimensions, svgPolygonElement } from "../../../Utility/Svg"
import { TrackPreview, TrackPreviewArgs } from "./TrackPreview"
import { assertTrue } from "../../../Utility/Is"
import { Direction } from "../../../Setup/Enums"
import { Editor } from "../../Editor"
import { Time, TimeRange } from "../../../Helpers/Time/Time"
import { tweenRectsEqual } from "../../../Utility"

export const TrackPreviewHandleSize = 4

export class TrackPreviewClass implements TrackPreview {
  constructor(public args: TrackPreviewArgs) {
    this.selected = this.preview.selectedClip === this.clip
  }

  get clip(): VisibleClip { return this.args.clip }

  get container() { return this.clip.container! }

  editing = true

  get editor(): Editor { return this.preview.editor! }

  private _evaluator?: Evaluator
  get evaluator() { return this._evaluator ||= this.evaluatorInitialize }
  get evaluatorInitialize(): Evaluator {
    const { preview: filterGraph, args } = this
    const { timeRange, tweenTime } = args
    const { size, editor } = filterGraph
    const evaluatorArgs: EvaluatorArgs = {
      instance: this.clip, outputSize: size, 
      editing: !!editor,
      timeRange, tweenTime
    }
    return new Evaluator(evaluatorArgs)
  }

  get preview() { return this.args.preview }

  get quantize() { return this.preview.quantize }

  selected = false

  get svg(): SVGSVGElement {
    const { timeRange, time, clip, evaluator, editing, size } = this
    assertVisibleClip(clip)
    const { container, content } = clip
    assertContainer(container)

    const containerRects = container.containerRects(size, time, timeRange)
    assertTrue(tweenRectsEqual(...containerRects), 'single container rect')

    const [containerRect] = containerRects
    evaluator.instance = container
    const containerSvg = container.containerSvg(containerRect, time, timeRange)

    evaluator.instance = content
    const contentSvg = content.contentSvg(containerRect, time, timeRange)
    const svgElement = svgOfDimensions(size)
    const maskId = `mask-${idGenerate()}`

    contentSvg.classList.add('contained')
    const maskElement = globalThis.document.createElementNS(NamespaceSvg, 'mask')
    maskElement.setAttribute('id', maskId)
    maskElement.setAttribute('width', String(containerRect.width))
    const polygonElement = svgPolygonElement(containerRect, '', 'transparent')
    maskElement.appendChild(polygonElement)
    contentSvg.setAttribute('mask', `url(#${maskId})`)
    contentSvg.setAttribute('mask-mode', 'alpha')

    maskElement.append(containerSvg)
    svgElement.append(maskElement)
    svgElement.append(contentSvg)

    if (editing) svgElement.append(this.svgEditingContent(containerRect, time, timeRange))
    
    const svgFilters = clip.svgFilters(size, containerRect, time, timeRange)
    if (svgFilters.length) {
      const id = `filter-${idGenerate()}`
      const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'filter')
      filterElement.setAttribute('id', id)
      filterElement.setAttribute('filterUnits', "userSpaceOnUse")
      filterElement.append(...svgFilters)
      svgElement.appendChild(filterElement)
      contentSvg.setAttribute('filter', `url(#${id})`)
    }
    return svgElement
  }

  get size(): Size { return this.preview.size }
 
  private svgBoundsElement(directions: Direction[], rect: Rect): SVGGElement {

    // console.log(this.constructor.name, "svgBoundsElement", rect)

    const { x, y, width, height } = rect
    const dimensions = { width, height }
    const groupElement = svgGroupElement(dimensions)
    const polygonElement = svgPolygonElement(dimensions, 'bounds')
    polygonElement.setAttribute('stroke', 'currentColor')
    polygonElement.setAttribute('vector-effect', 'non-scaling-stroke')
    groupElement.append(polygonElement)
    directions.forEach(direction => {
      groupElement.append(this.svgBoundsLine(dimensions, direction))
    })

    groupElement.setAttribute('transform', `translate(${x},${y})`)
    return groupElement
  }

  private svgBoundsLine(dimensions: Size, direction: Direction): SVGPolygonElement {
    const point = this.svgHandlePoint(dimensions, direction)
    const rect = { ...point, width: TrackPreviewHandleSize * 2, height: TrackPreviewHandleSize * 2 }
    const element = svgPolygonElement(rect, 'handle', 'currentColor')
    element.classList.add(direction)
    element.addEventListener('pointerdown', event => {
      console.log("click", direction)
      this.editor.select(this.clip)
      event.stopPropagation()
    })
    return element
  }

  private svgEditingContent(containerRect: Rect, time: Time, range: TimeRange): SvgContent {
    const container = this.clip.container!
    const transformedGroupElement = container.intrinsicGroupElement
    const { clip, selected, editor } = this
    console.log(this.constructor.name, "svgEditingContent", clip.label, containerRect)
    const pathElement = container.pathElement(containerRect, time, range, 'transparent')
    pathElement.setAttribute('vector-effect', 'non-scaling-stroke')

    pathElement.addEventListener('pointerdown', event => {
      editor.select(clip)
      event.stopPropagation()
    })
    if (selected) {
      const { directions } = container
      const boundsElement = this.svgBoundsElement(directions, containerRect)
      transformedGroupElement.append(boundsElement)
    } else {
      pathElement.addEventListener('pointerenter', () => {
        pathElement.classList.add(ClassHovering)
      })
      pathElement.addEventListener('pointerleave', () => {
        pathElement.classList.remove(ClassHovering)
      })
    }
    transformedGroupElement.append(pathElement)
    transformedGroupElement.classList.add('container')
    return transformedGroupElement
  }

  private svgHandlePoint(dimensions: Size, direction: Direction): Point {
    const { width, height } = dimensions
    const point = { x: 0, y: 0 }
    const [first, second] = String(direction).split('')
    const last = second || first
    switch(last) {
      case 'w':
        point.x = - TrackPreviewHandleSize
        break
      case 'e':
        point.x = width - TrackPreviewHandleSize
        break
      default: point.x = (width / 2) - TrackPreviewHandleSize
    }
    switch(first) {
      case 'n':
        point.y = - TrackPreviewHandleSize
        break
      case 's': 
        point.y = height - TrackPreviewHandleSize
        break
      default: point.y = (height / 2) - TrackPreviewHandleSize
    }
    return point
  }
  
  get time(): Time { return this.preview.time }

  private _timeRange?: TimeRange
  get timeRange() { return this._timeRange ||= this.clip.timeRange(this.quantize) }
}

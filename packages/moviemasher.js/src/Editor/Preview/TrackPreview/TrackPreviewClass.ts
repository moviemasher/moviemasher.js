import { assertContainer } from "../../../Container/Container"
import { SvgItem } from "../../../declarations"
import { Point } from "../../../Utility/Point"
import { Rect, rectsEqual } from "../../../Utility/Rect"
import { Size } from "../../../Utility/Size"
import { Evaluator, EvaluatorArgs } from "../../../Helpers/Evaluator"
import { assertClip, Clip } from "../../../Media/Clip/Clip"
import { NamespaceSvg } from "../../../Setup/Constants"
import { idGenerate } from "../../../Utility/Id"
import { svgGroupElement, svgOfDimensions, svgPolygonElement } from "../../../Utility/Svg"
import { TrackPreview, TrackPreviewArgs } from "./TrackPreview"
import { assertTrue } from "../../../Utility/Is"
import { Anchor, assertDirection, Direction } from "../../../Setup/Enums"
import { Editor } from "../../Editor"
import { Time, TimeRange } from "../../../Helpers/Time/Time"
import { Svg } from "../Preview"

export const TrackPreviewHandleSize = 4

export class TrackPreviewClass implements TrackPreview {
  constructor(public args: TrackPreviewArgs) {
    this.selected = this.preview.selectedClip === this.clip
  }

  private get clip(): Clip { return this.args.clip }

  private editing = true

  private get editor(): Editor { return this.preview.editor! }

  private _evaluator?: Evaluator
  private get evaluator() { return this._evaluator ||= this.evaluatorInitialize }
  private get evaluatorInitialize(): Evaluator {
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

  private get preview() { return this.args.preview }

  private get quantize() { return this.preview.quantize }

  private selected = false
  
  private get svgElement(): SVGSVGElement {
    // console.log(this.constructor.name, "svgElement")
    const { timeRange, time, clip, evaluator, editing, size } = this
    assertClip(clip)
    const { container, content } = clip
    assertContainer(container)

    const containerRects = container.containerRects(size, time, timeRange)
    assertTrue(rectsEqual(...containerRects), 'single container rect')

    const [containerRect] = containerRects
    evaluator.instance = container
    const containerSvgItem = container.containerSvgItem(containerRect, time, timeRange)

    evaluator.instance = content
    const contentSvgItem = content.contentSvgItem(containerRect, time, timeRange)
    const svgElement = svgOfDimensions(size)
    const maskId = `mask-${idGenerate()}`

    contentSvgItem.classList.add('contained')
    const maskElement = globalThis.document.createElementNS(NamespaceSvg, 'mask')
    maskElement.setAttribute('id', maskId)
    maskElement.setAttribute('width', String(containerRect.width))
    const polygonElement = svgPolygonElement(containerRect, '', 'transparent')
    maskElement.appendChild(polygonElement)
    contentSvgItem.setAttribute('mask', `url(#${maskId})`)
    contentSvgItem.setAttribute('mask-mode', 'alpha')

    maskElement.append(containerSvgItem)
    svgElement.append(maskElement)
    svgElement.append(contentSvgItem)

    if (editing) svgElement.append(this.svgEditingContent(containerRect, time, timeRange))
    
    const containerSvgFilters = container.containerSvgFilters(size, containerRect, time, timeRange)
    if (containerSvgFilters.length) {
      const id = `filter-${idGenerate()}`
      const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'filter')
      filterElement.setAttribute('id', id)
      filterElement.setAttribute('filterUnits', "userSpaceOnUse")
      filterElement.append(...containerSvgFilters)
      svgElement.appendChild(filterElement)
      // console.log(this.constructor.name, "svgElement", "adding filter", id)
      containerSvgItem.setAttribute('filter', `url(#${id})`)
    }
    return svgElement
  }

  private get size(): Size { return this.preview.size }
 
  get svg(): Svg {
    const { clip, svgElement: svg } = this
    const { id } = clip
    return { id, element: svg }
  }

  private svgBoundsElement(directions: Anchor[], rect: Rect): SVGGElement {
    const { x, y, width, height } = rect
    const dimensions = { width, height }
    const groupElement = svgGroupElement(dimensions)
    const polygonElement = svgPolygonElement(dimensions, 'bounds')
    polygonElement.setAttribute('stroke', 'currentColor')
    polygonElement.setAttribute('vector-effect', 'non-scaling-stroke')
    groupElement.append(polygonElement)
    directions.forEach(direction => {
      const point = this.svgHandlePoint(dimensions, direction)
      const rect = { ...point, width: TrackPreviewHandleSize * 2, height: TrackPreviewHandleSize * 2 }
      const element = svgPolygonElement(rect, 'handle', 'currentColor')
      element.classList.add(direction)
      element.addEventListener('pointerdown', event => {
        // console.log("click", direction)
        this.editor.select(this.clip)
        event.stopPropagation()
      })
      groupElement.append(element)
    })
    groupElement.setAttribute('transform', `translate(${x},${y})`)
    return groupElement
  }

  private svgEditingContent(containerRect: Rect, time: Time, range: TimeRange): SvgItem {
    const container = this.clip.container!
    const transformedGroupElement = svgGroupElement()
    const { clip, selected, editor } = this
    // console.log(this.constructor.name, "svgEditingContent", clip.label, containerRect)
    const pathElement = container.pathElement(containerRect, time, range, 'transparent')
    pathElement.setAttribute('vector-effect', 'non-scaling-stroke')

    pathElement.addEventListener('pointerdown', event => {
      editor.select(clip)
      event.stopPropagation()
      globalThis.document.addEventListener
    })
    pathElement.addEventListener('pointerdrag', event => {
      editor.select(clip)
      event.stopPropagation()
    })
    
    if (selected) {
      const { directions } = container
      const boundsElement = this.svgBoundsElement(directions, containerRect)
      // pathElement.classList.add('shape')

      transformedGroupElement.append(boundsElement)
    } else {
      pathElement.classList.add('shape')

      pathElement.addEventListener('pointerenter', () => {
        // console.log(this.constructor.name, "pointerenter", pathElement.classList)
      })
      pathElement.addEventListener('pointerleave', () => {
        // console.log(this.constructor.name, "pointerleave", pathElement.classList)
      })
    }
    transformedGroupElement.append(pathElement)
    transformedGroupElement.classList.add('container')
    return transformedGroupElement
  }

  private svgHandlePoint(dimensions: Size, direction: Anchor): Point {
    const { width, height } = dimensions
    const point = { x: 0, y: 0 }
    const [first, second] = String(direction).split('')
    assertDirection(first, direction)

    const last = second || first
    assertDirection(last)

    switch(last) {
      case Direction.W:
        point.x = - TrackPreviewHandleSize
        break
      case Direction.E:
        point.x = width - TrackPreviewHandleSize
        break
      default: point.x = (width / 2) - TrackPreviewHandleSize
    }
    switch(first) {
      case Direction.N:
        point.y = - TrackPreviewHandleSize
        break
      case Direction.S: 
        point.y = height - TrackPreviewHandleSize
        break
      default: point.y = (height / 2) - TrackPreviewHandleSize
    }
    return point
  }
  
  private get time(): Time { return this.preview.time }

  private _timeRange?: TimeRange
  private get timeRange() { return this._timeRange ||= this.clip.timeRange(this.quantize) }
}

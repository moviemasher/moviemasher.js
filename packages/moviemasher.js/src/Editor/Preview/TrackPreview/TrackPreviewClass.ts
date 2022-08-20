import { assertContainer, ContainerRectArgs } from "../../../Container/Container"
import { SvgItem } from "../../../declarations"
import { Point } from "../../../Utility/Point"
import { Rect, rectsEqual } from "../../../Utility/Rect"
import { Size } from "../../../Utility/Size"
import { Evaluator, EvaluatorArgs } from "../../../Helpers/Evaluator"
import { assertClip, Clip } from "../../../Edited/Mash/Track/Clip/Clip"
import { NamespaceSvg, NamespaceXhtml } from "../../../Setup/Constants"
import { idGenerate } from "../../../Utility/Id"
import { svgGroupElement, svgOfDimensions, svgPolygonElement } from "../../../Utility/Svg"
import { TrackPreview, TrackPreviewArgs } from "./TrackPreview"
import { assertTrue } from "../../../Utility/Is"
import { Anchor, assertDirection, Direction } from "../../../Setup/Enums"
import { Editor } from "../../Editor"
import { Time, TimeRange } from "../../../Helpers/Time/Time"
import { Svg } from "../Preview"
import { GraphFileArgs } from "../../../MoveMe"
import { eventStop } from "../../../Utility/Event"

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
  

  private get size(): Size { return this.preview.size }
 
  get svg(): Promise<Svg> {
    const { timeRange, time, quantize, clip, preview } = this
    const { preloader } = preview
    const args: GraphFileArgs = { 
      editing: true, quantize, time, clipTime: timeRange, visible: true 
    }
    const graphFiles = clip.clipGraphFiles(args)
    const files = graphFiles.filter(file => !preloader.loadedFile(file))
    return preloader.loadFilesPromise(files).then(() => this.svgObject())
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
        console.log("pointerdown", direction)
        this.editor.selection.set(this.clip)
        eventStop(event)
      })
      groupElement.append(element)
    })
    groupElement.setAttribute('transform', `translate(${x},${y})`)
    return groupElement
  }

  private svgEditingContent(containerRect: Rect, time: Time, range: TimeRange): SvgItem {
    const container = this.clip.container!
    const transformedGroupElement = svgGroupElement()
    const { clip, selected, editor  } = this
    // console.log(this.constructor.name, "svgEditingContent", clip.label, containerRect)
    const pathElement = container.pathElement(containerRect, 'transparent', editor)
    pathElement.setAttribute('vector-effect', 'non-scaling-stroke')
    
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

  private svgObject() {
    const { timeRange, time, clip, evaluator, editing, size } = this
    const { id } = clip
    const changeHandler = () => { console.log("changeHandler") }
    assertClip(clip)
    const { container, content } = clip
    assertContainer(container)
    const containerRectArgs: ContainerRectArgs = {
      size, time, timeRange, editing: true,
    }
    const containerRects = container.containerRects(containerRectArgs)
    assertTrue(rectsEqual(...containerRects), 'single container rect')

    const [rect] = containerRects
    evaluator.instance = container
    const containerSvgItem = container.containerSvgItem(rect, time, timeRange)

    evaluator.instance = content
    const contentSvgItem = content.contentSvgItem(rect, time, timeRange)
    const element = svgOfDimensions(size)
    element.setAttribute('xmlns', NamespaceSvg)

    const maskId = `mask-${idGenerate()}`

    contentSvgItem.classList.add('contained')
    const maskElement = globalThis.document.createElementNS(NamespaceSvg, 'mask')
    maskElement.setAttribute('id', maskId)
    maskElement.setAttribute('width', String(size.width))
    maskElement.setAttribute('height', String(size.height))
    maskElement.appendChild(svgPolygonElement(size, '', 'transparent'))
    // maskElement.appendChild(svgPolygonElement(rect, '', 'white'))
    maskElement.appendChild(containerSvgItem)
    contentSvgItem.setAttribute('mask', `url(#${maskId})`)
    contentSvgItem.setAttribute('mask-mode', 'luminance')

    element.append(maskElement)
    element.append(contentSvgItem)

    if (editing) element.append(this.svgEditingContent(rect, time, timeRange))
    
    const containerSvgFilters = container.containerSvgFilters(size, rect, time, timeRange)
    if (containerSvgFilters.length) {
      const id = `filter-${idGenerate()}`
      const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'filter')
      filterElement.setAttribute('id', id)
      filterElement.setAttribute('filterUnits', "userSpaceOnUse")
      filterElement.append(...containerSvgFilters)
      element.appendChild(filterElement)
      // console.log(this.constructor.name, "svgElement", "adding filter", id)
      containerSvgItem.setAttribute('filter', `url(#${id})`)
    }
    const svg: Svg = { id, element, changeHandler, clip, rect }
    return svg
  }
  
  private get time(): Time { return this.preview.time }

  private _timeRange?: TimeRange
  private get timeRange() { return this._timeRange ||= this.clip.timeRange(this.quantize) }
}

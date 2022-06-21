import { assertContainer } from "../../../Container/Container"
import { Rect } from "../../../declarations"
import { Dimensions } from "../../../Setup/Dimensions"
import { Transforms } from "../../../MoveMe"
import { Evaluator, EvaluatorArgs } from "../../../Helpers/Evaluator"
import { assertVisibleClip, VisibleClip } from "../../../Media/VisibleClip/VisibleClip"
import { NamespaceSvg } from "../../../Setup/Constants"
import { TransformType } from "../../../Setup/Enums"
import { idGenerate } from "../../../Utility/Id"
import { svgOfDimensions, svgTransformAttribute } from "../../../Utility/Svg"
import { Preview } from "../Preview"
import { TrackPreview, TrackPreviewArgs } from "./TrackPreview"


export class TrackPreviewClass implements TrackPreview {
  constructor(public args: TrackPreviewArgs) {
    this.selected = this.filterGraph.selectedClip === this.clip
  }

  get clip(): VisibleClip { return this.args.clip }

  editing = true

  private _evaluator?: Evaluator
  get evaluator() { return this._evaluator ||= this.evaluatorInitialize }
  get evaluatorInitialize(): Evaluator {
    const { filterGraph, args } = this
    const { timeRange, tweenTime } = args
    const { size, editor } = filterGraph
    const evaluatorArgs: EvaluatorArgs = {
      instance: this.clip, outputDimensions: size, editing: !!editor,
      timeRange, tweenTime
    }
    return new Evaluator(evaluatorArgs)
  }

  get filterGraph(): Preview { return this.args.filterGraph }

  selected = false

  private transformedRect(dimensions: Dimensions, transforms: Transforms): Rect {
    let { width, height } = dimensions
    let x = 0
    let y = 0

    transforms.reverse().forEach(transform => {
      const { transformType, x: xPos, y: yPos } = transform
      switch (transformType) {
        case TransformType.Scale: {
          width = width * xPos
          height = height * yPos
          break
        }
        case TransformType.Translate: {
          x += xPos
          y += yPos
          break
        }
      }
    })
    const rect = { x, y, width, height }

    // console.log(this.constructor.name, "transformedRect", dimensions, rect, transforms)
    return rect
  }
  get svg(): SVGSVGElement {
    const { filterGraph, clip, transforms, evaluator } = this
    assertVisibleClip(clip)
    const { container, content } = clip
    assertContainer(container)

    const { size } = filterGraph
    evaluator.instance = container
    const initialSvgContent = container.svgContent(this, size)
    const intrinsicDimensions = container.intrinsicDimensions()
    transforms.push(...container.transforms(this))
    const transformSvgContent = container.transformSvgContent(this)

    const transformAttribute = svgTransformAttribute(transforms)
    initialSvgContent.setAttribute('transform', transformAttribute)
    initialSvgContent.setAttribute('transform-origin', 'top left')

    const containerRect = this.transformedRect(intrinsicDimensions, transforms)

    evaluator.instance = content
    const fillSvgContent = content.svgContent(this, containerRect)
    // console.log(this.constructor.name, "svgNew", transforms)
    const svgElement = svgOfDimensions(size)


    const maskId = `mask-${idGenerate()}`

    fillSvgContent.setAttribute('x', String(containerRect.x))
    fillSvgContent.setAttribute('y', String(containerRect.y))

    const maskElement = globalThis.document.createElementNS(NamespaceSvg, 'mask')
    maskElement.setAttribute('id', maskId)
    fillSvgContent.setAttribute('mask', `url(#${maskId})`)
    fillSvgContent.setAttribute('mask-mode', 'alpha')

    maskElement.append(initialSvgContent)
    svgElement.append(maskElement)
    svgElement.append(fillSvgContent)

    transformSvgContent.setAttribute('transform', transformAttribute)
    transformSvgContent.setAttribute('transform-origin', 'top left')
    svgElement.append(transformSvgContent)
    const svgFilters = clip.svgFilters(this)
    if (svgFilters.length) {
      const id = `filter-${idGenerate()}`
      const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'filter')

      // filterElement.setAttribute('width', String(Math.max(outputWidth, inputWidth)))
      // filterElement.setAttribute('height', String(Math.max(outputHeight, inputHeight)))
      filterElement.setAttribute('id', id)
      filterElement.setAttribute('filterUnits', "userSpaceOnUse")
      filterElement.append(...svgFilters)
      svgElement.appendChild(filterElement)
      fillSvgContent.setAttribute('filter', `url(#${id})`)
    }
    return svgElement
  }

  get size(): Dimensions { return this.filterGraph.size }

  transforms: Transforms = []
}

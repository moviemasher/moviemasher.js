import { LoadedImage, LoadedMedia, UnknownObject } from "../../../declarations"
import { ContainerDefinitionMixin } from "../ContainerDefinitionMixin"
import { ShapeContainerClass } from "./ShapeContainerClass"
import {
  ShapeContainer, ShapeContainerDefinition,
  ShapeContainerDefinitionObject, ShapeContainerObject
} from "./ShapeContainer"
import { TweenableDefinitionMixin } from "../../../Mixin/Tweenable/TweenableDefinitionMixin"
import { isAboveZero, isPopulatedString } from "../../../Utility/Is"
import { svgSvgElement, svgPathElement, svgPolygonElement, svgSetTransformRects } from "../../../Utility/Svg"
import { Size, sizeAboveZero, sizeCover } from "../../../Utility/Size"
import { centerPoint } from "../../../Utility/Rect"
import { DefaultContainerId } from "../Container"
import { MediaBase } from "../../MediaBase"
import { Errors } from "../../../Setup/Errors"
import { CommandProbeData } from "../../../Loader"
import { DefinitionType, MediaDefinitionType } from "../../../Setup/Enums"

const ShapeContainerDefinitionWithTweenable = TweenableDefinitionMixin(MediaBase)
const ShapeContainerDefinitionWithContainer = ContainerDefinitionMixin(ShapeContainerDefinitionWithTweenable)
export class ShapeContainerDefinitionClass extends ShapeContainerDefinitionWithContainer implements ShapeContainerDefinition {
  constructor(...args: any[]) {
    const [object] = args
    
    super(object)
    
    const { path, pathHeight, pathWidth } = object as ShapeContainerDefinitionObject
    if (path) this.path = path
    if (isAboveZero(pathWidth)) this.pathWidth = pathWidth
    if (isAboveZero(pathHeight)) this.pathHeight = pathHeight
  }


  loadedImage?: LoadedImage | undefined
  previewSize?: Size | undefined
  sourceSize?: Size | undefined
  alpha?: boolean | undefined
  source: string = ''
  url: string = ''
  bytes: number = 0
  mimeType: string = ''
  info?: CommandProbeData | undefined

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const { id, pathHeight: height, pathWidth: width, path } = this
    if (id === DefaultContainerId) {
      return Promise.resolve(svgSvgElement(size, svgPolygonElement(size, '', 'currentColor')))
    }
    const inSize = { width, height }
    if (!(sizeAboveZero(inSize) && isPopulatedString(path))) return

    const coverSize = sizeCover(inSize, size, true)
    const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
    const pathElement = svgPathElement(path)
    svgSetTransformRects(pathElement, inSize, outRect)
    return Promise.resolve(svgSvgElement(size, pathElement))
  }

  instanceFromObject(object: ShapeContainerObject = {}): ShapeContainer {
    return new ShapeContainerClass(this.instanceArgs(object))
  }

  isVector = true

  get loadedMediaPromise(): Promise<LoadedMedia> {
    console.trace(this.constructor.name, 'loadedMediaPromise')
    throw new Error(Errors.unimplemented)
  }
  path = ""

  pathHeight = 0

  pathWidth = 0

  toJSON(): UnknownObject {
    const object = super.toJSON()
    if (this.path) object.path = this.path
    if (isAboveZero(this.pathHeight)) object.pathHeight = this.pathHeight
    if (isAboveZero(this.pathWidth)) object.pathWidth = this.pathWidth
    return object
  }

  type = DefinitionType.Image as MediaDefinitionType
}
